from flask import Flask, render_template, request
import os

from processing.extractor import extract
from processing.detector import detect_anomaly

app = Flask(__name__)

# Upload folder
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Create uploads folder if not exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        if "video" not in request.files:
            return "No file uploaded"

        file = request.files["video"]

        if file.filename == "":
            return "No selected file"

        # Save uploaded file
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        # Call detector
        result_frames = detect_anomaly(file_path)

        # Decide result
        if result_frames:
            result = "⚠️ Anomaly Detected"
        else:
            result = "✅ No Anomaly Detected"

        return render_template("result.html", result=result, frames=result_frames)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
