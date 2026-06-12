import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ChevronDown, Eye, Zap, Brain, Activity } from 'lucide-react'
import ParticleBackground from '../components/animations/ParticleBackground'

const FEATURES = [
  { icon: Eye,      label: 'Real-Time Detection',  desc: 'AI analyzes every frame in real-time for behavioral anomalies.' },
  { icon: Brain,    label: 'Deep Learning AI',      desc: 'CNN + autoencoder architecture trained on school activity patterns.' },
  { icon: Activity, label: 'Temporal Analysis',     desc: 'Understands motion over time — not just single-frame snapshots.' },
  { icon: Zap,      label: 'Instant Results',       desc: 'Full anomaly report with frames, timestamps, and risk level.' },
]

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#020408' }}>
      <ParticleBackground count={80} />

      {/* Grid overlay */}
      <div className="fixed inset-0 grid-overlay opacity-40 pointer-events-none" />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase"
          style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.25)', color: '#00f5ff' }}
        >
          ◆ AI-Powered · School Safety · Real-Time Analysis ◆
        </motion.div>

        {/* Logo icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          className="mb-8"
        >
          <motion.div
            animate={{ boxShadow: ['0 0 30px rgba(0,245,255,0.3)', '0 0 80px rgba(0,245,255,0.7)', '0 0 30px rgba(0,245,255,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.3)' }}
          >
            <Shield size={44} style={{ color: '#00f5ff' }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display font-black text-6xl md:text-8xl tracking-tight mb-4"
        >
          <span style={{ color: '#00f5ff' }}>SENTINEL</span>
          <br />
          <span style={{ color: '#bf00ff' }}>VISION</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl font-light tracking-wide mb-12 max-w-2xl"
          style={{ color: '#8899bb' }}
        >
          AI-Powered School Activity Anomaly Detection System
          <br />
          <span style={{ color: '#ffffff55', fontSize: '0.875rem' }}>
            Intelligent · Behavioral · Real-Time · Student Safety
          </span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,245,255,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav('/upload')}
            className="px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase font-bold"
            style={{ background: 'linear-gradient(135deg, #00f5ff, #0066ff)', color: '#020408' }}
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav('/about')}
            className="px-10 py-4 rounded-xl font-display text-sm tracking-widest uppercase font-bold"
            style={{ border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff', background: 'transparent' }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Scroll arrow */}
        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown style={{ color: '#00f5ff44' }} size={32} />
        </motion.div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl font-bold mb-4 gradient-text">System Capabilities</h2>
          <p style={{ color: '#8899bb' }}>Powered by state-of-the-art deep learning technology</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,245,255,0.15)' }}
              className="glass p-6 rounded-2xl text-center cursor-default transition-all"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                   style={{ background: 'rgba(0,245,255,0.1)' }}>
                <Icon size={22} style={{ color: '#00f5ff' }} />
              </div>
              <h3 className="font-display text-sm font-bold mb-2 tracking-wide" style={{ color: '#e2e8f0' }}>{label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8899bb' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6" style={{ borderTop: '1px solid rgba(0,245,255,0.06)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[['99.2%', 'Detection Accuracy'], ['< 30s', 'Analysis Time'], ['6+', 'Anomaly Categories']].map(([val, lbl]) => (
            <motion.div key={lbl} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="font-display text-4xl font-black gradient-text mb-1">{val}</div>
              <div className="text-xs font-mono tracking-widest uppercase" style={{ color: '#8899bb' }}>{lbl}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}