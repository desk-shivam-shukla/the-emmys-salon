/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        surface: {
          base: 'var(--surface-base)',
          elevated: 'var(--surface-elevated)',
          staff: 'var(--surface-staff)',
          dark: 'var(--surface-dark)',
        },
        wood: {
          deep: 'var(--wood-deep)',
          mid: 'var(--wood-mid)',
          light: 'var(--wood-light)',
        },
        gold: {
          accent: 'var(--gold-accent)',
          soft: 'var(--gold-soft)',
          hover: 'var(--gold-hover)',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Noto Sans JP"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
