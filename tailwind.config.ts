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
        // Vintage Photobooth colors (1970s) - Sophisticated Dark Red
        'vintage-booth': {
          'dark-red': '#800102',
          'deeper-red': '#600001',
          'rich-red': '#A00204',
          'vanilla-cream': '#FFF8DC',
          'antique-brass': '#CD9575',
          'muted-brass': '#B8865F',
          'coffee-brown': '#3B2F2F',
          'warm-offwhite': '#FAF4E6',
        },
        // Classic Mac colors (kept for legacy)
        'mac-classic': {
          'black': '#000000',
          'white': '#FFFFFF',
          'gray': '#808080',
        },
        // Glamour Studio colors (Luxury Fashion)
        'glamour': {
          'champagne': '#F7E7CE',
          'rose-gold': '#E8B4B8',
          'soft-gold': '#D4AF37',
          'dusty-mauve': '#C8A8B8',
          'pearl': '#FFF8F3',
          'bronze': '#704214',
          'warm-gray': '#9B8B7E',
          'cream': '#F5DFC1',
        },
        // Mac OS X Aqua colors
        'aqua': {
          'cream': '#F9F5E8',
          'light-cream': '#FFF9ED',
          'gray': '#8E8E93',
          'dark': '#1C1C1E',
        }
      },
      fontFamily: {
        'chicago': ['Chicago', 'monospace'],
        'charcoal': ['Charcoal', 'sans-serif'],
        'lucida': ['Lucida Grande', 'sans-serif'],
        'monaco': ['Monaco', 'monospace'],
        'vintage-serif': ['Georgia', 'Playfair Display', 'serif'],
        'vintage-sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'typewriter': ['Courier Prime', 'Courier New', 'Courier', 'monospace'],
        'signage': ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
        'glamour-serif': ['Playfair Display', 'Didot', 'Georgia', 'serif'],
        'glamour-sans': ['Montserrat', 'Lato', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'mac-window': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'aqua-button': 'inset 0 1px 2px rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'vintage-photo': '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.15)',
        'vintage-button-raised': 'inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15)',
        'vintage-button-pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        'glamour-glow': '0 0 30px rgba(232, 180, 184, 0.3), 0 8px 24px rgba(212, 175, 55, 0.2)',
        'glamour-soft': '0 4px 12px rgba(155, 139, 126, 0.15), 0 2px 6px rgba(155, 139, 126, 0.1)',
      },
      backgroundImage: {
        'brushed-metal': 'linear-gradient(180deg, #E5E5E5 0%, #C8C8C8 50%, #B0B0B0 100%)',
        'aqua-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #E0E0E0 50%, #CCCCCC 100%)',
        'pinstripe': 'repeating-linear-gradient(0deg, #F0F0F0, #F0F0F0 1px, #FFFFFF 1px, #FFFFFF 2px)',
        'vintage-button': 'linear-gradient(180deg, #B22222 0%, #8B0000 50%, #700000 100%)',
        'velvet-curtain': 'repeating-linear-gradient(90deg, #8B0000 0px, #8B0000 2px, #700000 2px, #700000 4px)',
        'paper-texture': 'radial-gradient(circle at 20% 50%, rgba(251, 247, 240, 0.8) 0%, rgba(251, 247, 240, 1) 100%)',
        'light-leak': 'radial-gradient(circle at 95% 5%, rgba(255, 200, 150, 0.15) 0%, transparent 50%)',
        'aged-paper': 'linear-gradient(135deg, #FBF7F0 0%, #F5EFE6 50%, #FBF7F0 100%)',
        'silk-luxury': 'linear-gradient(180deg, #F7E7CE 0%, #F5DFC1 100%)',
        'rose-gold-gradient': 'linear-gradient(135deg, #E8B4B8 0%, #D4AF37 50%, #E8B4B8 100%)',
        'glamour-shimmer': 'linear-gradient(90deg, #E8B4B8 0%, #FFF8F3 50%, #E8B4B8 100%)',
        'marble-texture': 'radial-gradient(ellipse at top, rgba(255, 248, 243, 0.4), transparent), linear-gradient(135deg, #F7E7CE 0%, #F5DFC1 50%, #F7E7CE 100%)',
      }
    },
  },
  plugins: [],
};
export default config;