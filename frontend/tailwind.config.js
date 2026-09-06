/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FCFBF7',
          DEFAULT: '#F7F4EB',
          dark: '#EFECE1',
        },
        sage: {
          light: '#F3D77A',
          DEFAULT: '#D4A617',
          dark: '#B88900',
        },
        lavender: {
          light: '#FBF7EC',
          DEFAULT: '#E5D5B8',
          dark: '#CDBA96',
        },
        gold: {
          light: '#F3D77A',
          DEFAULT: '#D4A617',
          dark: '#B88900',
        },
        charcoal: {
          light: '#4A4A4A',
          DEFAULT: '#2E302D',
          dark: '#1C1D1B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      screens: {
        'xs': '420px',
        '3xl': '1680px',
        '4xl': '1920px',
      },
    },
  },
  plugins: [],
}
