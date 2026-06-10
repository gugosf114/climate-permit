# Climate Permit

A satirical Android personality quiz that classifies you into one of 16 archetypes based on how you operate your car's HVAC controls. The result is a shareable Operator Permit card.

**Premise:** You configure 10 climate settings as you would in real life (driver temp, fan speed, vent direction, recirculation, A/C, climate mode, rear vents, heated seats, pre-cool). The app maps your behavior onto a self/other × controller/chill 2x2 grid and assigns you to one of 16 archetypes (Subarctic Tyrant, Tropical Tyrant, Fresh Air Fascist, Trust-Fall Diplomat, etc).

## Stack

- **Framework:** Expo SDK 54 (new architecture + React Compiler)
- **Routing:** expo-router (file-based)
- **Styling:** NativeWind v4 + inline RN StyleSheet
- **State:** Zustand
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Share artifact:** react-native-view-shot (rasterizes permit card to JPG)
- **Install referrer:** react-native-play-install-referrer (carries compat payload through Play Store install)

## Architecture

All-local. Zero backend.

- **Scoring** (`lib/scoring.ts`): Pure functions. Quiz answers → trait flags → quadrant → archetype lookup in `data/archetypes.ts`.
- **Couple compatibility** (`lib/encode.ts`): Quiz state is base64-encoded into a Play Store share URL. Recipient installs via that URL, the app reads the referrer on first launch (`lib/installReferrer.ts`), decodes the payload, routes them to `/compat/[payload]` to take their own quiz and see the comparison.
- **Permit card** (`components/PermitCard.tsx`): Renders the shareable artifact — gold seal, classification bar, restrictions text, fake QR, permit number, per-model vehicle silhouette.
- **Brand-specific dashboard banner** (`app/dashboard.tsx` BrandBanner): The user's selected make+model loads a brand-styled dashboard illustration at the top of the quiz screen.

## Visual Identity

Premium dark-gold aesthetic.

- **Background:** Deep navy `#0a0e14`
- **Primary accent:** Warm metallic gold `#c9a875` (bright variant `#e8c98a`)
- **Text:** Warm white `#f0e9d8`, dim `#a8a193`
- **Typography:** Monospace throughout, bold + wide letterspacing for hero type
- **Seal:** Gold rings + dashed inner ring + snowflake — used as both landing-screen seal and launcher icon
- **Maroon temp displays:** Solid `#5c2a2a` background, amber glowing digits (matches WiM brand)
- **Buttons:** Embossed 3D pill tiles with light top/left + dark bottom/right bevels

## Asset Pipeline

All visual assets are AI-generated via GPT image-1 with brand-locked prompts:

- `assets/images/brands/{brand}.png` — 10 stylized brand logo marks (gold-on-dark)
- `assets/images/dashboards/{brand}.png` — 11 brand-specific dashboard banner illustrations
- `assets/images/vehicles/{make}-{model}.png` — 27 per-model side-profile silhouettes
- `assets/images/icon.png` — gold seal launcher icon
- `assets/images/textures/maroon-mesh.png` — Marshall-amp grille texture (currently unused; preserved as ref)

Generation scripts live in `/tmp/climate-permit-gen/` (not committed).

## Share Flow

1. **"Share Your Permit"** — Captures the permit card as a JPG, opens system share sheet with image + "I got X on Climate Permit. Get it: [Play Store URL]"
2. **"Test Your Partner"** — Encodes the user's quiz state into a Play Store install-referrer URL (`https://play.google.com/store/apps/details?id=app.climatepermit.android&referrer=compat%3DPAYLOAD`). Recipient installs from the link, the app reads the referrer on first launch and routes them to `/compat/[payload]` where they take their own quiz and see the side-by-side compatibility result.

## Dev

### One-time env setup

Required for any gradle command (debug or release):

```bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="/c/Users/georg/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
```

### Debug build (iterating from a laptop with hot reload)

```bash
npm install
npx expo run:android       # builds debug APK, installs, starts Metro
```

Debug build does NOT bundle the JS — the phone fetches it from Metro at runtime via `adb reverse tcp:8081 tcp:8081`. Needs ADB connection while running. Use this when actively writing code.

### Release build (standalone APK for actual phone use)

```bash
cd android && ./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk` (~150 MB with all bundled assets). Takes ~50 min on first build (R8 code shrinking + full optimization). Subsequent builds use the gradle cache.

To install:

```bash
adb uninstall app.climatepermit.android      # required if debug-signed install exists
adb install android/app/build/outputs/apk/release/app-release.apk
```

After install, the app is fully standalone — no laptop, no Metro, no ADB needed. Behaves exactly like a Play Store install.

## Ship Blockers

These have to be resolved before Play Store submission:

