"""
Sentinel Vision — FastAPI Backend Entry Point
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.upload import router as upload_router
from app.routes.analyze import router as analyze_router

# ── Create necessary directories ──────────────────────────────────────────────
os.makedirs("uploads", exist_ok=True)
os.makedirs("frames", exist_ok=True)

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Sentinel Vision API",
    description="AI-Powered School Activity Anomaly Detection",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files (extracted frames served as images) ──────────────────────────
app.mount("/frames", StaticFiles(directory="frames"), name="frames")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(analyze_router, prefix="/api", tags=["Analyze"])


@app.get("/")
async def root():
    return {
        "system": "Sentinel Vision",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)