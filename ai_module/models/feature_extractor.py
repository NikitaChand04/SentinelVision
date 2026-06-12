"""
FeatureExtractor — wraps a pretrained ResNet-18 to extract spatial features
from individual frames. Used optionally alongside the autoencoder.
"""

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as T
from PIL import Image
import numpy as np


class FeatureExtractor(nn.Module):
    def __init__(self, device: str = "cpu"):
        super().__init__()
        backbone = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        # Remove the final FC layer
        self.features = nn.Sequential(*list(backbone.children())[:-1])
        self.device = device
        self.to(device)
        self.eval()

        self.transform = T.Compose([
            T.Resize((64, 64)),
            T.Grayscale(num_output_channels=3),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406],
                        std=[0.229, 0.224, 0.225]),
        ])

    @torch.no_grad()
    def extract(self, image_path: str) -> np.ndarray:
        """Returns a 512-d feature vector for a frame image."""
        img = Image.open(image_path).convert("RGB")
        tensor = self.transform(img).unsqueeze(0).to(self.device)
        feat = self.features(tensor).squeeze().cpu().numpy()
        return feat