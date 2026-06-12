"""
detect.py — Inference helpers used by the backend anomaly detector service.

Exports:
    load_model(path)        → ConvAutoencoder
    score_frames(model, paths) → np.ndarray of anomaly scores in [0, 1]
"""

import os
import json
import numpy as np

import torch
from PIL import Image
import torchvision.transforms as T

from ai_module.models.autoencoder import ConvAutoencoder

# ── Transform ─────────────────────────────────────────────────────────────────
_TRANSFORM = T.Compose([
    T.Grayscale(num_output_channels=1),
    T.Resize((64, 64)),
    T.ToTensor(),
])


def load_model(model_path: str) -> ConvAutoencoder:
    """Load saved autoencoder weights."""
    model = ConvAutoencoder()
    state = torch.load(model_path, map_location="cpu")
    model.load_state_dict(state)
    model.eval()
    return model


def _load_threshold(model_path: str) -> float:
    """Load anomaly threshold from model_meta.json saved alongside weights."""
    meta_path = os.path.join(os.path.dirname(model_path), "model_meta.json")
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            meta = json.load(f)
        return float(meta.get("threshold", 0.01))
    return 0.01  # sensible fallback


@torch.no_grad()
def score_frames(model: ConvAutoencoder, frame_paths: list) -> np.ndarray:
    """
    Score each frame by its reconstruction error.
    Returns an ndarray of anomaly scores in [0, 1].
    """
    errors = []
    for path in frame_paths:
        try:
            img    = Image.open(path).convert("RGB")
            tensor = _TRANSFORM(img).unsqueeze(0)           # [1, 1, 64, 64]
            err    = model.reconstruction_error(tensor).item()
            errors.append(err)
        except Exception:
            errors.append(0.0)

    errors = np.array(errors, dtype=np.float32)

    # Normalise to [0, 1] using the 99th percentile so outliers stay at 1.0
    p99 = np.percentile(errors, 99) or 1e-6
    scores = np.clip(errors / p99, 0.0, 1.0)
    return scores