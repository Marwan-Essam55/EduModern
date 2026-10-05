/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
        sans:   ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
      },
      keyframes: {
        /* Chat dots */
        bounce3: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%':           { transform: 'scale(1)', opacity: '1'   },
        },
        /* Generic slide up + fade */
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
        /* Landing page animations */
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'    },
          '50%':      { transform: 'translateY(-18px)'  },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)'   },
          '50%':      { transform: 'translateY(-12px) rotate(3deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)'    },
          '50%':      { opacity: '1',   transform: 'scale(1.08)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition: ' 200% center' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)'   },
          to:   { transform: 'rotate(360deg)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)'     },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
        counterUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
      },
      animation: {
        /* Chat dots */
        dot1: 'bounce3 1.4s ease-in-out 0s infinite',
        dot2: 'bounce3 1.4s ease-in-out 0.2s infinite',
        dot3: 'bounce3 1.4s ease-in-out 0.4s infinite',
        /* Generic */
        fadeSlideIn:  'fadeSlideIn 0.25s ease-out forwards',
        /* Landing */
        fadeUp:       'fadeUp 0.7s ease-out forwards',
        fadeUp200:    'fadeUp 0.7s ease-out 0.2s forwards',
        fadeUp400:    'fadeUp 0.7s ease-out 0.4s forwards',
        fadeUp600:    'fadeUp 0.7s ease-out 0.6s forwards',
        fadeIn:       'fadeIn 1s ease-out forwards',
        float:        'float 5s ease-in-out infinite',
        floatSlow:    'floatSlow 7s ease-in-out infinite',
        floatDelay:   'float 5s ease-in-out 1.5s infinite',
        glowPulse:    'glowPulse 3s ease-in-out infinite',
        shimmer:      'shimmer 3s linear infinite',
        spinSlow:     'spinSlow 20s linear infinite',
        slideInLeft:  'slideInLeft 0.6s ease-out forwards',
        slideInRight: 'slideInRight 0.6s ease-out forwards',
        counterUp:    'counterUp 0.6s ease-out forwards',
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
}



