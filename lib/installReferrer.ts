import { PlayInstallReferrer } from 'react-native-play-install-referrer';

// Reads the Play Store install referrer if present.
// Format: a query-string like "compat=BASE64PAYLOAD" set by compatShareUrl().
export function readInstallReferrer(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      PlayInstallReferrer.getInstallReferrerInfo((info: any, error: any) => {
        if (error || !info) {
          resolve(null);
          return;
        }
        resolve(info.installReferrer ?? null);
      });
    } catch {
      resolve(null);
    }
  });
}

export function parseCompatPayload(referrer: string | null): string | null {
  if (!referrer) return null;
  // referrer is a URL-encoded query string, possibly "compat=PAYLOAD" or "utm_source=...&compat=PAYLOAD"
  const decoded = decodeURIComponent(referrer);
  const match = decoded.match(/(?:^|&)compat=([^&]+)/);
  return match ? match[1] : null;
}
