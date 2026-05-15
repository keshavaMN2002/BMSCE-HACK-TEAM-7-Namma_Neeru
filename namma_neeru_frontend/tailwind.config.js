/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',
          soft: '#38BDF8',
          cyan: '#E0F2FE',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'General Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(37, 99, 235, 0.1)',
      }
    },
  },
  plugins: [],
}

