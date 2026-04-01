import cv2
import os
import numpy as np
from models.autoencoder import build_model

DATA_PATH = "dataset_frames"

def load_data():
    data = []

    for file in os.listdir(DATA_PATH):
        img = cv2.imread(os.path.join(DATA_PATH, file))
        img = img / 255.0
        data.append(img)

    return np.array(data)


data = load_data()

model = build_model()

model.fit(
    data, data,
    epochs=20,
    batch_size=16,
    shuffle=True
)

model.save("models/model.h5")

print("Model trained successfully!")
