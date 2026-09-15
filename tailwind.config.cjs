/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },

      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
        },
      },
      colors: {
        // Neurovex brand blue, sampled from the logo's cyan gradient endpoint
        blue: {
          10: "#0B2C42",
          20: "#113E5C",
          30: "#155378",
          40: "#1470A0",
          50: "#1090C7",
          60: "#2FAEEA",
          70: "#7FD0F5",
        },
        "blue-light": {
          10: "#7FD0F5",
          20: "#9BDAF7",
          30: "#B7E4F9",
          40: "#D3EEFC",
          50: "#E8F6FD",
          60: "#F1FAFE",
          70: "#FAFDFF",
        },
        teal: {
          10: "#082620",
          20: "#104439",
          30: "#125343",
          40: "#136953",
          50: "#188365",
          60: "#29AE86",
          70: "#49BE97",
        },
        "teal-light": {
          10: "#649687",
          20: "#6F9F91",
          30: "#83ADA0",
          40: "#AFCAC2",
          50: "#D4E3DE",
          60: "#ECF2F0",
          70: "#FCFDFD",
        },
        // Neurovex brand violet, sampled from the logo's gradient midpoint
        violet: {
          10: "#2E2B7A",
          20: "#3D3A96",
          30: "#4C47B2",
          40: "#5B54CE",
          50: "#6260E8",
          60: "#8482ED",
          70: "#A6A5F2",
        },
        "neutral-dark": {
          0: "#000000",
          10: "#0E0F10",
          20: "#1A1C1E",
          30: "#292D33",
          40: "#32373E",
          50: "#3B4149",
        },
        "neutral-light": {
          0: "#C3CAD4",
          10: "#D3DAE5",
          20: "#E2E7EE",
          30: "#F2F4F7",
          40: "#FAFBFD",
          50: "#FFFFFF",
        },
      },
      fontSize: {
        title: [
          "clamp(3rem, 2.5rem + 2.5vw, 4.75rem)",
          {
            lineHeight: "105%",
            letterSpacing: "-0.01em",
          },
        ],
        "heading-lg": [
          "clamp(2rem, 1.75rem + 1.25vw, 2.75rem)",
          {
            lineHeight: "125%",
            letterSpacing: "0",
          },
        ],
        "heading-sm": [
          "clamp(1.5rem, 1.375rem + 0.625vw, 2rem)",
          {
            lineHeight: "115%",
            letterSpacing: "0",
          },
        ],
        "label-lg": [
          "clamp(1.25rem, 1.1875rem + 0.3125vw, 1.5rem)",
          {
            lineHeight: "150%",
            letterSpacing: "0",
          },
        ],
        "label-sm": [
          "clamp(1.125rem, 1.0938rem + 0.1563vw, 1.25rem)",
          {
            lineHeight: "135%",
            letterSpacing: "0.01em",
          },
        ],
        "paragraph-lg": [
          "clamp(1rem, 0.9688rem + 0.1563vw, 1.125rem)",
          {
            lineHeight: "165%",
            letterSpacing: "-0.01em",
          },
        ],
        "paragraph-sm": [
          "clamp(0.875rem, 0.8594rem + 0.0781vw, 1rem)",
          {
            lineHeight: "155%",
            letterSpacing: "-0.02em",
          },
        ],
        "paragraph-xs": [
          "clamp(0.75rem, 0.7344rem + 0.0781vw, 0.875rem)",
          {
            lineHeight: "155%",
            letterSpacing: "-0.01em",
          },
        ],
      },
      animation: {
        marquee: "marquee 10s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-motion")],
};
