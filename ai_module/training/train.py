"""
train.py — Train the Convolutional Autoencoder on school activity videos.

Usage:
    python training/train.py --dataset ../dataset/videos --epochs 50

The script:
  1. Extracts all frames from every video in --dataset folder.
  2. Trains an autoencoder to reconstruct "normal-looking" frames.
  3. Saves the trained model to ai_module/models/autoencoder.pth
  4. Also saves the anomaly threshold (95th percentile of training errors).
"""

import os
import sys
import argparse
import json

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split

# Allow imports from project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from ai_module.models.autoencoder import ConvAutoencoder
from ai_module.utils.preprocessing import extract_frames_from_dir, FrameDataset


# ── Argument parsing ──────────────────────────────────────────────────────────
def parse_args():
    p = argparse.ArgumentParser(description="Train Sentinel Vision Autoencoder")
    p.add_argument("--dataset", type=str, required=True,
                   help="Path to folder containing training videos")
    p.add_argument("--epochs",  type=int, default=50,
                   help="Number of training epochs (default: 50)")
    p.add_argument("--batch",   type=int, default=64,
                   help="Batch size (default: 64)")
    p.add_argument("--lr",      type=float, default=1e-3,
                   help="Learning rate (default: 0.001)")
    p.add_argument("--device",  type=str, default="auto",
                   help="Device: cpu | cuda | auto")
    return p.parse_args()


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    args = parse_args()

    # Device
    if args.device == "auto":
        device = "cuda" if torch.cuda.is_available() else "cpu"
    else:
        device = args.device
    print(f"[Sentinel Vision Training] Using device: {device}")

    # ── Data ──────────────────────────────────────────────────────────────────
    print(f"\n[1/4] Extracting frames from: {args.dataset}")
    frames = extract_frames_from_dir(args.dataset, target_size=(64, 64))
    if not frames:
        print("ERROR: No frames extracted. Check that videos are in the dataset folder.")
        sys.exit(1)
    print(f"  Total frames extracted: {len(frames)}")

    dataset = FrameDataset(frames)
    val_size   = max(1, int(0.1 * len(dataset)))
    train_size = len(dataset) - val_size
    train_ds, val_ds = random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_ds, batch_size=args.batch, shuffle=True,  num_workers=2, pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=args.batch, shuffle=False, num_workers=2)

    # ── Model ─────────────────────────────────────────────────────────────────
    print("\n[2/4] Initialising model...")
    model     = ConvAutoencoder().to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=5, factor=0.5)

    # ── Training loop ─────────────────────────────────────────────────────────
    print(f"\n[3/4] Training for {args.epochs} epochs...")
    best_val_loss = float("inf")
    save_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "autoencoder.pth")

    for epoch in range(1, args.epochs + 1):
        # Train
        model.train()
        train_loss = 0.0
        for batch in train_loader:
            batch = batch.to(device)
            recon = model(batch)
            loss  = criterion(recon, batch)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * len(batch)
        train_loss /= train_size

        # Validate
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                batch    = batch.to(device)
                recon    = model(batch)
                val_loss += criterion(recon, batch).item() * len(batch)
        val_loss /= val_size

        scheduler.step(val_loss)

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), save_path)

        if epoch % 5 == 0 or epoch == 1:
            print(f"  Epoch {epoch:3d}/{args.epochs}  "
                  f"train_loss={train_loss:.6f}  val_loss={val_loss:.6f}"
                  + (" ← best" if val_loss == best_val_loss else ""))

    print(f"\n  Best validation loss: {best_val_loss:.6f}")
    print(f"  Model saved to: {save_path}")

    # ── Compute anomaly threshold ─────────────────────────────────────────────
    print("\n[4/4] Computing anomaly threshold from training errors...")
    model.load_state_dict(torch.load(save_path, map_location=device))
    model.eval()

    all_errors = []
    with torch.no_grad():
        for batch in DataLoader(dataset, batch_size=128, shuffle=False):
            batch  = batch.to(device)
            errors = model.reconstruction_error(batch).cpu().numpy()
            all_errors.extend(errors.tolist())

    import numpy as np
    threshold = float(np.percentile(all_errors, 95))
    print(f"  Anomaly threshold (95th percentile): {threshold:.6f}")

    meta = {"threshold": threshold, "train_frames": len(frames)}
    meta_path = os.path.join(save_dir, "model_meta.json")
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  Metadata saved to: {meta_path}")
    print("\n✅ Training complete! Sentinel Vision is ready for inference.")


if __name__ == "__main__":
    main()