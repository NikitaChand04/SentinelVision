/** Utility formatters */

export const fmtBytes = bytes => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

export const fmtDuration = secs => {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}m ${s}s`
}

export const fmtConfidence = v => `${Math.round(v * 100)}%`

export const riskColor = level => ({
  Safe:     'text-emerald-400',
  Low:      'text-cyan-400',
  Medium:   'text-yellow-400',
  High:     'text-orange-400',
  Critical: 'text-red-400',
}[level] ?? 'text-gray-400')

export const severityColor = s => ({
  high:   '#ff4444',
  medium: '#ffaa00',
  low:    '#00f5ff',
}[s] ?? '#8888aa')