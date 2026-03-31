import os
from data_loader import extract_frames

def main():
    video_path = "sample.mp4"   # your video name

    if not os.path.exists(video_path):
        print("Video file not found!")
        return

    # DELETE old frames (important)
    if os.path.exists("frames"):
        for file in os.listdir("frames"):
            os.remove(os.path.join("frames", file))
    else:
        os.makedirs("frames")

    # Call extraction with LIMIT
    extract_frames(video_path, output_folder="frames", max_frames=200)

if __name__ == "__main__":
    main()
