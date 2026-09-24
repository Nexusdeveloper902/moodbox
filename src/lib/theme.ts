// Per-MoodBox colors and art, taken from the Penpot "Tarjeta de MoodBox" component.
import type { CSSProperties } from "react";

export type BoxTheme = { accent: string; ink: string; muted: string; chip: string; scene: string; closed: string; open: string };

export const BOX_THEMES: Record<string, BoxTheme> = {
  "dia-dificil": {
    accent: "#c4623a", ink: "#3b2a26", muted: "#8a6a5c", chip: "#fbebdd", scene: "#f7dcc6",
    closed: "/moodbox/cajas/cerrada-dia-dificil.svg", open: "/moodbox/cajas/abierta-dia-dificil.svg",
  },
  "necesito-relajarme": {
    accent: "#6e62a8", ink: "#2f2c4a", muted: "#6c6a86", chip: "#eef0f7", scene: "#e0e3f3",
    closed: "/moodbox/cajas/cerrada-relajarme.svg", open: "/moodbox/cajas/abierta-relajarme.svg",
  },
  "quiero-sorprender": {
    accent: "#e0487a", ink: "#3a1f2b", muted: "#7e5a66", chip: "#fff0f3", scene: "#ffd8e3",
    closed: "/moodbox/cajas/cerrada-sorprender.svg", open: "/moodbox/cajas/abierta-sorprender.svg",
  },
};

export const CUSTOM_BOX_ART = "/moodbox/cajas/abierta-tu-moodbox.svg";

/** CSS variables consumed by the `box-*` utilities in globals.css. */
export function themeVars(slug: string): CSSProperties {
  const t = BOX_THEMES[slug] ?? BOX_THEMES["dia-dificil"]!;
  return { "--box-accent": t.accent, "--box-ink": t.ink, "--box-muted": t.muted, "--box-chip": t.chip, "--box-scene": t.scene } as CSSProperties;
}

export const CATEGORIES = [
  { id: "dulce", title: "Algo dulce", filter: "Dulces" },
  { id: "bebida", title: "Algo para tomar", filter: "Bebidas" },
  { id: "detalle", title: "Un detalle", filter: "Detalles" },
  { id: "relajacion", title: "Para relajarte", filter: "Relajación" },
  { id: "mensaje", title: "Un mensaje", filter: "Mensajes" },
] as const;

export const boxLabel = (n: number) => `MoodBox ${String(n).padStart(2, "0")}`;
