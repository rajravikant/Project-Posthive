/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        background: "var(--background)",
        backgroundDark: "var(--background-dark)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent : "var(--accent)",
        dark: "var(--dark)",
        light: "var(--light)",
        border: "var(--border)",
        borderDark: "var(--border-dark)",
        card: "var(--card)",
        cardDark: "var(--card-dark)",
        body: "var(--body)",
        bodyDark: "var(--body-dark)",
      },
      fontFamily : {
        OutFit_Regular : ["OutFit-Regular"],
        OutFit_Medium : ["OutFit-Medium"],
        OutFit_Bold : ["OutFit-Bold"],
        OutFit_SemiBold : ["OutFit-SemiBold"],
        OutFit_Light : ["OutFit-Light"],
        OutFit_Thin : ["OutFit-Thin"],
      },
      fontSize : {
       "h1" : ["32px"]
       
      }
    },
  },
  plugins: [
     require("@tailwindcss/typography")
  ],
}
