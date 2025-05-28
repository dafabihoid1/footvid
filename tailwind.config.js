/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background:        'var(--background)',
        foreground:        'var(--foreground)',
        primary:           'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary:         'var(--secondary)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      // etc.
    },
  },
  plugins: [],
};
