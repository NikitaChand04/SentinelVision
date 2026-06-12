/**
 * Button.jsx — reusable animated button component
 *
 * Props:
 *   variant  : "primary" | "secondary" | "danger" | "ghost" | "outline"
 *   size     : "sm" | "md" | "lg"
 *   loading  : boolean — shows spinner, disables click
 *   disabled : boolean
 *   icon     : JSX element shown before label
 *   iconRight: JSX element shown after label
 *   fullWidth: boolean
 *   onClick
 *   children
 *   className
 */

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// ── Style maps ────────────────────────────────────────────────────────────────
const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #00f5ff, #0066ff)',
    color:      '#020408',
    border:     'none',
    hoverShadow:'0 0 40px rgba(0,245,255,0.55)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #bf00ff, #0066ff)',
    color:      '#ffffff',
    border:     'none',
    hoverShadow:'0 0 40px rgba(191,0,255,0.55)',
  },
  danger: {
    background: 'rgba(255,68,68,0.12)',
    color:      '#ff4444',
    border:     '1px solid rgba(255,68,68,0.35)',
    hoverShadow:'0 0 30px rgba(255,68,68,0.4)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.04)',
    color:      '#8899bb',
    border:     '1px solid rgba(255,255,255,0.08)',
    hoverShadow:'none',
  },
  outline: {
    background: 'transparent',
    color:      '#00f5ff',
    border:     '1px solid rgba(0,245,255,0.35)',
    hoverShadow:'0 0 25px rgba(0,245,255,0.3)',
  },
}

const SIZES = {
  sm: { fontSize: '0.7rem',  padding: '8px 16px',  iconSize: 14, gap: 6  },
  md: { fontSize: '0.8rem',  padding: '12px 24px', iconSize: 16, gap: 8  },
  lg: { fontSize: '0.9rem',  padding: '16px 36px', iconSize: 18, gap: 10 },
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  children,
  className = '',
  type      = 'button',
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary
  const s = SIZES[size]       ?? SIZES.md
  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      className={`
        inline-flex items-center justify-center
        font-display font-bold tracking-widest uppercase
        rounded-xl cursor-pointer select-none
        transition-colors
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        background: v.background,
        color:      v.color,
        border:     v.border,
        fontSize:   s.fontSize,
        padding:    s.padding,
        gap:        s.gap,
        outline:    'none',
      }}
      whileHover={
        isDisabled
          ? {}
          : { scale: 1.03, boxShadow: v.hoverShadow }
      }
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {/* Left icon or spinner */}
      {loading ? (
        <Loader2 size={s.iconSize} className="animate-spin" />
      ) : (
        icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      )}

      {/* Label */}
      {children}

      {/* Right icon */}
      {!loading && iconRight && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>
      )}
    </motion.button>
  )
}

// ── Icon-only button ──────────────────────────────────────────────────────────
export function IconButton({ icon, variant = 'ghost', size = 'md', onClick, disabled, className = '' }) {
  const v = VARIANTS[variant] ?? VARIANTS.ghost
  const s = SIZES[size]       ?? SIZES.md

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={`
        inline-flex items-center justify-center rounded-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: v.background,
        color:      v.color,
        border:     v.border,
        padding:    s.padding,
        outline:    'none',
      }}
      whileHover={disabled ? {} : { scale: 1.08, boxShadow: v.hoverShadow }}
      whileTap={disabled ? {} : { scale: 0.94 }}
    >
      {icon}
    </motion.button>
  )
}