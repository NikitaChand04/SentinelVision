import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const LINKS = [
  { to: '/',        label: 'Home'   },
  { to: '/about',   label: 'About'  },
  { to: '/upload',  label: 'Analyze'},
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,245,255,0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Shield className="text-neon-cyan" size={24} style={{ color: '#00f5ff' }} />
          </motion.div>
          <span className="font-display font-bold text-lg tracking-widest" style={{ color: '#00f5ff' }}>
            SENTINEL<span style={{ color: '#bf00ff' }}>VISION</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-8">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative font-mono text-sm tracking-widest uppercase transition-colors"
              style={{ color: pathname === to ? '#00f5ff' : '#8899aa' }}
            >
              {label}
              {pathname === to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{ background: '#00f5ff' }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}