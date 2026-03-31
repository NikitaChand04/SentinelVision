import cv2
import os

def extract_frames(video_path, output_folder="frames", max_frames=200):
    # Create folder if not exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    cap = cv2.VideoCapture(video_path)

    count = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        # Save frame
        frame_path = os.path.join(output_folder, f"frame_{count}.jpg")
        cv2.imwrite(frame_path, frame)

        count += 1

        # LIMIT frames (VERY IMPORTANT)
        if count >= max_frames:
            break

    cap.release()

    print(f"Frames extracted: {count}")
