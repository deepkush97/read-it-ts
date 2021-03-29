module.exports = {
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["IBM Plex Sans"],
    },
    extend: {
      colors: {
        blue: {
          100: "#cce4f6",
          100: "#99c9ed",
          100: "#66afe5",
          100: "#3394dc",
          100: "#0079d3",
          100: "#0061a9",
          100: "#00497f",
          100: "#003504",
          100: "#00182a",
        },
      },
      spacing: {
        70: "17.5rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};