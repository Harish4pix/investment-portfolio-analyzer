/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#06080f',
          card:    '#0f1628',
          accent:  '#00c6ff',
          gold:    '#ffd200',
          green:   '#38ef7d',
          red:     '#ef473a',
          purple:  '#c084fc',
          muted:   '#7a8faa',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        btn: '10px',
        card: '16px',
      },  
    },
  },
  plugins: [],
}