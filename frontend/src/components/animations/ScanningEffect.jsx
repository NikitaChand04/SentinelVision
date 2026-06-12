import { motion } from 'framer-motion'

/** Animated AI scanning overlay for upload/analysis stage */
export default function ScanningEffect({ active = true }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 w-full h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      {/* Corner brackets */}
      {[['top-2 left-2', ''], ['top-2 right-2', 'rotate-90'], ['bottom-2 left-2', '-rotate-90'], ['bottom-2 right-2', 'rotate-180']].map(([pos, rot], i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 ${pos} ${rot}`}
          style={{ borderTop: '2px solid #00f5ff', borderLeft: '2px solid #00f5ff' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}