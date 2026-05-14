import { Answers } from './store';

export interface CompatPayload {
  answers: Record<string, string | number>;
  archetypeId: string;
  x: number;
  y: number;
  make: string;
  model: string;
}

export function encodePayload(payload: CompatPayload): string {
  const json = JSON.stringify(payload);
  return btoa(encodeURIComponent(json))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decodePayload(encoded: string): CompatPayload | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '=='.slice(0, (4 - (b64.length % 4)) % 4);
    const json = decodeURIComponent(atob(padded));
    return JSON.parse(json) as CompatPayload;
  } catch {
    return null;
  }
}

export function compatScore(x1: number, y1: number, x2: number, y2: number): number {
  const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return Math.round(Math.max(0, 100 - (dist / 28) * 100));
}

export function compatVerdict(score: number): string {
  if (score >= 80) return 'Climate Soulmates. Suspicious.';
  if (score >= 60) return 'Workable. Minor border disputes.';
  if (score >= 40) return 'The Cold War. Therapy recommended.';
  if (score >= 20) return 'Hostile climates. Separate vehicles advised.';
  return 'How are you still together?';
}
