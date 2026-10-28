// tailwind.config.ts : maps tokens.css into Tailwind so components use bg-surface text-text-muted, never raw hex.
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1024px', xl: '1280px' },
    extend: {
      colors: {
      'bg': 'var(--color-bg)',
      'surface': 'var(--color-surface)',
      'surface-raised': 'var(--color-surface-raised)',
      'border': 'var(--color-border)',
      'border-input': 'var(--color-border-input)',
      'text': 'var(--color-text)',
      'text-muted': 'var(--color-text-muted)',
      'accent': 'var(--color-accent)',
      'on-accent': 'var(--color-on-accent)',
      'danger': 'var(--color-danger)',
      'success': 'var(--color-success)',
      'warning': 'var(--color-warning)',
      'warning-bg': 'var(--color-warning-bg)',
      'premium': 'var(--color-premium)',
      'premium-bg': 'var(--color-premium-bg)',
      'inverse-bg': 'var(--color-inverse-bg)',
      'inverse-text': 'var(--color-inverse-text)',
      'inverse-muted': 'var(--color-inverse-muted)'
      },
      fontFamily: { ui: 'var(--font-ui)', reading: 'var(--font-reading)', mono: 'var(--font-mono)' },
      fontSize: {
      'xs': ['var(--text-xs-size)', { lineHeight: 'var(--text-xs-line)', fontWeight: 'var(--text-xs-weight)' }],
      'sm': ['var(--text-sm-size)', { lineHeight: 'var(--text-sm-line)', fontWeight: 'var(--text-sm-weight)' }],
      'base': ['var(--text-base-size)', { lineHeight: 'var(--text-base-line)', fontWeight: 'var(--text-base-weight)' }],
      'article': ['var(--text-article-size)', { lineHeight: 'var(--text-article-line)', fontWeight: 'var(--text-article-weight)' }],
      'lg': ['var(--text-lg-size)', { lineHeight: 'var(--text-lg-line)', fontWeight: 'var(--text-lg-weight)' }],
      'xl': ['var(--text-xl-size)', { lineHeight: 'var(--text-xl-line)', fontWeight: 'var(--text-xl-weight)' }],
      '2xl': ['var(--text-2xl-size)', { lineHeight: 'var(--text-2xl-line)', fontWeight: 'var(--text-2xl-weight)' }],
      'display': ['var(--text-display-size)', { lineHeight: 'var(--text-display-line)', fontWeight: 'var(--text-display-weight)' }]
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', pill: 'var(--radius-pill)' },
      boxShadow: { card: 'var(--shadow-card)', pop: 'var(--shadow-pop)' },
      maxWidth: { content: 'var(--content-max)', measure: 'var(--article-measure)' },
      transitionDuration: { fast: 'var(--motion-fast)', base: 'var(--motion-base)' },
      transitionTimingFunction: { DEFAULT: 'var(--motion-ease)' },
    },
  },
} satisfies Config;
