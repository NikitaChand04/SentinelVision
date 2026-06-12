import { motion } from 'framer-motion'
import { Shield, Eye, Brain, AlertTriangle, Users, BookOpen, Dumbbell, Play } from 'lucide-react'
import ParticleBackground from '../components/animations/ParticleBackground'

const HOW_IT_WORKS = [
  { step: '01', title: 'Video Upload',       desc: 'Upload a school activity video. The system accepts MP4, AVI, MOV files up to 500 MB.' },
  { step: '02', title: 'Frame Extraction',   desc: 'Every frame is extracted and preprocessed. Optical flow is computed to capture motion energy.' },
  { step: '03', title: 'AI Analysis',        desc: 'The deep learning model scores each frame for anomaly likelihood using reconstruction error.' },
  { step: '04', title: 'Pattern Detection',  desc: 'Temporal algorithms detect prolonged inactivity, sudden events, isolation, and group deviations.' },
  { step: '05', title: 'Report Generation',  desc: 'Anomaly frames are saved, labeled, and a full report is returned with timeline and risk level.' },
]

const SCENARIOS = [
  { icon: Play,        label: 'Playground',  desc: 'Detects isolated students, inactive individuals, sudden falls.' },
  { icon: BookOpen,    label: 'Classroom',   desc: 'Flags inattention, behavioral deviation, and isolation.' },
  { icon: Dumbbell,    label: 'Exercise',    desc: 'Identifies students not following group activities.' },
  { icon: Users,       label: 'Corridors',   desc: 'Monitors unusual movement patterns and group dynamics.' },
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen" style={{ background: '#020408' }}>
      <ParticleBackground count={40} />
      <div className="fixed inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-mono tracking-widest"
               style={{ background: 'rgba(191,0,255,0.08)', border: '1px solid rgba(191,0,255,0.25)', color: '#bf00ff' }}>
            ◆ ABOUT THE SYSTEM
          </div>
          <h1 className="font-display text-5xl font-black mb-6">
            <span className="gradient-text">What is Sentinel Vision?</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: '#8899bb' }}>
            Sentinel Vision is an AI-powered behavioral analysis platform designed specifically
            for school safety. Unlike traditional surveillance systems, it understands
            <em style={{ color: '#00f5ff' }}> context</em> — not just motion.
          </p>
        </motion.div>

        {/* How it works */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <h2 className="font-display text-2xl font-bold mb-10 text-center" style={{ color: '#e2e8f0' }}>
            How It Works
          </h2>
          <div className="space-y-4">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl flex gap-6 items-start"
              >
                <span className="font-display text-3xl font-black flex-shrink-0" style={{ color: '#00f5ff22' }}>{step}</span>
                <div>
                  <h3 className="font-display text-sm font-bold mb-1 tracking-wide" style={{ color: '#00f5ff' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scenarios */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <h2 className="font-display text-2xl font-bold mb-10 text-center" style={{ color: '#e2e8f0' }}>
            Detection Scenarios
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCENARIOS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass p-5 rounded-2xl text-center"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                     style={{ background: 'rgba(191,0,255,0.1)' }}>
                  <Icon size={18} style={{ color: '#bf00ff' }} />
                </div>
                <h3 className="font-display text-xs font-bold mb-2" style={{ color: '#e2e8f0' }}>{label}</h3>
                <p className="text-xs" style={{ color: '#8899bb' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Model info */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-2xl"
          style={{ border: '1px solid rgba(191,0,255,0.2)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Brain style={{ color: '#bf00ff' }} size={24} />
            <h2 className="font-display text-xl font-bold" style={{ color: '#e2e8f0' }}>AI Model Architecture</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm" style={{ color: '#8899bb' }}>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#00f5ff' }}>Core Model</h4>
              <ul className="space-y-2">
                <li>· Convolutional Autoencoder (4-layer encoder/decoder)</li>
                <li>· Trained on school activity video frames</li>
                <li>· Reconstruction error = anomaly score</li>
                <li>· 95th-percentile adaptive threshold</li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: '#bf00ff' }}>Signal Processing</h4>
              <ul className="space-y-2">
                <li>· Farneback optical flow (motion energy)</li>
                <li>· Robust Z-score baseline (MAD-based)</li>
                <li>· Temporal window analysis (3 s merging)</li>
                <li>· Per-frame severity classification</li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}