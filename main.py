# Import OpenCV (used for video processing)
import cv2

# -----------------------------------
# 🔹 FULL MAIN CODE STARTS HERE
# -----------------------------------

# Path of your video file
# IMPORTANT: Video must be in same folder as this file
video_path = "sample.mp4"

# Open the video file
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
if not cap.isOpened():
    print("❌ Error: Video not opened properly.")
    print("👉 Check file name, location, or format.")
    exit()

# Print success message
print("✅ Video opened successfully")

# Counter for frames
frame_count = 0

# Loop to read frames one by one
while True:
    # Read a frame
    ret, frame = cap.read()

    # If frame not read → end of video or error
    if not ret:
        break

    # Increase frame count
    frame_count += 1

    # OPTIONAL: Show frames (you can remove this if not needed)
    # cv2.imshow("Frame", frame)

    # Press 'q' to stop early
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video resource
cap.release()

# Close all OpenCV windows
cv2.destroyAllWindows()

# Print total frames extracted
print("📊 Frames extracted:", frame_count)

# -----------------------------------
# 🔹 DEBUGGING SECTION
# -----------------------------------

# If no frames are extracted, show clear message
if frame_count == 0:
    print("⚠️ No frames found!")
    print("👉 Possible reasons:")
    print("   - Video file is corrupted")
    print("   - Unsupported format")
    print("   - Wrong file path or name")
    print("   - Video codec issue")

# -----------------------------------
# 🔹 OPTIONAL TEST (VERY IMPORTANT DEBUG)
# -----------------------------------

# Re-check video opening status
cap_test = cv2.VideoCapture(video_path)

print("🔍 Debug: Is video opened?", cap_test.isOpened())

cap_test.release()
