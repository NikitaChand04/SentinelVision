"""
Convolutional Autoencoder for video frame anomaly detection.

Architecture:
  Encoder: 3 conv layers + bottleneck
  Decoder: 3 transposed conv layers

Trained on normal frames from school activity videos.
At inference: frames with high reconstruction error = anomaly.
"""

import torch
import torch.nn as nn


class ConvAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()

        # ── Encoder ───────────────────────────────────────────────────────────
        self.encoder = nn.Sequential(
            # 1×64×64 → 16×32×32
            nn.Conv2d(1, 16, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(16),
            nn.LeakyReLU(0.2, inplace=True),
            # 16×32×32 → 32×16×16
            nn.Conv2d(16, 32, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(0.2, inplace=True),
            # 32×16×16 → 64×8×8
            nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.2, inplace=True),
            # 64×8×8 → 128×4×4
            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2, inplace=True),
        )

        # ── Decoder ───────────────────────────────────────────────────────────
        self.decoder = nn.Sequential(
            # 128×4×4 → 64×8×8
            nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.2, inplace=True),
            # 64×8×8 → 32×16×16
            nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(0.2, inplace=True),
            # 32×16×16 → 16×32×32
            nn.ConvTranspose2d(32, 16, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.BatchNorm2d(16),
            nn.LeakyReLU(0.2, inplace=True),
            # 16×32×32 → 1×64×64
            nn.ConvTranspose2d(16, 1, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid(),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.decoder(self.encoder(x))

    def reconstruction_error(self, x: torch.Tensor) -> torch.Tensor:
        """Per-sample MSE reconstruction error."""
        recon = self.forward(x)
        return ((recon - x) ** 2).mean(dim=[1, 2, 3])