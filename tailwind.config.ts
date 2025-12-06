import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        christmas: {
          DEFAULT: "hsl(var(--christmas-red))",
          light: "hsl(var(--christmas-red-light))",
          dark: "hsl(var(--christmas-red-dark))",
        },
        reveillon: {
          DEFAULT: "hsl(var(--reveillon-blue))",
          light: "hsl(var(--reveillon-blue-light))",
          dark: "hsl(var(--reveillon-blue-dark))",
        },
        birthday: {
          DEFAULT: "hsl(var(--birthday-pink))",
          light: "hsl(var(--birthday-pink-light))",
          dark: "hsl(var(--birthday-pink-dark))",
        },
        wedding: {
          DEFAULT: "hsl(var(--wedding-silver))",
          light: "hsl(var(--wedding-silver-light))",
          dark: "hsl(var(--wedding-silver-dark))",
        },
        graduation: {
          DEFAULT: "hsl(var(--graduation-blue))",
          light: "hsl(var(--graduation-blue-light))",
          dark: "hsl(var(--graduation-blue-dark))",
        },
        baby: {
          DEFAULT: "hsl(var(--baby-pastel))",
          light: "hsl(var(--baby-pastel-light))",
          dark: "hsl(var(--baby-pastel-dark))",
        },
        kitchen: {
          DEFAULT: "hsl(var(--kitchen-red))",
          light: "hsl(var(--kitchen-red-light))",
          dark: "hsl(var(--kitchen-red-dark))",
        },
        generic: {
          DEFAULT: "hsl(var(--generic-purple))",
          light: "hsl(var(--generic-purple-light))",
          dark: "hsl(var(--generic-purple-dark))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        "glow-blue": "var(--shadow-glow-blue)",
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
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern: /(text|bg|border)-(christmas|reveillon|birthday|wedding|graduation|baby|kitchen|generic|gold|success|warning)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /(text|bg|border)-(christmas|reveillon|birthday|wedding|graduation|baby|kitchen|generic|gold|success|warning)\/(10|20|90)/,
    },
  ],
} satisfies Config;
