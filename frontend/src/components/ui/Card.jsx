/**
 * Card.jsx — glass morphism card container used throughout the UI.
 *
 * Props:
 *   glow     : "cyan" | "purple" | "red" | "none"  — border glow colour
 *   hover    : boolean — lift + glow on hover
 *   padding  : "sm" | "md" | "lg"
 *   children
 *   className
 *   onClick
 */

import { motion } from 'framer-motion'

const GLOW_COLORS = {
  cyan:   'rgba(0,245,255,0.20)',
  purple: 'rgba(191,0,255,0.20)',
  red:    'rgba(255,68,68,0.20)',
  none:   'transparent',
}

const BORDER_COLORS = {
  cyan:   'rgba(0,245,255,0.18)',
  purple: 'rgba(191,0,255,0.18)',
  red:    'rgba(255,68,68,0.18)',
  none:   'rgba(255,255,255,0.06)',
}

const PADDING = {
  sm: '16px',
  md: '24px',
  lg: '32px',
}

export default function Card({
  glow      = 'none',
  hover     = false,
  padding   = 'md',
  children,
  className = '',
  onClick,
  style     = {},
}) {
  const borderColor = BORDER_COLORS[glow] ?? BORDER_COLORS.none
  const glowColor   = GLOW_COLORS[glow]   ?? GLOW_COLORS.none

  const base = {
    background:       'rgba(255,255,255,0.04)',
    backdropFilter:   'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border:           `1px solid ${borderColor}`,
    borderRadius:     '16px',
    padding:          PADDING[padding] ?? PADDING.md,
    ...style,
  }

  if (hover) {
    return (
      <motion.div
        className={className}
        style={base}
        whileHover={{
          y: -4,
          boxShadow: `0 20px 60px ${glowColor}`,
          borderColor,
        }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={className} style={base} onClick={onClick}>
      {children}
    </div>
  )
}

// ── Stat card shorthand ───────────────────────────────────────────────────────
export function StatCard({ label, value, valueClass = 'gradient-text', glow = 'none' }) {
  return (
    <Card glow={glow} hover padding="md" className="text-center">
      <div className={`font-display text-3xl font-black mb-1 ${valueClass}`}>
        {value}
      </div>
      <div className="text-xs font-mono tracking-widest uppercase" style={{ color: '#8899bb' }}>
        {label}
      </div>
    </Card>
  )
}