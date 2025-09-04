/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        'inter': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        green: {
          primary: '#4CAF50',
          secondary: '#81C784',
          dark: '#2E7D32',
          50: '#E8F5E9',
          100: '#C8E6C9',
          600: '#4CAF50',
          700: '#388E3C',
          800: '#2E7D32',
        },
        accent: {
          yellow: '#FFEB3B',
        },
        neutral: {
          bg: '#E8F5E9',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #A8E063 0%, #56AB2F 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      },
    },
  },
  plugins: [],
}
