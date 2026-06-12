"""
Upload route — accepts MP4 video, saves to disk, returns video_id.
"""

import os
import uuid
import aiofiles

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import UploadResponse
from app.utils.helpers import get_video_duration

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}
MAX_FILE_SIZE_MB = 500


@router.post("/upload", response_model=UploadResponse)
async def upload_video(file: UploadFile = File(...)):
    # ── Validate extension ────────────────────────────────────────────────────
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}",
        )

    # ── Save file ─────────────────────────────────────────────────────────────
    video_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{video_id}{ext}")

    total_bytes = 0
    async with aiofiles.open(save_path, "wb") as out_file:
        while chunk := await file.read(1024 * 1024):  # 1 MB chunks
            total_bytes += len(chunk)
            if total_bytes > MAX_FILE_SIZE_MB * 1024 * 1024:
                await out_file.close()
                os.remove(save_path)
                raise HTTPException(
                    status_code=413,
                    detail=f"File exceeds {MAX_FILE_SIZE_MB} MB limit.",
                )
            await out_file.write(chunk)

    duration = get_video_duration(save_path)

    return UploadResponse(
        video_id=video_id,
        filename=file.filename,
        size_bytes=total_bytes,
        duration_seconds=duration,
        message="Video uploaded successfully. Ready for analysis.",
    )