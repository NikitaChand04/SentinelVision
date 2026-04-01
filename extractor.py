import cv2, os
from config import FRAME_FOLDER, IMG_SIZE, MAX_FRAMES

def extract(video_path):
    if not os.path.exists(FRAME_FOLDER):
        os.makedirs(FRAME_FOLDER)

    for f in os.listdir(FRAME_FOLDER):
        os.remove(os.path.join(FRAME_FOLDER,f))

    cap = cv2.VideoCapture(video_path)
    count = 0

    while True:
        ret, frame = cap.read()
        if not ret or count >= MAX_FRAMES:
            break

        frame = cv2.resize(frame, IMG_SIZE)
        cv2.imwrite(f"{FRAME_FOLDER}/frame_{count}.jpg", frame)

        count += 1

    cap.release()
    return count
