/**
 * Climate Permit — design tokens (single source of truth).
 *
 * DMV paper language: cream "official form" paper, CA-DL navy, stamp red,
 * seal gold, monospace voice. Two themes:
 *   - light  ("day window")   — the original paper look
 *   - dark   ("night service") — dark asphalt counter, same document voice
 *
 * Every screen reads the active palette via useDMV(); nothing re-declares
 * hex values locally. PermitCard is the one exception by design — the permit
 * is a physical paper card, so it stays light in both themes (it reads as a
 * paper card sitting on a dark counter).
 *
 * All pairs verified WCAG AA against their backgrounds (see PR notes).
 */

import { create } from 'zustand';
import { useColorScheme } from 'react-native';

export const DMV_LIGHT = {
  // paper surfaces
  paper: '#f5efde',
  paperLight: '#fbf6e6',
  paperDeep: '#ede4c2',
  paperEdge: '#e7ddc0',
  panelShadow: '#cdbe8a',
  // lines
  border: '#8a7a3a',
  divider: 'rgba(20,20,20,0.18)',
  rowBorder: 'rgba(20,20,20,0.12)',
  blueDivider: 'rgba(14, 45, 99, 0.15)',
  // CA navy accent
  caBlue: '#0e2d63',
  caBlueSoft: '#1e4385',
  caBlueDeep: '#081c44',
  blueMuted: '#7a8aa8',
  // ink
  ink: '#0a0a0a',
  inkSoft: '#2c2c2c',
  inkSofter: '#4a4a4a',
  inkDim: '#7a7a7a',
  // stamps & seals
  red: '#b41d23',
  redDeep: '#7a1218',
  gold: '#c78c19',
  goldDeep: '#8b6310',
  goldLight: '#e8b32a',
  hologram: '#dba519',
  // dashboard hardware
  knobFace: '#fbf6e6',
  knobPointer: '#0e2d63',
} as const;

export type DMVPalette = { [K in keyof typeof DMV_LIGHT]: string };

export const DMV_DARK: DMVPalette = {
  // "night counter" surfaces
  paper: '#13161d',
  paperLight: '#1b1f28',
  paperDeep: '#0e1116',
  paperEdge: '#262b36',
  panelShadow: '#0a0d12',
  // lines
  border: '#9c8a4e',
  divider: 'rgba(237,230,212,0.16)',
  rowBorder: 'rgba(237,230,212,0.10)',
  blueDivider: 'rgba(143,179,240,0.18)',
  // navy flips to a light service-window blue
  caBlue: '#8fb3f0',
  caBlueSoft: '#a9c4f4',
  caBlueDeep: '#5372a8',
  blueMuted: '#6b7a94',
  // ink flips to cream
  ink: '#ede6d4',
  inkSoft: '#c9c2b2',
  inkSofter: '#a9a294',
  inkDim: '#8d8779',
  // stamps & seals, brightened for dark
  red: '#e0605a',
  redDeep: '#b23f38',
  gold: '#d9a63c',
  goldDeep: '#a67c1e',
  goldLight: '#edbf52',
  hologram: '#dba519',
  // dashboard hardware
  knobFace: '#232834',
  knobPointer: '#cfe0ff',
};

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: (systemScheme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
  // Toggle flips relative to what's currently SHOWING (system-aware).
  toggle: (systemScheme) =>
    set((s) => {
      const showing = s.mode === 'system' ? systemScheme : s.mode;
      return { mode: showing === 'dark' ? 'light' : 'dark' };
    }),
}));

/** Active theme name ('light' | 'dark') respecting system + manual override. */
export function useThemeName(): 'light' | 'dark' {
  const system = useColorScheme() ?? 'light';
  const mode = useThemeStore((s) => s.mode);
  return mode === 'system' ? system : mode;
}

/** The active DMV palette. Call at the top of any component that draws. */
export function useDMV(): DMVPalette {
  return useThemeName() === 'dark' ? DMV_DARK : DMV_LIGHT;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 40 } as const;

export const radius = { none: 0, sm: 2, md: 4, lg: 8, pill: 999 } as const;

export const font = { mono: 'monospace' as const };

/** Stamped-document type scale (size + tracking). 8px floor — microprint
 *  below that is illegible on device. */
export const type = {
  micro: { fontSize: 8, letterSpacing: 2 },
  caption: { fontSize: 8, letterSpacing: 2.5 },
  label: { fontSize: 9, letterSpacing: 3 },
  body: { fontSize: 11, letterSpacing: 1 },
  title: { fontSize: 16, letterSpacing: 2.5 },
  display: { fontSize: 22, letterSpacing: 3 },
  hero: { fontSize: 38, letterSpacing: 8 },
} as const;
