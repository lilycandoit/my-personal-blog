import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5d9cec',
          hover: '#4a89dc',
          light: '#7db0f7',
        },
        secondary: {
          light: '#a0d2eb',
          dark: '#2a4a6a',
        },
        accent: {
          light: '#ffb7b2',
          dark: '#ff9b96',
        },
        muted: {
          light: '#8da1b9',
          dark: '#6b7a8f',
        },
        background: {
          light: '#f8faff',
          dark: '#0f1419',
        },
        surface: {
          light: '#ffffff',
          dark: '#2d3238',
        },
        border: {
          light: '#e1e8f0',
          dark: '#1f2937',
        },
      },
      fontFamily: {
        hand: ['"Patrick Hand"', 'cursive'],
        ui: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}
export default config
