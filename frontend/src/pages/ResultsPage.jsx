import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Film, ArrowLeft, Shield } from 'lucide-react'
import ParticleBackground from '../components/animations/ParticleBackground'
import { fmtBytes, fmtDuration, fmtConfidence, riskColor, severityColor } from '../utils/formatters'

export default function ResultsPage() {
  const { state } = useLocation()
  const nav       = useNavigate()
  const result    = state?.result

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#020408' }}>
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: '#8899bb' }}>No analysis result found.</p>
          <button onClick={() => nav('/upload')} className="px-6 py-2 rounded-xl font-mono text-sm"
                  style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.3)' }}>
            Go to Upload
          </button>
        </div>
      </div>
    )
  }

  const { anomaly_detected, anomaly_frames, timeline, insights, video_url,
          filename, duration_seconds, processing_time_seconds } = result

  return (
    <div className="relative min-h-screen" style={{ background: '#020408' }}>
      <ParticleBackground count={30} />
      <div className="fixed inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => nav('/upload')}
          className="flex items-center gap-2 mb-8 text-sm font-mono hover:opacity-80 transition-opacity"
          style={{ color: '#8899bb' }}
        >
          <ArrowLeft size={16} /> New Analysis
        </motion.button>

        {/* ── Result banner ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl mb-8 text-center"
          style={{ border: anomaly_detected ? '1px solid rgba(255,68,68,0.3)' : '1px solid rgba(0,245,255,0.3)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: anomaly_detected ? 'rgba(255,68,68,0.1)' : 'rgba(0,245,255,0.1)' }}
          >
            {anomaly_detected
              ? <AlertTriangle size={36} style={{ color: '#ff4444' }} />
              : <CheckCircle   size={36} style={{ color: '#00f5ff' }} />
            }
          </motion.div>
          <h1 className="font-display text-3xl font-black mb-2"
              style={{ color: anomaly_detected ? '#ff4444' : '#00f5ff' }}>
            {anomaly_detected ? 'ANOMALY DETECTED' : 'NO ANOMALY DETECTED'}
          </h1>
          <p className="text-sm" style={{ color: '#8899bb' }}>
            {filename} · {fmtDuration(duration_seconds)} · Processed in {processing_time_seconds}s
          </p>
        </motion.div>

        {/* ── AI Insights ───────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <h2 className="font-display text-lg font-bold mb-4 tracking-wide" style={{ color: '#e2e8f0' }}>
            AI Insights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Anomalies',    value: insights.total_anomalies },
              { label: 'Risk Level',         value: insights.risk_level, cls: riskColor(insights.risk_level) },
              { label: 'Risk Score',         value: `${insights.risk_score}%` },
              { label: 'Anomaly Duration',   value: `${insights.total_duration_seconds}s` },
            ].map(({ label, value, cls }) => (
              <motion.div key={label} whileHover={{ y: -4 }}
                className="glass p-5 rounded-2xl text-center">
                <div className={`font-display text-3xl font-black mb-1 ${cls || 'gradient-text'}`}>{value}</div>
                <div className="text-xs font-mono tracking-widest uppercase" style={{ color: '#8899bb' }}>{label}</div>
              </motion.div>
            ))}
          </div>
          {insights.most_severe_label !== 'None' && (
            <div className="glass mt-4 p-4 rounded-xl flex items-center gap-3"
                 style={{ border: '1px solid rgba(255,170,0,0.2)' }}>
              <AlertTriangle size={16} style={{ color: '#ffaa00' }} />
              <span className="text-sm" style={{ color: '#ffaa00' }}>
                Most severe: <strong>{insights.most_severe_label}</strong>
              </span>
            </div>
          )}
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Anomaly frames ────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold mb-4 tracking-wide" style={{ color: '#e2e8f0' }}>
              Anomaly Frames ({anomaly_frames.length})
            </h2>
            {anomaly_frames.length === 0 ? (
              <div className="glass p-10 rounded-2xl text-center">
                <Shield size={32} className="mx-auto mb-3" style={{ color: '#00f5ff44' }} />
                <p style={{ color: '#8899bb' }}>No anomaly frames detected.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {anomaly_frames.map((frame, i) => (
                  <motion.div
                    key={frame.frame_number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${severityColor(frame.severity)}22` }}
                  >
                    {/* Frame image */}
                    <div className="relative aspect-video bg-black">
                      <img
                        src={frame.image_url}
                        alt={`Anomaly at ${frame.timestamp}`}
                        className="w-full h-full object-cover opacity-90"
                        onError={e => { e.target.src = '/placeholder.jpg' }}
                      />
                      {/* Timestamp overlay */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded font-mono text-xs"
                           style={{ background: 'rgba(0,0,0,0.8)', color: '#00f5ff' }}>
                        {frame.timestamp}
                      </div>
                      {/* Severity badge */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded font-mono text-xs uppercase"
                           style={{ background: `${severityColor(frame.severity)}22`, color: severityColor(frame.severity), border: `1px solid ${severityColor(frame.severity)}44` }}>
                        {frame.severity}
                      </div>
                    </div>
                    {/* Frame info */}
                    <div className="p-3">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#e2e8f0' }}>{frame.label}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono" style={{ color: '#8899bb' }}>Frame #{frame.frame_number}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: severityColor(frame.severity) }}>
                          {fmtConfidence(frame.confidence)}
                        </span>
                      </div>
                      {/* Confidence bar */}
                      <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-1 rounded-full transition-all"
                             style={{ width: `${frame.confidence * 100}%`, background: severityColor(frame.severity) }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar: Timeline + Video ──────────────────────────────── */}
          <div className="space-y-6">
            {/* Timeline */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#e2e8f0' }}>Timeline</h2>
              <div className="glass p-5 rounded-2xl">
                {timeline.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: '#8899bb' }}>No events.</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((evt, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full dot-pulse flex-shrink-0 mt-0.5"
                               style={{ background: severityColor(evt.severity) }} />
                          {i < timeline.length - 1 && (
                            <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.06)', minHeight: 20 }} />
                          )}
                        </div>
                        <div>
                          <div className="font-mono text-xs mb-0.5" style={{ color: '#00f5ff' }}>{evt.timestamp}</div>
                          <div className="text-xs leading-relaxed" style={{ color: '#8899bb' }}>{evt.event}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video preview */}
            <div>
              <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#e2e8f0' }}>Video Preview</h2>
              <div className="glass rounded-2xl overflow-hidden">
                <video
                  src={video_url}
                  controls
                  className="w-full"
                  style={{ maxHeight: 260 }}
                />
              </div>
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav('/upload')}
              className="w-full py-3 rounded-xl font-display text-sm tracking-widest uppercase font-bold"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #0066ff)', color: '#020408' }}
            >
              Analyze Another Video
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}