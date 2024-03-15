import plaiceholder from "@plaiceholder/tailwindcss";
import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
   
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': 'hsl(26, 100%, 55%)',
        'primary-pale-orange': 'hsl(25, 100%, 94%)',
        'neutral-very-dark-blue': 'hsl(220, 13%, 13%)',
        'neutral-dark-grayish-blue': 'hsl(219, 9%, 45%)',
        'neutral-grayish-blue': 'hsl(220, 14%, 75%)',
        'neutral-light-grayish-blue': 'hsl(223, 64%, 98%)',
        'neutral-white': 'hsl(0, 0%, 100%)',
        'neutral-black': 'hsl(0, 0%, 0%)',
      },
      opacity: {
        '75': '0.75',
      },
      fontFamily: {
        'kumbh': 'var(--kumbh_sans)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        // ...
        colors: {primary: {
          
          foreground: "hsl(26, 100%, 55%)",
          DEFAULT: "hsl(26, 100%, 55%)",
        }},
      },
      dark: {
        // ...
        colors: {primary: {
          
          foreground: "hsl(26, 100%, 55%)",
          DEFAULT: "hsl(26, 100%, 55%)",
        }},
      },
      // ... custom themes
    },
  }),],
};
export default config;
