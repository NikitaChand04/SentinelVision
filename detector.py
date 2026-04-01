import numpy as np
import cv2
import os
from tensorflow.keras.models import load_model

MODEL_PATH = "model.h5"
FRAME_FOLDER = "frames"
UPLOAD_FOLDER = "uploads"

def extract_frames(video_path):
    if not os.path.exists(FRAME_FOLDER):
        os.makedirs(FRAME_FOLDER)

    # clear old frames
    for f in os.listdir(FRAME_FOLDER):
        os.remove(os.path.join(FRAME_FOLDER, f))

    cap = cv2.VideoCapture(video_path)
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (64,64))
        cv2.imwrite(f"{FRAME_FOLDER}/frame_{count}.jpg", frame)

        count += 1

    cap.release()
    return count


def detect_anomaly(video_path):
    model = load_model(MODEL_PATH)

    extract_frames(video_path)

    data = []
    files = sorted(os.listdir(FRAME_FOLDER))

    for f in files:
        img = cv2.imread(os.path.join(FRAME_FOLDER, f))
        img = img / 255.0
        data.append(img)

    data = np.array(data)

    pred = model.predict(data)

    errors = np.mean((data - pred)**2, axis=(1,2,3))

    threshold = np.mean(errors) + 2*np.std(errors)

    anomaly = np.where(errors > threshold)[0]

    return anomaly.tolist()


# 🔥 THIS PART WAS MISSING
if __name__ == "__main__":
    video_path = os.path.join(UPLOAD_FOLDER, "test.mp4")

    if not os.path.exists(video_path):
        print("❌ No test video found in uploads folder")
    else:
        result = detect_anomaly(video_path)

        if result:
            print("⚠️ Anomaly Detected at frames:", result)
        else:
            print("✅ No Anomaly Detected")
