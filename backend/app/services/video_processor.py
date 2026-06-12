"""
VideoProcessor — extracts frames from uploaded video for AI analysis.
"""

import os
import cv2
import numpy as np
from typing import Dict, Any


class VideoProcessor:
    def __init__(self, video_path: str, frames_dir: str, video_id: str):
        self.video_path = video_path
        self.frames_dir = frames_dir
        self.video_id   = video_id
        self.output_dir = os.path.join(frames_dir, video_id)
        os.makedirs(self.output_dir, exist_ok=True)

    # ──────────────────────────────────────────────────────────────────────────
    def process(self) -> Dict[str, Any]:
        """
        Opens video, extracts all frames, computes optical flow features.
        Returns metadata dict consumed by AnomalyDetector.
        """
        cap = cv2.VideoCapture(self.video_path)
        if not cap.isOpened():
            raise RuntimeError(f"Cannot open video: {self.video_path}")

        fps         = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration    = total_frames / fps

        frames        = []
        frame_paths   = []
        flow_features = []

        prev_gray = None
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Optical flow magnitude (motion energy)
            if prev_gray is not None:
                flow = cv2.calcOpticalFlowFarneback(
                    prev_gray, gray, None,
                    pyr_scale=0.5, levels=3, winsize=15,
                    iterations=3, poly_n=5, poly_sigma=1.2, flags=0,
                )
                magnitude, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
                flow_features.append(float(magnitude.mean()))
            else:
                flow_features.append(0.0)

            # Save every frame (downscaled for storage efficiency)
            small = cv2.resize(frame, (320, 180))
            path  = os.path.join(self.output_dir, f"frame_{frame_idx:05d}.jpg")
            cv2.imwrite(path, small, [cv2.IMWRITE_JPEG_QUALITY, 80])

            frames.append(gray)
            frame_paths.append(path)
            prev_gray = gray
            frame_idx += 1

        cap.release()

        return {
            "video_path":    self.video_path,
            "output_dir":    self.output_dir,
            "fps":           fps,
            "total_frames":  len(frames),
            "duration":      duration,
            "frame_paths":   frame_paths,
            "flow_features": flow_features,
        }