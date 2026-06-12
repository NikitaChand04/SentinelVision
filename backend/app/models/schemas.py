"""
Pydantic schemas for request/response models.
"""

from typing import List, Optional
from pydantic import BaseModel


class AnomalyFrame(BaseModel):
    frame_number: int
    timestamp: str          # e.g. "00:12"
    timestamp_seconds: float
    image_url: str          # served by FastAPI static mount
    label: str
    confidence: float       # 0.0 – 1.0
    severity: str           # "low" | "medium" | "high"


class TimelineEvent(BaseModel):
    timestamp: str
    timestamp_seconds: float
    event: str
    severity: str


class AIInsights(BaseModel):
    total_anomalies: int
    most_severe_label: str
    total_duration_seconds: float
    risk_level: str         # "Safe" | "Low" | "Medium" | "High" | "Critical"
    risk_score: float       # 0 – 100


class AnalysisResult(BaseModel):
    video_id: str
    filename: str
    duration_seconds: float
    total_frames: int
    anomaly_detected: bool
    anomaly_frames: List[AnomalyFrame]
    timeline: List[TimelineEvent]
    insights: AIInsights
    video_url: str
    processing_time_seconds: float


class UploadResponse(BaseModel):
    video_id: str
    filename: str
    size_bytes: int
    duration_seconds: Optional[float]
    message: str