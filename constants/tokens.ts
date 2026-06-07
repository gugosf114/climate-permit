/**
 * Climate Permit — design tokens (single source of truth).
 *
 * Premium dark-gold "official OEM permit" language. Every screen imports from
 * here instead of re-declaring its own inline `const C = {...}` palette, so the
 * look stays unified across the whole flow (landing → quiz → permit → compat).
 *
 * Voice = monospace everywhere ("official document"), embossed gold accents on
 * deep navy-black, with bevelled surfaces that read like a real control unit.
 */

export const palette = {
  // ── Base / surfaces (deep navy-black) ──────────────────────────
  bg: '#0a0e14', // app background
  bg2: '#14191f', // raised surface / cards
  bg3: '#1f262e', // highest surface
  tile: '#1c232b', // interactive tile face
  tileHi: '#262e38', // bevel highlight (top/left)
  tileLo: '#0d1218', // bevel shadow (bottom/right)
  surface: 'rgba(255, 248, 232, 0.04)', // faint warm wash

  // ── Gold accent ramp ───────────────────────────────────────────
  gold: '#c9a875', // primary accent
  goldBright: '#e8c98a', // highlight / active
  goldDim: '#5a4730', // muted / inactive gold
  goldDeep: '#8a7250', // CTA bottom/right bevel
  goldShadow: 'rgba(201, 168, 117, 0.40)',

  // ── Text ───────────────────────────────────────────────────────
  text: '#f0e9d8', // primary
  textDim: '#a8a193', // secondary
  textMuted: '#6b6760', // tertiary / hints

  // ── Lines ──────────────────────────────────────────────────────
  border: 'rgba(201, 168, 117, 0.25)',
  borderHi: 'rgba(232, 201, 138, 0.55)',
  divider: 'rgba(201, 168, 117, 0.12)',

  // ── Signal (restrictions / partner / danger) ───────────────────
  red: '#c75444',
  redBright: '#e07060',
  redDeep: '#7a2818',

  // ── LCD readout ────────────────────────────────────────────────
  lcd: '#5c2a2a',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 } as const;

export const radius = { none: 0, sm: 2, md: 4, lg: 8, pill: 999 } as const;

export const font = { mono: 'monospace' as const };

/** Stamped-document type scale (size + tracking). */
export const type = {
  micro: { fontSize: 7, letterSpacing: 2 },
  caption: { fontSize: 8, letterSpacing: 2.5 },
  label: { fontSize: 9, letterSpacing: 3 },
  body: { fontSize: 11, letterSpacing: 1 },
  title: { fontSize: 16, letterSpacing: 2.5 },
  display: { fontSize: 22, letterSpacing: 3 },
  hero: { fontSize: 38, letterSpacing: 8 },
} as const;

/** Spreadable neon-emboss glow for headline gold text. */
export const glow = (color: string = palette.gold, blur: number = 12) => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: blur,
});

/** Raised "control-unit" bevel — light top/left, dark bottom/right. */
export const bevel = {
  borderTopColor: palette.tileHi,
  borderLeftColor: palette.tileHi,
  borderBottomColor: palette.tileLo,
  borderRightColor: palette.tileLo,
  borderWidth: 1.5,
} as const;

/** Embossed gold CTA bevel. */
export const goldBevel = {
  borderTopColor: palette.goldBright,
  borderLeftColor: palette.goldBright,
  borderBottomColor: palette.goldDeep,
  borderRightColor: palette.goldDeep,
  borderWidth: 1.5,
} as const;

export type Palette = typeof palette;
