import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        accent: '#D4AF37',
        cream: '#F6F1E8',
        charcoal: '#1A1A1A',
        slate: '#2A2A2A',
        muted: '#6E6E6E'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)']
      },
      boxShadow: {
        soft: '0 20px 40px rgba(0,0,0,0.18)',
        glow: '0 0 24px rgba(212,175,55,0.35)'
      },
      letterSpacing: {
        tightish: '-0.02em'
      }
    }
  },
  plugins: []
};

export default config;
