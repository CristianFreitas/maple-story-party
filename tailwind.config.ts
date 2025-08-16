import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maple: {
          blue: '#4A90E2',
          orange: '#F39C12',
          yellow: '#F1C40F',
          green: '#27AE60',
          red: '#E74C3C',
          purple: '#9B59B6',
          brown: '#8B4513',
          gold: '#FFD700',
          dark: '#2C3E50',
          light: '#ECF0F1'
        },
        boss: {
          normal: '#3498DB',
          chaos: '#E74C3C',
          hard: '#9B59B6',
          extreme: '#F39C12'
        }
      },
      fontFamily: {
        'maple': ['Comic Sans MS', 'cursive'],
        'display': ['Arial Black', 'sans-serif']
      },
      backgroundImage: {
        'gradient-maple': 'linear-gradient(135deg, #4A90E2 0%, #F39C12 100%)',
        'gradient-boss': 'linear-gradient(135deg, #E74C3C 0%, #9B59B6 100%)'
      },
      boxShadow: {
        'maple': '0 4px 15px rgba(74, 144, 226, 0.3)',
        'boss': '0 4px 15px rgba(231, 76, 60, 0.3)'
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite'
      }
    },
  },
  plugins: [],
};
export default config;

