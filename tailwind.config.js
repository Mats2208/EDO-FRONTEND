/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Paleta Académica Profesional Microsoft 2022
      colors: {
        // Azules Principales (Académico/Profesional)
        'primary': '#0078D4',
        'primary-dark': '#004E8C',
        'primary-light': '#50A0E8',
        'primary-lighter': '#E8F3FC',

        // Púrpura (Investigación/Académico)
        'academic': '#5B2E91',
        'academic-light': '#8764B8',
        'academic-lighter': '#F3EFFA',

        // Verde (Éxito/Positivo)
        'success': '#107C10',
        'success-light': '#5FAB5F',
        'success-lighter': '#EBF5EB',

        // Naranja (Advertencia/Acento)
        'warning': '#F59300',
        'warning-light': '#FFC04D',
        'warning-lighter': '#FFF4E5',

        // Rojo (Error/Crítico)
        'error': '#D13438',
        'error-light': '#E05C5F',
        'error-lighter': '#FBECED',

        // Grises Neutrales (Texto/Fondos)
        'neutral': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EDEBE9',
          300: '#D2D0CE',
          400: '#A19F9D',
          500: '#8A8886',
          600: '#605E5C',
          700: '#484644',
          800: '#323130',
          900: '#1A1918',
        },

        // Alias legacy (compatibilidad)
        'ms-blue': '#0078D4',
        'ms-blue-dark': '#004E8C',
        'ms-blue-light': '#50A0E8',
        'ms-blue-lighter': '#E8F3FC',
        'ms-purple': '#5B2E91',
        'ms-purple-light': '#8764B8',
        'ms-teal': '#107C10',
        'ms-green': '#107C10',
        'ms-green-light': '#5FAB5F',
        'ms-orange': '#F59300',
        'ms-red': '#D13438',
        'ms-gray': '#F5F5F5',
        'ms-gray-dark': '#605E5C',
        'ms-gray-darker': '#323130',
        'ms-border': '#EDEBE9',
        'ms-bg': '#FAFAFA',
      },
      // Sharp corners (Microsoft 2022 style)
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '2px',
        'md': '4px',
        'lg': '4px',
      },
      // Microsoft-like shadows
      boxShadow: {
        'ms': '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
        'ms-md': '0 3.2px 7.2px 0 rgba(0,0,0,.132), 0 0.6px 1.8px 0 rgba(0,0,0,.108)',
        'ms-lg': '0 6.4px 14.4px 0 rgba(0,0,0,.132), 0 1.2px 3.6px 0 rgba(0,0,0,.108)',
      },
      // Typography
      fontFamily: {
        'sans': ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}