"""
Analyze route — triggers AI anomaly detection on an uploaded video.
"""

import os
import time
import glob

from fastapi import APIRouter, HTTPException
from app.models.schemas import AnalysisResult
from app.services.video_processor import VideoProcessor
from app.services.anomaly_detector import AnomalyDetector

router = APIRouter()

UPLOAD_DIR  = "uploads"
FRAMES_DIR  = "frames"


@router.post("/analyze/{video_id}", response_model=AnalysisResult)
async def analyze_video(video_id: str):
    # ── Find the uploaded video ───────────────────────────────────────────────
    matches = glob.glob(os.path.join(UPLOAD_DIR, f"{video_id}.*"))
    if not matches:
        raise HTTPException(status_code=404, detail="Video not found. Please upload first.")

    video_path = matches[0]
    filename   = os.path.basename(video_path)
    start_time = time.time()

    # ── Process video (extract frames) ───────────────────────────────────────
    processor = VideoProcessor(video_path, frames_dir=FRAMES_DIR, video_id=video_id)
    video_info = processor.process()

    # ── Run anomaly detection ─────────────────────────────────────────────────
    detector = AnomalyDetector()
    result   = detector.detect(video_info, video_id=video_id)

    processing_time = time.time() - start_time

    return AnalysisResult(
        video_id=video_id,
        filename=filename,
        duration_seconds=video_info["duration"],
        total_frames=video_info["total_frames"],
        anomaly_detected=result["anomaly_detected"],
        anomaly_frames=result["anomaly_frames"],
        timeline=result["timeline"],
        insights=result["insights"],
        video_url=f"/uploads/{filename}",
        processing_time_seconds=round(processing_time, 2),
    )