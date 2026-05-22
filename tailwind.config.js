/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0a0e1a', 800: '#0d1224', 700: '#111827' },
        cyan: { 400: '#22d3ee', 500: '#06b6d4' },
        threat: { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', critical: '#dc2626' }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        glow: { '0%': { boxShadow: '0 0 5px #22d3ee' }, '100%': { boxShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee' } }
      }
    }
  },
  plugins: []
}
