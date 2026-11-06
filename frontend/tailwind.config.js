/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Midnight Lighthouse Palette
        background: '#0C1430',
        'text-primary': '#E8EEFF',
        'text-secondary': '#9FB0D4',
        card: '#0A0E1A',
        border: '#AAB6D0',
        input: '#050814',
        accent: {
          DEFAULT: '#FFD98A',
          hover: '#FFE7AB',
        },
        'button-text': '#14182A',

        // Atmospheric
        'sky-top': '#16224A',
        'sky-mid': '#2E4272',
        'sky-horizon': '#7A96C0',
        stars: '#C8D4F0',
        'bright-stars': '#E8EEFF',
        'sea-horizon': '#5A7AA8',
        'sea-deep': '#22325E',
        surf: '#A8B8D8',

        // Decorative
        'far-headland': '#2A3A66',
        clouds: '#3A4C7A',
        'cliff-dark': '#0A0E1A',
        'cliff-mid': '#141A2A',
        'cliff-rim': '#1E2638',
        grass: '#16242A',
        'tower-light': '#AAB6D0',
        'tower-shade': '#6A7898',
        'tower-band': '#7A3040',
        'tower-band-dark': '#5A2232',

        // Lighting
        beam: '#FFF0B8',
        'lamp-core': '#FFFBE8',
        'window-glow': '#FFB860',
        'window-deep': '#E89048',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'card-restrained': '0 1px 3px 0 rgba(5, 8, 20, 0.4), 0 1px 2px -1px rgba(5, 8, 20, 0.3)',
        'card-elevated': '0 8px 24px -4px rgba(5, 8, 20, 0.6), 0 2px 6px -2px rgba(5, 8, 20, 0.4)',
        'lamp-glow': '0 0 12px rgba(255, 217, 138, 0.25)',
      },
    },
  },
  plugins: [],
}
