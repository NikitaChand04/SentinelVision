import os
import cv2
import numpy as np

def load_frames(folder):
    frames = []
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        img = cv2.imread(path)
        if img is not None:
            img = cv2.resize(img, (128, 128))
            img = img / 255.0
            frames.append(img)
    return np.array(frames)
