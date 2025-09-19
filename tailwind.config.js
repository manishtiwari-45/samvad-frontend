/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Modern color palette with light theme focus
      colors: {
        background: {
          DEFAULT: '#FFFFFF', // Clean white background
          secondary: '#F8FAFC', // Light gray background
          tertiary: '#F1F5F9', // Slightly darker for sections
        },
        primary: {
          DEFAULT: '#0F172A', // Dark text for readability
          muted: '#334155',   // Muted dark text
        },
        secondary: {
          DEFAULT: '#64748B', // Secondary text
          muted: '#94A3B8',   // More muted secondary text
        },
        accent: {
          DEFAULT: '#3B82F6', // Modern blue accent
          hover: '#2563EB',   // Darker on hover
          light: '#DBEAFE',   // Light blue for backgrounds
          dark: '#1D4ED8',    // Dark variant
        },
        card: {
          DEFAULT: '#FFFFFF', // White card background
          hover: '#F8FAFC',   // Light hover state
          elevated: '#FFFFFF', // Elevated cards stay white
        },
        border: {
          DEFAULT: '#E2E8F0', // Light border
          muted: '#F1F5F9',   // Very light border
          focus: '#3B82F6',   // Blue focus border
        },
        success: {
          DEFAULT: '#10B981', // Modern green
          hover: '#059669',
          muted: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber warning
          hover: '#D97706',
          muted: '#92400E',
        },
        error: {
          DEFAULT: '#EF4444', // Modern red
          hover: '#DC2626',
          muted: '#991B1B',
        },
        info: {
          DEFAULT: '#3B82F6', // Blue info
          hover: '#2563EB',
          muted: '#1E40AF',
        },
      },
      // Enhanced typography
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      // Enhanced spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Enhanced border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Enhanced shadows with modern depth
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(56, 139, 253, 0.3)',
        'glow-lg': '0 0 40px rgba(56, 139, 253, 0.4)',
      },
      // Enhanced animations and transitions
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(56, 139, 253, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(56, 139, 253, 0.5)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      // Enhanced gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    },
  },
  plugins: [],
}