from flask import Flask, render_template, request
import os
from config import UPLOAD_FOLDER
from processing.extractor import extract
from processing.detector import detect

app = Flask(__name__)

@app.route("/", methods=["GET","POST"])
def home():
    if request.method == "POST":
        file = request.files["video"]
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        extract(path)

        frames = detect()

        if frames:
            result = "⚠️ Anomaly Detected"
        else:
            result = "✅ No Anomaly"

        return render_template("result.html", result=result, frames=frames)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
