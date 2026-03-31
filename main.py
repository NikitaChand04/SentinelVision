import cv2
import os

def main():
    video_path = "sample.mp4"

    if not os.path.exists(video_path):
        print("Video file not found!")
        return

    # Create / clean frames folder
    if not os.path.exists("frames"):
        os.makedirs("frames")
    else:
        for f in os.listdir("frames"):
            os.remove(os.path.join("frames", f))

    cap = cv2.VideoCapture(video_path)

    count = 0
    max_frames = 200   # 🔥 LIMIT HERE

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        frame_path = os.path.join("frames", f"frame_{count}.jpg")
        cv2.imwrite(frame_path, frame)

        count += 1

        if count >= max_frames:
            break

    cap.release()

    print("Frames extracted:", count)

if __name__ == "__main__":
    main()
