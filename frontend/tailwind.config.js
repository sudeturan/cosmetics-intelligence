/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#FAF9F6',   // Soft Alabaster/Off-White
          100: '#F4F2EC',  // Warm Cream
          200: '#E7E4D9',  // Soft Stone
          300: '#D5D1C1',  // Muted Gold Sage
          400: '#BEB8A3',  // Olive Gold
          500: '#9E967D',  // Antique Brass
          600: '#81785E',  // Dark Brass
          700: '#645B47',  // Mud Gold
          800: '#464032',  // Charcoal Brown
          900: '#2A261D',  // Charcoal Obsidian
          950: '#14120D',  // Pure Obsidian
        },
        gold: {
          DEFAULT: '#D4AF37', // Premium Gold
          light: '#F3E5AB',   // Soft Gold
          dark: '#AA7C11'     // Metallic dark gold
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
