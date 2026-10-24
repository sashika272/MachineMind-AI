/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0a0d12',
          900: '#0e1219',
          850: '#131822',
          800: '#171e2b',
          750: '#1c2535',
          700: '#232e42',
          600: '#334155',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#f1f5f9'
        },
        cyan: {
          electric: '#00e5ff',
          deep: '#0891b2',
          glow: 'rgba(0, 229, 255, 0.15)'
        },
        electric: {
          blue: '#2563eb',
          light: '#38bdf8'
        },
        amber: {
          warning: '#f59e0b',
          alert: '#d97706',
          glow: 'rgba(245, 158, 11, 0.15)'
        },
        crimson: {
          critical: '#ef4444',
          alarm: '#dc2626',
          glow: 'rgba(239, 68, 68, 0.2)'
        },
        emerald: {
          nominal: '#10b981',
          optimal: '#059669',
          glow: 'rgba(16, 185, 129, 0.15)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(0, 229, 255, 0.3)',
        'amber-glow': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'crimson-glow': '0 0 20px -5px rgba(239, 68, 68, 0.35)',
        'emerald-glow': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
