import os
from data_loader import load_frames
from model import build_model

# Path to training data (normal frames)
train_folder = "dataset/Train"

# Load data
data = load_frames(train_folder)

if len(data) == 0:
    print("❌ No training data found")
    exit()

print("✅ Data loaded:", len(data))

# Build model
model = build_model()

# Train model
model.fit(data, data, epochs=5, batch_size=8)

# Save model
model.save("anomaly_model.h5")

print("✅ Model trained and saved")
