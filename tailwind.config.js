/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bkg: 'hsl(var(--color-bkg) / <alpha-value>)',
        content: 'hsl(var(--color-content) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
      },
      boxShadow: {
          "i-sm": "0px 0px 5px 0px #00000005, 0px 2px 10px 0px #00000002, inset 0px 0px 5px 0px hsla(0,0%,100%,.25)",
          "i-md": "0px 0px 15px 0px #00000006, 0px 2px 30px 0px #00000016, inset 0px 0px 5px 0px hsla(0,0%,100%,.25)",
          "i-lg": "0px 0px 30px 0px #00000007, 0px 30px 60px 0px #00000027, inset 0px 0px 5px 0px hsla(0,0%,100%,.25)",
      },
    },
  },
  plugins: [],
}

