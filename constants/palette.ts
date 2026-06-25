/**
 * Climate Permit visual identity — now themeable.
 *
 *   LIGHT  = the original premium navy + gold (unchanged). Default.
 *   DARK   = a true-black AMOLED variant; gold brightened slightly to pop.
 *
 * Both modes are dark-backgrounded, so the status bar stays light in each.
 *
 * Components read the active palette with `useTheme()` and bind it to a local
 * `const C`, so every existing `C.xxx` reference keeps working unchanged.
 *
 * Two type voices (theme-independent):
 *   F.display (Cinzel) — certificate/brand voice
 *   F.mono   (Courier) — machine/data voice
 */

import { LinearGradientPoint } from 'expo-linear-gradient';
import { useClimateStore } from '../lib/store';

type Grad = readonly [string, string, ...string[]];

export interface Palette {
  bg: string; bg2: string; bg3: string; surface: string;
  tile: string; tileHi: string; tileLo: string;
  cardLight: string; cardDark: string;
  gold: string; goldBright: string; goldDeep: string; goldDim: string; goldEdge: string; goldShadow: string;
  text: string; textDim: string; textMuted: string;
  border: string; borderHi: string; divider: string;
  red: string; redLight: string; redDark: string;
  goldGradient: Grad;
  panelGradient: Grad;
}

export const LIGHT: Palette = {
  bg:        '#0a0e14',
  bg2:       '#14191f',
  bg3:       '#1f262e',
  surface:   'rgba(255, 248, 232, 0.04)',
  tile:      '#1c232b',
  tileHi:    '#262e38',
  tileLo:    '#0d1218',
  cardLight: '#262e38',
  cardDark:  '#06080c',

  gold:       '#c9a875',
  goldBright: '#e8c98a',
  goldDeep:   '#a8895c',
  goldDim:    '#5a4730',
  goldEdge:   '#8a7250',
  goldShadow: 'rgba(201, 168, 117, 0.4)',

  text:      '#f0e9d8',
  textDim:   '#a8a193',
  textMuted: '#6b6760',

  border:    'rgba(201, 168, 117, 0.3)',
  borderHi:  'rgba(232, 201, 138, 0.55)',
  divider:   'rgba(201, 168, 117, 0.18)',

  red:      '#c75444',
  redLight: '#e07060',
  redDark:  '#7a2818',

  goldGradient: ['#f0d79a', '#e8c98a', '#c9a875', '#a8895c'],
  panelGradient: ['#161c24', '#0e131a', '#0a0e14'],
};

export const DARK: Palette = {
  bg:        '#000000',
  bg2:       '#0b0b0d',
  bg3:       '#161618',
  surface:   'rgba(255, 248, 232, 0.05)',
  tile:      '#121214',
  tileHi:    '#1f1f22',
  tileLo:    '#040405',
  cardLight: '#1f1f22',
  cardDark:  '#000000',

  gold:       '#d4b483',
  goldBright: '#f2d59c',
  goldDeep:   '#b0925f',
  goldDim:    '#4a3a26',
  goldEdge:   '#7a6244',
  goldShadow: 'rgba(212, 180, 131, 0.45)',

  text:      '#f5efe2',
  textDim:   '#9a948a',
  textMuted: '#5e5a54',

  border:    'rgba(212, 180, 131, 0.28)',
  borderHi:  'rgba(242, 213, 156, 0.5)',
  divider:   'rgba(212, 180, 131, 0.15)',

  red:      '#d05a48',
  redLight: '#e87a68',
  redDark:  '#7a2818',

  goldGradient: ['#f6dca2', '#e8c98a', '#cdac78', '#a8895c'],
  panelGradient: ['#101012', '#080809', '#000000'],
};

export const F = {
  display:      'Cinzel_700Bold',
  displayBlack: 'Cinzel_800ExtraBold',
  mono:         'monospace',
} as const;

export const GRAD_TOP: LinearGradientPoint = { x: 0.5, y: 0 };
export const GRAD_BOTTOM: LinearGradientPoint = { x: 0.5, y: 1 };

/** Active palette, bound to the store's themeMode. Re-renders on toggle. */
export function useTheme(): Palette {
  const mode = useClimateStore((s) => s.themeMode);
  return mode === 'dark' ? DARK : LIGHT;
}
