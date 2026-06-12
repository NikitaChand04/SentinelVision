"""
Utility helpers for the backend.
"""

import cv2
from typing import Optional


def get_video_duration(video_path: str) -> Optional[float]:
    """Returns video duration in seconds, or None on failure."""
    try:
        cap = cv2.VideoCapture(video_path)
        fps    = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        cap.release()
        return round(frames / fps, 2) if fps > 0 else None
    except Exception:
        return None