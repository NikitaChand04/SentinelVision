/**
 * Badge.jsx — small label pill used for severity, status, risk level, etc.
 *
 * Props:
 *   variant  : "cyan" | "purple" | "red" | "yellow" | "green" | "gray"
 *   size     : "sm" | "md"
 *   children : text content
 *   dot      : boolean — show animated dot before text
 */

const VARIANTS = {
  cyan:   { color: '#00f5ff', bg: 'rgba(0,245,255,0.10)',   border: 'rgba(0,245,255,0.25)'  },
  purple: { color: '#bf00ff', bg: 'rgba(191,0,255,0.10)',  border: 'rgba(191,0,255,0.25)' },
  red:    { color: '#ff4444', bg: 'rgba(255,68,68,0.10)',  border: 'rgba(255,68,68,0.25)'  },
  yellow: { color: '#ffaa00', bg: 'rgba(255,170,0,0.10)',  border: 'rgba(255,170,0,0.25)'  },
  green:  { color: '#00ff88', bg: 'rgba(0,255,136,0.10)',  border: 'rgba(0,255,136,0.25)'  },
  gray:   { color: '#8899bb', bg: 'rgba(136,153,187,0.10)',border: 'rgba(136,153,187,0.25)'},
}

const SIZES = {
  sm: { fontSize: '0.65rem', padding: '2px 8px'  },
  md: { fontSize: '0.75rem', padding: '4px 12px' },
}

export default function Badge({
  variant  = 'cyan',
  size     = 'sm',
  children,
  dot      = false,
  className = '',
}) {
  const v = VARIANTS[variant] ?? VARIANTS.cyan
  const s = SIZES[size]       ?? SIZES.sm

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-widest rounded-full ${className}`}
      style={{
        color:       v.color,
        background:  v.bg,
        border:      `1px solid ${v.border}`,
        fontSize:    s.fontSize,
        padding:     s.padding,
        fontWeight:  600,
        whiteSpace:  'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: v.color,
            flexShrink: 0,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
      {children}
    </span>
  )
}

// ── Convenience severity badge ────────────────────────────────────────────────
export function SeverityBadge({ severity }) {
  const map = { high: 'red', medium: 'yellow', low: 'cyan' }
  return (
    <Badge variant={map[severity] ?? 'gray'} dot>
      {severity}
    </Badge>
  )
}

// ── Risk level badge ──────────────────────────────────────────────────────────
export function RiskBadge({ level }) {
  const map = { Safe: 'green', Low: 'cyan', Medium: 'yellow', High: 'red', Critical: 'red' }
  return (
    <Badge variant={map[level] ?? 'gray'} size="md" dot>
      {level}
    </Badge>
  )
}