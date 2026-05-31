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

```bash
npm install
npx expo run:android       # native build + install on connected device
npx expo start             # Metro dev server (after native build)
```

Required env for native build: `JAVA_HOME` pointing to Android Studio's JBR, `ANDROID_HOME` pointing to the Android SDK.

## Ship Blockers

These have to be resolved before Play Store submission:

1. Real AdMob app ID — `app.json` still has Google's test ID `ca-app-pub-3940256099942544~3347511713`. Register at platform.admob.com.
2. Play Console listing — screenshots, feature graphic (1024×500), short + long descriptions, content rating questionnaire.
3. iOS not configured. Android-first.
4. Play Install Referrer flow has not been verified end-to-end against a real Play Store install (only works after app is published).

## Session Logs

- [SESSION_LOG_2026-05-30.md](SESSION_LOG_2026-05-30.md) — dark/gold rebrand, brand logos, vehicle silhouettes, launcher icon, install-referrer flow
