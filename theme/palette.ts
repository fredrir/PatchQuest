import { darken, lighten } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";

/**
 * NTNU brand base colors. Index 6 in each generated tuple holds the base hex
 * verbatim, which matches Mantine's default `primaryShade.light = 6`.
 */
export const NTNU_BASE = {
  blue: "#00509e",
  lime: "#bcd025",
  lightBlue: "#6096d0",
  orange: "#ef8114",
  beige: "#cfb887",
  magenta: "#b01b81",
  yellow: "#f7d019",
  purple: "#482776",
  turquoise: "#3cbfbe",
} as const;

export type NtnuColorName = keyof typeof NTNU_BASE;

function tupleFromBase(base: string): MantineColorsTuple {
  return [
    lighten(base, 0.92),
    lighten(base, 0.78),
    lighten(base, 0.6),
    lighten(base, 0.44),
    lighten(base, 0.28),
    lighten(base, 0.13),
    base,
    darken(base, 0.1),
    darken(base, 0.22),
    darken(base, 0.36),
  ] as unknown as MantineColorsTuple;
}

export const ntnuPalette = {
  ntnuBlue: tupleFromBase(NTNU_BASE.blue),
  lime: tupleFromBase(NTNU_BASE.lime),
  lightBlue: tupleFromBase(NTNU_BASE.lightBlue),
  orange: tupleFromBase(NTNU_BASE.orange),
  beige: tupleFromBase(NTNU_BASE.beige),
  magenta: tupleFromBase(NTNU_BASE.magenta),
  yellow: tupleFromBase(NTNU_BASE.yellow),
  purple: tupleFromBase(NTNU_BASE.purple),
  turquoise: tupleFromBase(NTNU_BASE.turquoise),
} as const;

export type PaletteColorKey = keyof typeof ntnuPalette;
