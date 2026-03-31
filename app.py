from flask import Flask, render_template, request
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load trained model
model = None
if os.path.exists("anomaly_model.h5"):
    model = load_model("anomaly_model.h5")

def extract_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    frames = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (128, 128))
        frame = frame / 255.0
        frames.append(frame)

    cap.release()
    return np.array(frames)

def detect(frames):
    if model is None:
        return "Model not trained"

    reconstructed = model.predict(frames)
    error = np.mean(np.square(frames - reconstructed))

    if error > 0.02:
        return "Anomaly Detected"
    else:
        return "Normal Activity"

@app.route("/", methods=["GET", "POST"])
def home():
    result = ""

    if request.method == "POST":
        file = request.files["video"]

        if file:
            path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(path)

            frames = extract_frames(path)

            if len(frames) == 0:
                result = "Video not readable"
            else:
                result = detect(frames)

    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)
