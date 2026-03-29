# Import OpenCV library (used to handle video and images)
import cv2

# -------------------------------
# 🔹 CHANGE 1 (IMPORTANT)
# Put your correct video file name here
# Make sure video is in SAME folder as this file
# -------------------------------
video_path = "sample.mp4"

# Open the video file
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
# If False → video problem (your current issue)
if not cap.isOpened():
    print("Error: Video not opened properly. Check file path or format.")
    exit()

# Counter for frames
frame_count = 0

# Loop to read video frame by frame
while True:
    # Read one frame from video
    ret, frame = cap.read()

    # If frame not read → video ended or error
    if not ret:
        break

    # Increase frame count
    frame_count += 1

    # OPTIONAL: Show the frame (can remove if not needed)
    # cv2.imshow("Frame", frame)

    # Press 'q' to exit early
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release video
cap.release()

# Close all windows (if opened)
cv2.destroyAllWindows()

# Print how many frames were extracted
print("Frames extracted:", frame_count)

# -------------------------------
# 🔹 CHANGE 2 (IMPORTANT DEBUG)
# If frames = 0 → video is corrupted or not readable
# -------------------------------
if frame_count == 0:
    print("No frames found. Your video is likely corrupted or unsupported format.")
