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
        defense: {
          bg: '#0A0A0A',
          dark: '#050505',
          surface: '#121212',
          surfaceHover: '#1C1C1C',
          border: 'rgba(255, 255, 255, 0.12)',
          borderLight: '#333333',
          red: '#B30000',
          redGlow: '#FF1A1A',
          redLaser: '#FF2E2E',
          redDark: '#7A0000',
          cyan: '#FF1A1A', // Accent is now glowing crimson red
          cyanDim: '#B30000',
          amber: '#F59E0B',
          amberDim: '#B45309',
          text: '#FFFFFF',
          muted: '#A3A3A3',
          whiteDim: '#DCDCDC'
        },
        threat: {
          hostile: '#FF1A1A',
          unknown: '#F59E0B',
          friendly: '#22C55E',
          benign: '#38BDF8',
        },
        tricolor: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
        }
      },
      fontFamily: {
        heading: ['Orbitron', 'Rajdhani', 'sans-serif'],
        subheading: ['Rajdhani', 'Orbitron', 'sans-serif'],
        sans: ['Inter', 'Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(255, 26, 26, 0.65)',
        'red-glow-sm': '0 0 12px rgba(255, 26, 26, 0.45)',
        'cyan-glow': '0 0 25px rgba(255, 26, 26, 0.65)',
        'cyan-glow-sm': '0 0 12px rgba(255, 26, 26, 0.45)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'green-glow': '0 0 20px -3px rgba(34, 197, 94, 0.4)',
      },
      animation: {
        'radar-sweep': 'radarSweep 3.5s linear infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

