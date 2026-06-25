/**
 * Single source of truth for the Climate Permit visual identity.
 * Premium dark-gold "official document" aesthetic.
 *
 * Two type voices:
 *   - F.display  (Cinzel) — the CERTIFICATE / brand voice: wordmarks, hero
 *                  titles, classification names, big scores. Engraved + premium.
 *   - F.mono     (Courier) — the MACHINE / data voice: labels, body copy,
 *                  permit fields, LCD readouts, panel controls.
 */

import { LinearGradientPoint } from 'expo-linear-gradient';

export const C = {
  // Surfaces
  bg:        '#0a0e14',
  bg2:       '#14191f',
  bg3:       '#1f262e',
  surface:   'rgba(255, 248, 232, 0.04)',
  tile:      '#1c232b',
  tileHi:    '#262e38',
  tileLo:    '#0d1218',
  cardLight: '#262e38',
  cardDark:  '#06080c',

  // Gold
  gold:       '#c9a875',
  goldBright: '#e8c98a',
  goldDeep:   '#a8895c',
  goldDim:    '#5a4730',
  goldEdge:   '#8a7250',
  goldShadow: 'rgba(201, 168, 117, 0.4)',

  // Text
  text:      '#f0e9d8',
  textDim:   '#a8a193',
  textMuted: '#6b6760',

  // Lines
  border:    'rgba(201, 168, 117, 0.3)',
  borderHi:  'rgba(232, 201, 138, 0.55)',
  divider:   'rgba(201, 168, 117, 0.18)',

  // Accent
  red:      '#c75444',
  redLight: '#e07060',
  redDark:  '#7a2818',
} as const;

export const F = {
  display:      'Cinzel_700Bold',
  displayBlack: 'Cinzel_800ExtraBold',
  mono:         'monospace',
} as const;

/** Metallic gold fill — bright sheen at top, deeper toward the bottom. */
export const GOLD_GRADIENT: readonly [string, string, ...string[]] = ['#f0d79a', '#e8c98a', '#c9a875', '#a8895c'];
/** Soft dark vignette used behind hero content for depth. */
export const PANEL_GRADIENT: readonly [string, string, ...string[]] = ['#161c24', '#0e131a', '#0a0e14'];

export const GRAD_TOP: LinearGradientPoint = { x: 0.5, y: 0 };
export const GRAD_BOTTOM: LinearGradientPoint = { x: 0.5, y: 1 };
