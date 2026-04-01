import numpy as np
import cv2, os
from tensorflow.keras.models import load_model
from config import FRAME_FOLDER, MODEL_PATH, THRESHOLD_FACTOR

def detect():
    model = load_model(MODEL_PATH)

    data = []
    files = sorted(os.listdir(FRAME_FOLDER))

    for f in files:
        img = cv2.imread(os.path.join(FRAME_FOLDER,f))
        img = img / 255.0
        data.append(img)

    data = np.array(data)

    pred = model.predict(data)

    errors = np.mean((data - pred)**2, axis=(1,2,3))

    threshold = np.mean(errors) + THRESHOLD_FACTOR*np.std(errors)

    anomaly = np.where(errors > threshold)[0]

    return anomaly.tolist()
