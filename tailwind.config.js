/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Code Pro', 'serif'], // Default sans-serif font
      },
    },
  },

  plugins: []
};
