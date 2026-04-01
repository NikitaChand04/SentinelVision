import cv2
import os

DATASET_PATH = "dataset"
OUTPUT_PATH = "dataset_frames"

def extract_dataset_frames():
    if not os.path.exists(OUTPUT_PATH):
        os.makedirs(OUTPUT_PATH)

    count = 0

    for video in os.listdir(DATASET_PATH):
        path = os.path.join(DATASET_PATH, video)

        cap = cv2.VideoCapture(path)

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (64,64))
            cv2.imwrite(f"{OUTPUT_PATH}/frame_{count}.jpg", frame)

            count += 1

        cap.release()

    print("Total frames:", count)


if __name__ == "__main__":
    extract_dataset_frames()