1. Real AdMob app ID — `app.json` still has Google's test ID `ca-app-pub-3940256099942544~3347511713`. Register at platform.admob.com.
2. Play Console listing — screenshots, feature graphic (1024×500), short + long descriptions, content rating questionnaire.
3. iOS not configured. Android-first.
4. Play Install Referrer flow has not been verified end-to-end against a real Play Store install (only works after app is published).

## Session Logs

- [SESSION_LOG_2026-05-30.md](SESSION_LOG_2026-05-30.md) — dark/gold rebrand, brand logos, vehicle silhouettes, launcher icon, install-referrer flow
- [SESSION_LOG_2026-06-03.md](SESSION_LOG_2026-06-03.md) — defensive install-referrer, release-APK build path established
- [SESSION_LOG_2026-06-06.md](SESSION_LOG_2026-06-06.md) — installed yesterday's APK; five iterations on TempStepper landed on OEM rotary dial with PanResponder drag-or-tap
- [SESSION_LOG_2026-06-09.md](SESSION_LOG_2026-06-09.md) — full pivot to California DMV document aesthetic across every screen + CA Driver License permit card + carbon-fibre A/C-knob launcher icon
- [FAILURE_LOG.md](FAILURE_LOG.md) — running log of dead ends and wrong turns; read before repeating any of them

---

## What's Left to Ship — Next Session Handoff

**Read this first if you're picking up this project cold.**

The app is currently visually code-complete. Every screen reads as one unified California DMV document — cream paper, navy italic "California" headline, gold bear seal, repeating watermarks, and field-numbered DL-style typography. The permit card is a faithful California Driver License parody. The launcher icon is a custom carbon-fibre A/C knob squircle.

What still has to happen before Play Store submission:

### Ship blockers (must do)

1. **Real AdMob app ID.** `app.json` still has Google's test ID `ca-app-pub-3940256099942544~3347511713`. Register at `platform.admob.com`, get the real app + ad-unit IDs, swap them in `app.json` and `lib/ads.ts`. Half a day with the dashboard.

2. **Play Console listing.** Needs:
   - 5–8 screenshots **shot against the new DMV aesthetic** (do not reuse the old dark-gold ones — they're not what ships any more)
   - 1024×500 feature graphic — design from scratch around the new visual language (cream paper + navy "California" + gold bear + the carbon-fibre knob)
   - Short description (≤80 chars), long description (≤4000 chars)
   - Content rating questionnaire
   - Target audience declaration
   - Privacy policy URL — already published at `gugosf114.github.io/climate-permit/privacy.html`
   - Parody disclaimer is already on the landing page

3. **End-to-end install-referrer verification.** The "Test Your Partner" flow encodes the user's quiz state into a Play Store install-referrer parameter so a recipient who installs the app via that link gets dropped straight into the compatibility comparison. This cannot be tested with sideloaded APKs — the referrer mechanism only fires on a real Play Store install. So **first internal test track upload is the verification**.

### iOS (deferred)

Not configured. Whole flow has only been built and tested on Android. Treat iOS as a future project, not a v1 blocker.

### Smaller polish on the list

- HUD overlay text labels on the brand-banner dashboard photo are very small at the size they sit. Could bump +1px.
- The bear silhouette is a hand-coded SVG path and decent but not perfect. A traced PNG from the official state flag (Wikimedia blocks curl — manual download via browser, then convert to white-on-transparent) would be cleaner.
- Temp-knob dashes are thin on cream. Could bump to 2px from 1.5px.
- Consider stripping or de-emphasising the "10 SETTINGS REMAINING" footer band on the dashboard quiz — it reads as old chrome.

### What NOT to revisit

- The dashboard quiz framing IS the operating sample (the equivalent of the DL photo). Keep the HVAC panel illustrated as an object inside the form. Do not convert it back into a "photo of the real dashboard."
- The permit card's CA DL field layout is meticulously matched to the real 2019/2025 specimen. Do not "simplify" the numbered field prefixes (`4d DLN`, `3 DOB`, `9 CLASS`, etc.) — they're the visual signature.
- The launcher icon is final. Do not regenerate the gold seal version.

### Build + install reminders

- Native rebuild is only needed if a new native module is added. `react-native-svg` is already linked.
- Standard release build: `cd android && ./gradlew assembleRelease` — 2-3 min on warm cache, 10-12 min cold.
- Install: `adb -s <device> install -r android/app/build/outputs/apk/release/app-release.apk` (use `install` without `-r` after `uninstall` for a clean install; required when the launcher icon changes because Android caches icons aggressively).
- Phone wireless ADB rotates ports on reconnect — discover with `adb mdns services` then `adb connect <ip:port>`.
