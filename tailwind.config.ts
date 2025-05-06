import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {
            screens: {
                "2xl": { max: "1535px" },
                xl: { max: "1279px" },
                lg: { max: "1023px" },
                md: { max: "767px" },
                sm: { max: "639px" },
                "min-custom": { min: "1024px" },
            },
            colors: {
                "relif-orange-100": "#ED8A5f",
                "relif-orange-200": "#E5855B",
                "relif-orange-300": "#C3714E",
                "relif-orange-400": "#A15D40",
                "relif-orange-500": "#7F4933",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        fontSize: {
            xs: "0.7rem",
            sm: "0.8rem",
            medium: "0.9rem",
            base: "1rem",
            xl: "1.25rem",
            "2xl": "1.563rem",
            "3xl": "1.953rem",
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
