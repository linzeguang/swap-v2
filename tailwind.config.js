/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px'
      },
      spacing: {
        18: '4.5rem'
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))'
        },
        info: {
          DEFAULT: 'hsl(var(--color-info))',
          background: 'hsl(var(--color-info-background))'
        },
        success: {
          DEFAULT: 'hsl(var(--color-success))',
          background: 'hsl(var(--color-success-background))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          background: 'hsl(var(--color-destructive-background))'
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning))',
          background: 'hsl(var(--color-warning-background))'
        },
        tip: 'hsl(var(--color-tip))',
        overlay: 'var(--color-overlay)',
        content: 'hsl(var(--color-content))',
        input: {
          bg: 'hsl(var(--color-input-bg))',
          border: {
            DEFAULT: 'hsl(var(--color-input-border))',
            focus: 'hsl(var(--color-input-border-focus))'
          }
        },
        text: {
          primary: 'hsl(var(--color-text-primary))',
          secondary: 'hsl(var(--color-text-secondary))',
          tertiary: 'hsl(var(--color-text-tertiary))',
          disabled: 'hsl(var(--color-text-disabled))'
        },
        border: {
          DEFAULT: 'hsl(var(--color-border))',
          thin: 'hsl(var(--color-border-thin))'
        }
      },
      borderRadius: {
        '4xl': 32
      },
      fontFamily: {
        Kanit: ['Kanit', 'sans-serif']
      },
      fontSize: {
        '1.5xl': '1.25rem'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/aspect-ratio')]
}
