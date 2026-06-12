"""
Preprocessing utilities — frame loading, normalization, dataset creation.
"""

import os
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset
from typing import List, Tuple


# ── Frame extraction ──────────────────────────────────────────────────────────
def extract_frames(video_path: str, target_size: Tuple[int, int] = (64, 64)) -> List[np.ndarray]:
    """
    Extract all grayscale frames from a video, resized to target_size.
    Returns list of numpy arrays in [0, 1] range.
    """
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray  = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = cv2.resize(gray, target_size)
        frames.append(small.astype(np.float32) / 255.0)
    cap.release()
    return frames


def extract_frames_from_dir(videos_dir: str, target_size=(64, 64)) -> List[np.ndarray]:
    """Walk a directory and extract frames from every video file found."""
    all_frames = []
    exts = {".mp4", ".avi", ".mov", ".mkv"}
    for fname in sorted(os.listdir(videos_dir)):
        if os.path.splitext(fname)[1].lower() in exts:
            path = os.path.join(videos_dir, fname)
            frames = extract_frames(path, target_size)
            all_frames.extend(frames)
            print(f"  Loaded {len(frames)} frames from {fname}")
    return all_frames


# ── Temporal window sampling ──────────────────────────────────────────────────
def sliding_windows(frames: List[np.ndarray], window: int = 16, stride: int = 8):
    """Yield (start_idx, window_frames) tuples."""
    for i in range(0, len(frames) - window + 1, stride):
        yield i, frames[i: i + window]


# ── Dataset class ─────────────────────────────────────────────────────────────
class FrameDataset(Dataset):
    """
    Dataset for training the autoencoder.
    Each item is a single normalised grayscale frame tensor [1, H, W].
    """

    def __init__(self, frames: List[np.ndarray]):
        self.frames = frames

    def __len__(self):
        return len(self.frames)

    def __getitem__(self, idx) -> torch.Tensor:
        frame = self.frames[idx]
        return torch.from_numpy(frame).unsqueeze(0)  # [1, H, W]