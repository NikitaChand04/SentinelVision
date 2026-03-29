import cv2
import os
import numpy as np
from data_loader import load_frames
from model import build_model

# Step 1: Extract frames from video
video_path = r"./sample.mp4"

frame_folder = "frames"

if not os.path.exists(frame_folder):
    os.makedirs(frame_folder)

cap = cv2.VideoCapture(video_path)

# IMPORTANT CHECK
if not cap.isOpened():
    print("Error: Video file not opened. Check file path.")
    exit()

count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (128, 128))
    cv2.imwrite(f"{frame_folder}/frame_{count}.jpg", frame)
    count += 1

cap.release()

print("Frames extracted:", count)

# Step 2: Load frames
data = load_frames(frame_folder)

# Step 3: Build model
model = build_model()

# Step 4: Train model
if len(data) > 0:
    model.fit(data, data, epochs=3, batch_size=8)
    model.save("anomaly_model.h5")
    print("Model trained and saved.")
else:
    print("No data found.")
