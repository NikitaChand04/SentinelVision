import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Film, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react'
import ParticleBackground from '../components/animations/ParticleBackground'
import ScanningEffect from '../components/animations/ScanningEffect'
import { uploadVideo, analyzeVideo } from '../api/sentinel'
import { fmtBytes } from '../utils/formatters'

const STAGES = ['idle', 'selected', 'uploading', 'analyzing', 'done', 'error']

export default function UploadPage() {
  const nav = useNavigate()
  const inputRef = useRef(null)
  const [stage, setStage]         = useState('idle')
  const [file, setFile]           = useState(null)
  const [progress, setProgress]   = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [errorMsg, setErrorMsg]   = useState('')
  const [uploadInfo, setUploadInfo] = useState(null)

  // ── File validation ───────────────────────────────────────────────────────
  const validateFile = f => {
    if (!f) return 'No file selected.'
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'Only MP4, AVI, MOV, MKV files are supported.'
    if (f.size > 500 * 1024 * 1024) return 'File size must be under 500 MB.'
    return null
  }

  const selectFile = f => {
    const err = validateFile(f)
    if (err) { setErrorMsg(err); setStage('error'); return }
    setFile(f)
    setStage('selected')
    setErrorMsg('')
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const onDrop = useCallback(e => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) selectFile(f)
  }, [])

  const onDragOver = e => { e.preventDefault(); setDragActive(true) }
  const onDragLeave = () => setDragActive(false)

  // ── Upload & Analyze ──────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return
    try {
      setStage('uploading')
      setProgress(0)
      const info = await uploadVideo(file, p => setProgress(p))
      setUploadInfo(info)

      setStage('analyzing')
      const result = await analyzeVideo(info.video_id)
      nav('/results', { state: { result } })
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || err.message || 'Analysis failed.')
      setStage('error')
    }
  }

  const reset = () => { setStage('idle'); setFile(null); setProgress(0); setErrorMsg('') }

  return (
    <div className="relative min-h-screen" style={{ background: '#020408' }}>
      <ParticleBackground count={50} />
      <div className="fixed inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-mono tracking-widest"
               style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.25)', color: '#00f5ff' }}>
            ◆ VIDEO ANALYSIS
          </div>
          <h1 className="font-display text-4xl font-black mb-3">
            <span className="gradient-text">Upload Your Video</span>
          </h1>
          <p className="text-sm" style={{ color: '#8899bb' }}>
            Upload a school activity video · MP4, AVI, MOV · Up to 500 MB
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`relative glass rounded-2xl overflow-hidden transition-all duration-300 ${dragActive ? 'drag-active' : ''}`}
          style={{ minHeight: 320, border: '2px dashed rgba(0,245,255,0.2)' }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <ScanningEffect active={stage === 'analyzing'} />

          <div className="flex flex-col items-center justify-center p-12 text-center h-full" style={{ minHeight: 320 }}>
            <AnimatePresence mode="wait">
              {/* Idle / Selected */}
              {(stage === 'idle' || stage === 'selected') && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {stage === 'idle' ? (
                    <>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}
                      >
                        <Upload size={32} style={{ color: '#00f5ff' }} />
                      </motion.div>
                      <p className="font-display text-lg font-bold mb-2" style={{ color: '#e2e8f0' }}>
                        Drag & Drop your video
                      </p>
                      <p className="text-sm mb-6" style={{ color: '#8899bb' }}>or click to browse</p>
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="px-8 py-3 rounded-xl font-mono text-sm tracking-widest uppercase"
                        style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff' }}
                      >
                        Choose File
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                           style={{ background: 'rgba(0,245,255,0.1)' }}>
                        <Film size={28} style={{ color: '#00f5ff' }} />
                      </div>
                      <p className="font-display text-base font-bold mb-1" style={{ color: '#e2e8f0' }}>{file.name}</p>
                      <p className="text-sm mb-1" style={{ color: '#8899bb' }}>{fmtBytes(file.size)}</p>
                      <p className="text-xs font-mono mb-6" style={{ color: '#00f5ff88' }}>
                        {file.type || 'video/mp4'}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleAnalyze}
                          className="px-8 py-3 rounded-xl font-mono text-sm tracking-widest uppercase font-bold"
                          style={{ background: 'linear-gradient(135deg, #00f5ff, #0066ff)', color: '#020408' }}
                        >
                          Analyze Video
                        </button>
                        <button onClick={reset}
                          className="px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8899bb' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Uploading */}
              {stage === 'uploading' && (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={40} className="mx-auto mb-6 animate-spin" style={{ color: '#00f5ff' }} />
                  <p className="font-display text-base font-bold mb-4" style={{ color: '#e2e8f0' }}>Uploading Video...</p>
                  <div className="w-64 h-2 rounded-full mx-auto mb-2" style={{ background: 'rgba(0,245,255,0.1)' }}>
                    <motion.div className="h-2 rounded-full shimmer-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="font-mono text-xs" style={{ color: '#00f5ff' }}>{progress}%</p>
                </motion.div>
              )}

              {/* Analyzing */}
              {stage === 'analyzing' && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ border: '3px solid transparent', borderTopColor: '#00f5ff', borderRightColor: '#bf00ff' }}
                  />
                  <p className="font-display text-base font-bold mb-2" style={{ color: '#e2e8f0' }}>AI Analysis Running...</p>
                  <p className="text-sm" style={{ color: '#8899bb' }}>Extracting frames · Detecting anomalies · Generating report</p>
                </motion.div>
              )}

              {/* Error */}
              {stage === 'error' && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={40} className="mx-auto mb-4" style={{ color: '#ff4444' }} />
                  <p className="font-display text-base font-bold mb-2" style={{ color: '#ff4444' }}>Analysis Failed</p>
                  <p className="text-sm mb-6" style={{ color: '#8899bb' }}>{errorMsg}</p>
                  <button onClick={reset}
                    className="px-8 py-3 rounded-xl font-mono text-sm"
                    style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444' }}>
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hidden file input */}
        <input ref={inputRef} type="file" accept=".mp4,.avi,.mov,.mkv" className="hidden"
               onChange={e => selectFile(e.target.files[0])} />

        {/* Tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-3 gap-4 text-center">
          {['45–60 sec videos', 'Mixed activities', 'Clear lighting'].map(tip => (
            <div key={tip} className="glass py-3 px-4 rounded-xl text-xs font-mono" style={{ color: '#8899bb' }}>
              ✓ {tip}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}