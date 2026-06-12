/**
 * useVideoUpload.js — custom React hook that manages the full
 * upload → analyze flow in one place.
 *
 * Usage:
 *   const {
 *     stage, file, progress, error, result,
 *     selectFile, startAnalysis, reset,
 *   } = useVideoUpload()
 *
 * Stages:
 *   "idle"      → no file chosen
 *   "selected"  → file validated and ready
 *   "uploading" → uploading to backend (progress 0-100)
 *   "analyzing" → AI model running on server
 *   "done"      → result available
 *   "error"     → something went wrong (error string set)
 */

import { useState, useCallback } from 'react'
import { uploadVideo, analyzeVideo } from '../api/sentinel'

const ALLOWED_EXTENSIONS = ['mp4', 'avi', 'mov', 'mkv']
const MAX_MB = 500

// ── Validation ────────────────────────────────────────────────────────────────
function validateFile(file) {
  if (!file) return 'No file selected.'
  const ext = file.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return `Unsupported format ".${ext}". Please use MP4, AVI, MOV or MKV.`
  if (file.size > MAX_MB * 1024 * 1024)
    return `File is too large. Maximum size is ${MAX_MB} MB.`
  return null // valid
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useVideoUpload() {
  const [stage,      setStage]      = useState('idle')
  const [file,       setFile]       = useState(null)
  const [progress,   setProgress]   = useState(0)
  const [error,      setError]      = useState('')
  const [uploadInfo, setUploadInfo] = useState(null)  // server UploadResponse
  const [result,     setResult]     = useState(null)  // server AnalysisResult

  // ── Select / validate file ─────────────────────────────────────────────────
  const selectFile = useCallback((f) => {
    const err = validateFile(f)
    if (err) {
      setError(err)
      setStage('error')
      return false
    }
    setFile(f)
    setError('')
    setStage('selected')
    return true
  }, [])

  // ── Upload then analyze ────────────────────────────────────────────────────
  const startAnalysis = useCallback(async () => {
    if (!file) return

    try {
      // 1. Upload
      setStage('uploading')
      setProgress(0)
      const info = await uploadVideo(file, (pct) => setProgress(pct))
      setUploadInfo(info)

      // 2. Analyze
      setStage('analyzing')
      const analysisResult = await analyzeVideo(info.video_id)
      setResult(analysisResult)
      setStage('done')
      return analysisResult

    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Something went wrong. Please try again.'
      setError(msg)
      setStage('error')
      return null
    }
  }, [file])

  // ── Reset everything ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setStage('idle')
    setFile(null)
    setProgress(0)
    setError('')
    setUploadInfo(null)
    setResult(null)
  }, [])

  // ── Derived helpers ────────────────────────────────────────────────────────
  const isLoading = stage === 'uploading' || stage === 'analyzing'
  const isDone    = stage === 'done'
  const isError   = stage === 'error'

  return {
    // State
    stage,
    file,
    progress,
    error,
    uploadInfo,
    result,

    // Derived
    isLoading,
    isDone,
    isError,

    // Actions
    selectFile,
    startAnalysis,
    reset,
  }
}