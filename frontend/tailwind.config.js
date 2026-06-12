/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon:    { cyan: '#00f5ff', purple: '#bf00ff', blue: '#0066ff' },
        dark:    { 900: '#020408', 800: '#060d1a', 700: '#0a1628', 600: '#0f2040' },
        glass:   { DEFAULT: 'rgba(255,255,255,0.04)', border: 'rgba(0,245,255,0.12)' },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'scan':        'scan 2s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'particle':    'particle 8s linear infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0,245,255,0.8), 0 0 80px rgba(0,245,255,0.3)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}