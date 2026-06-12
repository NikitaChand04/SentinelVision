import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield size={16} style={{ color: '#00f5ff' }} />
        <span className="font-display text-sm tracking-widest" style={{ color: '#00f5ff66' }}>
          SENTINEL VISION
        </span>
      </div>
      <p className="text-xs" style={{ color: '#ffffff33' }}>
        AI-Powered School Activity Anomaly Detection System · Built with Deep Learning
      </p>
    </footer>
  )
}