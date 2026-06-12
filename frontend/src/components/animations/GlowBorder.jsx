import { motion } from 'framer-motion'

/** Animated glowing border wrapper */
export default function GlowBorder({ children, color = '#00f5ff', className = '' }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ boxShadow: [`0 0 15px ${color}44`, `0 0 35px ${color}88`, `0 0 15px ${color}44`] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ borderRadius: 'inherit' }}
    >
      {children}
    </motion.div>
  )
}