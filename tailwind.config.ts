import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // "Ti" Theory: Atmosphere First (Deep Cool Cyan Tint)
                background: "var(--background)",
                foreground: "var(--foreground)",

                // GitHub Dark Dimmed colors
                git: {
                    bg: "var(--color-git-bg)",
                    "bg-secondary": "var(--color-git-bg-secondary)",
                    "bg-tertiary": "var(--color-git-bg-tertiary)",
                    border: "var(--color-git-border)",
                    "border-muted": "var(--color-git-border-muted)",
                    text: "var(--color-git-text)",
                    "text-muted": "var(--color-git-text-muted)",
                    "text-subtle": "var(--color-git-text-subtle)",
                },

                // Syntax colors
                syntax: {
                    green: "var(--color-syntax-green)",
                    purple: "var(--color-syntax-purple)",
                    yellow: "var(--color-syntax-yellow)",
                    blue: "var(--color-syntax-blue)",
                    cyan: "var(--color-syntax-cyan)",
                    orange: "var(--color-syntax-orange)",
                    red: "var(--color-syntax-red)",
                },

                // Cyberpunk Zen Color Palette ('Ti' Theory Compliant)
                cyber: {
                    // Void Background - Deep cyber tinted (NOT pure black)
                    void: "#010409",
                    surface: "hsl(230, 20%, 12%)",
                    elevated: "hsl(230, 18%, 16%)",

                    // Rarity System (For Repo Tiers)
                    rarity: {
                        legendary: "hsl(45, 100%, 60%)",  // Gold
                        epic: "hsl(280, 100%, 70%)",      // Purple
                        rare: "hsl(180, 100%, 50%)",      // Cyan
                        common: "hsl(0, 0%, 50%)",        // Gray
                    },

                    // Borders & Dividers - Subtle with hue tint
                    border: "hsl(230, 15%, 18%)",
                    "border-subtle": "hsl(230, 12%, 14%)",

                    // Text Hierarchy
                    text: "hsl(210, 20%, 88%)",
                    "text-muted": "hsl(215, 15%, 65%)",
                    "text-subtle": "hsl(220, 12%, 50%)",

                    // Neon Accents (High Saturation - use sparingly)
                    "neon-cyan": "hsl(180, 100%, 50%)",
                    "neon-magenta": "hsl(330, 100%, 65%)",
                    "neon-amber": "hsl(45, 100%, 60%)",

                    // Legacy compatibility
                    bg: "hsl(230, 25%, 8%)",
                    "bg-alt": "hsl(230, 20%, 12%)",
                    primary: "hsl(180, 100%, 50%)",
                    secondary: "hsl(330, 100%, 65%)",
                    accent: "hsl(45, 100%, 60%)",
                },
            },

            fontFamily: {
                sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
                serif: ["var(--font-serif)", "Playfair Display", "Merriweather", "Georgia", "serif"],
                mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "Consolas", "monospace"],
            },

            boxShadow: {
                // Neon glow effects
                "glow-cyan": "0 0 10px hsla(180, 100%, 50%, 0.5), 0 0 30px hsla(180, 100%, 50%, 0.2)",
                "glow-cyan-lg": "0 0 20px hsla(180, 100%, 50%, 0.6), 0 0 40px hsla(180, 100%, 50%, 0.3)",
                "glow-magenta": "0 0 10px hsla(330, 100%, 65%, 0.5), 0 0 30px hsla(330, 100%, 65%, 0.2)",
                "glow-amber": "0 0 10px hsla(45, 100%, 60%, 0.5), 0 0 30px hsla(45, 100%, 60%, 0.2)",

                // Depth layering
                "terminal": "0 0 0 1px hsl(230, 15%, 18%), 0 8px 24px hsla(230, 25%, 8%, 0.6)",
                "terminal-hover": "0 0 0 1px hsl(180, 100%, 50%), 0 8px 32px hsla(180, 100%, 50%, 0.2)",

                // Legacy
                "neon": "0 0 5px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%)",
                "neon-sm": "0 0 2px hsl(180, 100%, 50%), 0 0 10px hsl(180, 100%, 50%)",
            },

            borderRadius: {
                terminal: "6px",
            },

            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "cyber-grid": "linear-gradient(to right, hsl(230, 20%, 12%) 1px, transparent 1px), linear-gradient(to bottom, hsl(230, 20%, 12%) 1px, transparent 1px)",
                "holographic": "linear-gradient(135deg, hsla(180, 100%, 50%, 0.1) 0%, hsla(330, 100%, 65%, 0.05) 50%, hsla(45, 100%, 60%, 0.1) 100%)",
            },

            animation: {
                "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "scan-line": "scan-line 8s linear infinite",
                "float": "float 6s ease-in-out infinite",
                "spin-slow": "spin 4s linear infinite",
            },

            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "1", filter: "brightness(1)" },
                    "50%": { opacity: "0.8", filter: "brightness(1.2)" },
                },
                "scan-line": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100%)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
