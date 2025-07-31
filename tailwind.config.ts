import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic Mac colors
        'mac-classic': {
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': '#808080',
        },
        // iMac G3 colors
        'imac': {
          'bondi-blue': '#009FC7',
          'strawberry': '#FF4D6D',
          'lime': '#32CD32',
          'tangerine': '#FF8C00',
          'grape': '#8B4789',
          'blueberry': '#4682B4',
        },
        // Mac OS X Aqua colors
        'aqua': {
          'blue': '#007AFF',
          'light-blue': '#5AC8FA',
          'gray': '#8E8E93',
          'dark': '#1C1C1E',
        }
      },
      fontFamily: {
        'chicago': ['Chicago', 'monospace'],
        'charcoal': ['Charcoal', 'sans-serif'],
        'lucida': ['Lucida Grande', 'sans-serif'],
        'monaco': ['Monaco', 'monospace'],
      },
      boxShadow: {
        'mac-window': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'aqua-button': 'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'brushed-metal': 'linear-gradient(180deg, #E5E5E5 0%, #C8C8C8 50%, #B0B0B0 100%)',
        'aqua-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #E0E0E0 50%, #CCCCCC 100%)',
        'pinstripe': 'repeating-linear-gradient(0deg, #F0F0F0, #F0F0F0 1px, #FFFFFF 1px, #FFFFFF 2px)',
      }
    },
  },
  plugins: [],
};
export default config;