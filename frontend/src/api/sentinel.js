/**
 * Sentinel Vision — API client (axios-based)
 */

import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 300_000, // 5 min for large videos
})

// ── Upload video ──────────────────────────────────────────────────────────────
export async function uploadVideo(file, onProgress) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await API.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress?.(Math.round((e.loaded / e.total) * 100)),
  })
  return data // UploadResponse
}

// ── Run analysis ──────────────────────────────────────────────────────────────
export async function analyzeVideo(videoId) {
  const { data } = await API.post(`/analyze/${videoId}`)
  return data // AnalysisResult
}

// ── Health check ──────────────────────────────────────────────────────────────
export async function checkHealth() {
  const { data } = await API.get('/health')
  return data
}