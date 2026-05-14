import { createTheme, type MantineThemeOverride } from "@mantine/core";
import { ntnuPalette } from "./palette";

/**
 * Single source of truth for the visual identity. Tokens here are mirrored as
 * CSS custom properties in `app/globals.css` so Tailwind utilities and Mantine
 * components stay aligned.
 */
export const themeOverride: MantineThemeOverride = createTheme({
  primaryColor: "ntnuBlue",
  primaryShade: { light: 6, dark: 5 },
  autoContrast: true,
  luminanceThreshold: 0.32,
  defaultRadius: "md",
  cursorType: "pointer",
  respectReducedMotion: true,
  focusRing: "auto",
  white: "#ffffff",
  black: "#0e1116",

  colors: ntnuPalette,

  fontFamily: "var(--font-sans)",
  fontFamilyMonospace: "var(--font-mono)",
  headings: {
    fontFamily: "var(--font-sans)",
    fontWeight: "650",
    sizes: {
      h1: { fontSize: "2.25rem", lineHeight: "1.15", fontWeight: "700" },
      h2: { fontSize: "1.625rem", lineHeight: "1.2", fontWeight: "650" },
      h3: { fontSize: "1.25rem", lineHeight: "1.25", fontWeight: "650" },
      h4: { fontSize: "1.05rem", lineHeight: "1.3", fontWeight: "600" },
      h5: { fontSize: "0.95rem", lineHeight: "1.4", fontWeight: "600" },
      h6: { fontSize: "0.85rem", lineHeight: "1.45", fontWeight: "600" },
    },
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "0.95rem",
    lg: "1.05rem",
    xl: "1.2rem",
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  radius: {
    xs: "4px",
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
  },

  shadows: {
    xs: "0 1px 2px rgba(15, 23, 42, 0.06)",
    sm: "0 2px 6px rgba(15, 23, 42, 0.08)",
    md: "0 6px 18px rgba(15, 23, 42, 0.10)",
    lg: "0 14px 32px rgba(15, 23, 42, 0.14)",
    xl: "0 28px 60px rgba(15, 23, 42, 0.18)",
  },

  components: {
    Button: {
      defaultProps: { radius: "md" },
    },
    Card: {
      defaultProps: { radius: "lg", padding: "lg", withBorder: true },
    },
    Paper: {
      defaultProps: { radius: "lg" },
    },
    Badge: {
      defaultProps: { radius: "sm", variant: "light" },
    },
    Tooltip: {
      defaultProps: { withArrow: true, openDelay: 200 },
    },
    ActionIcon: {
      defaultProps: { variant: "subtle", radius: "md" },
    },
    Divider: {
      defaultProps: { color: "var(--app-border)" },
    },
  },
});
