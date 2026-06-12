/**
 * ProgressBar.jsx — animated progress bar with multiple style variants.
 *
 * Props:
 *   value    : number 0–100
 *   variant  : "shimmer" | "solid" | "gradient" | "confidence"
 *   color    : hex string (used by "solid" variant)
 *   label    : string shown above bar
 *   showPct  : boolean — show percentage on the right
 *   height   : number (px, default 6)
 *   animate  : boolean — framer-motion width animation on mount
 */

import { motion } from 'framer-motion'

export default function ProgressBar({
  value     = 0,
  variant   = 'gradient',
  color,
  label,
  showPct   = false,
  height    = 6,
  animate   = true,
  className = '',
}) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const fillStyle = getFillStyle(variant, color, clampedValue)

  return (
    <div className={`w-full ${className}`}>
      {(label || showPct) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-xs font-mono tracking-wide" style={{ color: '#8899bb' }}>
              {label}
            </span>
          )}
          {showPct && (
            <span className="text-xs font-mono font-bold" style={{ color: '#00f5ff' }}>
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className="w-full overflow-hidden rounded-full"
        style={{ height, background: 'rgba(255,255,255,0.06)' }}
      >
        {/* Fill */}
        {animate ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: 'inherit', ...fillStyle }}
          />
        ) : (
          <div
            style={{ width: `${clampedValue}%`, height: '100%', borderRadius: 'inherit', ...fillStyle }}
          />
        )}
      </div>
    </div>
  )
}

// ── Fill style factory ────────────────────────────────────────────────────────
function getFillStyle(variant, color, value) {
  switch (variant) {
    case 'shimmer':
      return {
        background: 'linear-gradient(90deg, #0066ff, #00f5ff, #bf00ff, #00f5ff, #0066ff)',
        backgroundSize: '200% auto',
        animation: 'shimmer 2s linear infinite',
      }

    case 'solid':
      return { background: color ?? '#00f5ff' }

    case 'confidence': {
      // Green → yellow → red based on value
      const r = value > 50 ? Math.round(255 * ((value - 50) / 50)) : 0
      const g = value < 50 ? Math.round(255 * (value / 50))        : 255
      return { background: `rgb(${r}, ${g}, 100)` }
    }

    case 'gradient':
    default:
      return {
        background: 'linear-gradient(90deg, #0066ff, #00f5ff)',
      }
  }
}

// ── Confidence bar shorthand ──────────────────────────────────────────────────
export function ConfidenceBar({ confidence, label = 'Confidence', height = 4 }) {
  return (
    <ProgressBar
      value={confidence * 100}
      variant="solid"
      color={confidenceColor(confidence)}
      label={label}
      showPct
      height={height}
    />
  )
}

function confidenceColor(v) {
  if (v > 0.7) return '#ff4444'
  if (v > 0.4) return '#ffaa00'
  return '#00f5ff'
}