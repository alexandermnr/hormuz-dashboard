/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          light: '#1B2A4A',
          mid: '#152238',
        },
        gold: {
          DEFAULT: '#C49A1A',
          light: '#D4AA2A',
        },
        score: {
          normal: '#1A6B3C',
          elevated: '#B7950B',
          high: '#D35400',
          critical: '#C0392B',
          gap: '#888888',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
