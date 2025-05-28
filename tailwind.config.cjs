/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background:        'var(--background)',
        test: 'var(--test)',
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
