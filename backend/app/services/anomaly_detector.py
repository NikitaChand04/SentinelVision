"""
AnomalyDetector — core AI inference service.

Algorithm:
  1. Uses optical-flow magnitude per frame as the motion signal.
  2. Builds a robust baseline (median + MAD) from the middle 60 % of the video
     (typically the "normal" phase).
  3. Flags frames whose motion deviates strongly from baseline as anomalies.
  4. Additionally detects prolonged inactivity (motion too low for too long).
  5. Labels anomalies using heuristic rules on the motion pattern.

When a trained autoencoder model exists at ai_module/models/autoencoder.pth,
the detector loads it and uses reconstruction error instead of optical flow.
"""

import os
import sys
import math
import numpy as np
from typing import Any, Dict, List

# Optional: load trained model if available
MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "ai_module", "models", "autoencoder.pth"
)

# ── Label bank ────────────────────────────────────────────────────────────────
ANOMALY_LABELS = {
    "inactivity":  "Student inactive for extended duration",
    "isolation":   "Student isolated from group activity",
    "fall":        "Possible fall or collapse detected",
    "deviation":   "Student not following group exercise",
    "attention":   "Attention anomaly detected",
    "hyperactive": "Abnormally high activity detected",
}

SEVERITY_MAP = {
    "fall":        "high",
    "inactivity":  "medium",
    "isolation":   "medium",
    "deviation":   "low",
    "attention":   "low",
    "hyperactive": "medium",
}


class AnomalyDetector:
    def __init__(self):
        self.model_loaded = False
        self._try_load_model()

    # ── Model loading (optional) ───────────────────────────────────────────────
    def _try_load_model(self):
        """Load trained autoencoder if available; fall back to statistical method."""
        if not os.path.exists(MODEL_PATH):
            return
        try:
            sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", ".."))
            import torch
            from ai_module.inference.detect import load_model
            self.model = load_model(MODEL_PATH)
            self.model_loaded = True
        except Exception:
            self.model_loaded = False

    # ── Public API ────────────────────────────────────────────────────────────
    def detect(self, video_info: Dict[str, Any], video_id: str) -> Dict[str, Any]:
        flow   = np.array(video_info["flow_features"], dtype=np.float32)
        fps    = video_info["fps"]
        paths  = video_info["frame_paths"]
        total  = video_info["total_frames"]

        if self.model_loaded:
            scores = self._model_scores(paths)
        else:
            scores = self._statistical_scores(flow)

        anomaly_frames, timeline = self._threshold_and_label(
            scores, paths, fps, video_id
        )

        insights = self._compute_insights(anomaly_frames, video_info["duration"])

        return {
            "anomaly_detected": len(anomaly_frames) > 0,
            "anomaly_frames":   anomaly_frames,
            "timeline":         timeline,
            "insights":         insights,
        }

    # ── Statistical scoring (no trained model) ────────────────────────────────
    def _statistical_scores(self, flow: np.ndarray) -> np.ndarray:
        n = len(flow)
        # Use middle 60 % as baseline
        lo, hi = int(n * 0.20), int(n * 0.80)
        baseline = flow[lo:hi]
        median   = float(np.median(baseline))
        mad      = float(np.median(np.abs(baseline - median))) + 1e-6

        # Modified Z-score (robust)
        z = 0.6745 * (flow - median) / mad
        # Score in [0, 1]; high motion deviation OR low motion for long time
        score = np.clip(np.abs(z) / 8.0, 0.0, 1.0)
        return score.astype(np.float32)

    # ── Model-based scoring ───────────────────────────────────────────────────
    def _model_scores(self, frame_paths: List[str]) -> np.ndarray:
        try:
            import torch
            from ai_module.inference.detect import score_frames
            return score_frames(self.model, frame_paths)
        except Exception:
            # Fall back silently
            flow = np.zeros(len(frame_paths), dtype=np.float32)
            return self._statistical_scores(flow)

    # ── Threshold and classify ────────────────────────────────────────────────
    def _threshold_and_label(
        self,
        scores: np.ndarray,
        paths: List[str],
        fps: float,
        video_id: str,
    ):
        THRESHOLD   = 0.35
        MIN_GAP_SEC = 3.0   # merge anomalies within 3 s
        min_gap_frames = int(MIN_GAP_SEC * fps)

        anomaly_frames = []
        timeline       = []
        last_saved     = -min_gap_frames

        for i, (score, path) in enumerate(zip(scores, paths)):
            if score < THRESHOLD:
                continue
            if i - last_saved < min_gap_frames:
                continue

            ts_sec = i / fps
            ts_str = _fmt_ts(ts_sec)
            label_key, label = self._classify(score, scores, i, fps)
            severity = SEVERITY_MAP.get(label_key, "low")
            img_url  = f"/frames/{video_id}/{os.path.basename(path)}"

            anomaly_frames.append({
                "frame_number":      i,
                "timestamp":         ts_str,
                "timestamp_seconds": round(ts_sec, 2),
                "image_url":         img_url,
                "label":             label,
                "confidence":        round(float(score), 3),
                "severity":          severity,
            })

            timeline.append({
                "timestamp":         ts_str,
                "timestamp_seconds": round(ts_sec, 2),
                "event":             label,
                "severity":          severity,
            })

            last_saved = i

        return anomaly_frames, timeline

    # ── Classify anomaly type from context ────────────────────────────────────
    def _classify(
        self, score: float, scores: np.ndarray, idx: int, fps: float
    ):
        window = 30  # ~1 second of context
        lo     = max(0, idx - window)
        hi     = min(len(scores), idx + window)
        local  = scores[lo:hi]
        mean_local = float(local.mean())

        if score > 0.75 and mean_local < 0.25:
            return "fall", ANOMALY_LABELS["fall"]
        if mean_local < 0.15:
            return "inactivity", ANOMALY_LABELS["inactivity"]
        if score > 0.70:
            return "hyperactive", ANOMALY_LABELS["hyperactive"]
        if score > 0.50:
            return "deviation", ANOMALY_LABELS["deviation"]
        if score > 0.40:
            return "isolation", ANOMALY_LABELS["isolation"]
        return "attention", ANOMALY_LABELS["attention"]

    # ── AI Insights ───────────────────────────────────────────────────────────
    def _compute_insights(
        self, anomaly_frames: List[dict], duration: float
    ) -> dict:
        total = len(anomaly_frames)

        if total == 0:
            return {
                "total_anomalies":    0,
                "most_severe_label":  "None",
                "total_duration_seconds": 0.0,
                "risk_level":         "Safe",
                "risk_score":         0.0,
            }

        severities = {"low": 1, "medium": 2, "high": 3}
        worst = max(anomaly_frames, key=lambda f: severities.get(f["severity"], 0))

        total_anom_sec = min(total * 3.0, duration)
        risk_score = min(100.0, (total / max(1, duration / 5)) * 100)

        if risk_score < 20:
            risk_level = "Low"
        elif risk_score < 45:
            risk_level = "Medium"
        elif risk_score < 70:
            risk_level = "High"
        else:
            risk_level = "Critical"

        return {
            "total_anomalies":         total,
            "most_severe_label":       worst["label"],
            "total_duration_seconds":  round(total_anom_sec, 1),
            "risk_level":              risk_level,
            "risk_score":              round(risk_score, 1),
        }


# ── Helpers ───────────────────────────────────────────────────────────────────
def _fmt_ts(seconds: float) -> str:
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"