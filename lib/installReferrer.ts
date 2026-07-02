// Reads the Play Store install referrer if present.
// Format: a URL-encoded query string like "compat=BASE64PAYLOAD" set by compatShareUrl().
// Lazy-require the native module so a missing-or-unlinked native build doesn't crash the JS bundle.
export function readInstallReferrer(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
       
      const { PlayInstallReferrer } = require('react-native-play-install-referrer');
      if (!PlayInstallReferrer || typeof PlayInstallReferrer.getInstallReferrerInfo !== 'function') {
        resolve(null);
        return;
      }
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
  const decoded = decodeURIComponent(referrer);
  const match = decoded.match(/(?:^|&)compat=([^&]+)/);
  return match ? match[1] : null;
}
