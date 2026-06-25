# Climate Permit

A satirical Android personality quiz that classifies you into one of 16 archetypes based on how you operate your car's HVAC controls. The result is a shareable Operator Permit card.

**Premise:** You configure 10 climate settings as you would in real life (driver temp, fan speed, vent direction, recirculation, A/C, climate mode, rear vents, heated seats, pre-cool). The app maps your behavior onto a self/other × controller/chill 2x2 grid and assigns you to one of 16 archetypes (Subarctic Tyrant, Tropical Tyrant, Fresh Air Fascist, Trust-Fall Diplomat, etc).

## Stack

- **Framework:** Expo SDK 54 (new architecture + React Compiler)
- **Routing:** expo-router (file-based)
- **Styling:** NativeWind v4 + inline RN StyleSheet
- **Typography:** Cinzel display face (`@expo-google-fonts/cinzel`) for the certificate/brand voice; monospace for the machine/data voice
- **Gradients:** expo-linear-gradient (metallic gold surfaces)
- **State + theme:** Zustand (also holds `themeMode` for light/dark)
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Share artifact:** react-native-view-shot (rasterizes permit card to JPG)
- **QR:** react-native-qrcode-svg + react-native-svg (real scannable code on the permit card)
- **Install referrer:** react-native-play-install-referrer (carries compat payload through Play Store install)

## Architecture

All-local. Zero backend.

- **Scoring** (`lib/scoring.ts`): Pure functions. Quiz answers → trait flags → quadrant → archetype lookup in `data/archetypes.ts`.
- **Couple compatibility** (`lib/encode.ts`): Quiz state is base64-encoded into a Play Store share URL. Recipient installs via that URL, the app reads the referrer on first launch (`lib/installReferrer.ts`), decodes the payload, routes them to `/compat/[payload]` to take their own quiz and see the comparison.
- **Permit card** (`components/PermitCard.tsx`): Renders the shareable artifact — gold seal, metallic classification bar, restrictions text, real scannable QR (deep-links to the Play Store), permit number, per-model vehicle silhouette.
- **Theme** (`constants/palette.ts` + `useTheme()`): Two full palettes — `LIGHT` (the navy + gold default) and `DARK` (true-black AMOLED). Every component binds the active palette to a local `const C` so all `C.xxx` references switch on toggle. Choice lives in the Zustand store (`themeMode`), survives `reset()`, toggled from the landing screen.
- **Brand-specific dashboard banner** (`app/dashboard.tsx` BrandBanner): The user's selected make+model loads a brand-styled dashboard illustration at the top of the quiz screen.

## Visual Identity

Premium gold aesthetic, two themes (see `constants/palette.ts`).

- **Light theme (default):** Deep navy background `#0a0e14`, warm gold `#c9a875` (bright `#e8c98a`), warm-white text `#f0e9d8`.
- **Dark theme:** True-black background `#000000`, gold brightened to `#d4b483`/`#f2d59c` so it pops on black. Toggled via the sun/moon control on the landing screen.
- **Typography — two voices:** Cinzel (engraved Roman caps) = the *certificate/brand* voice (wordmarks, hero titles, classification names, compat score). Monospace (Courier) = the *machine/data* voice (HVAC panel, permit fields, LCD readouts, labels).
- **Gold surfaces:** Metallic vertical gradient (bright sheen top → deep edge bottom) on CTAs and classification bars, via `MetalButton` / `GoldSurface` (`components/ui/gold.tsx`).
- **Seal:** Gold rings + dashed inner ring + snowflake — landing-screen seal and launcher icon.
- **Maroon temp displays:** Solid `#5c2a2a` background, amber glowing digits (matches WiM brand).
- **Buttons (panel):** Embossed 3D pill tiles with light top/left + dark bottom/right bevels.

## Asset Pipeline

All visual assets are AI-generated via GPT image-1 with brand-locked prompts:

- `assets/images/brands/{brand}.png` — 10 stylized brand logo marks (transparent gold marks; ford/honda/nissan re-keyed 2026-06-25 to remove baked navy backgrounds)
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
- 2026-06-25 — premium design pass, themeable palette + dark mode, vehicle-logo fix (full log inlined at the bottom of this README)
- [FAILURE_LOG.md](FAILURE_LOG.md) — running log of dead ends and wrong turns; read before repeating any of them

---

# Session Log — 2026-06-25

Premium design pass + theming, plus a vehicle-logo asset fix. Three code commits + one docs commit landed on `master`. The new build was **not** installed — this session ran in a Termux/PRoot environment with no Android build toolchain (no Java/SDK/gradle, no `android/` dir), so producing an APK was impossible here.

## What shipped

**1. Premium design pass (`4c26fa1`)**
- **Brand consistency.** `CompatResult` and the whole `app/compat/[code].tsx` route (incl. the recipient's first post-install screen) were still in the legacy cream/green/maroon government palette. Rebranded both to dark-gold. No off-brand colors remain.
- **Centralized theme.** The duplicated `const C = {…}` palette (copy-pasted in 5 files, drifting) pulled into one source of truth: `constants/palette.ts`.
- **Typography — two voices.** Added Cinzel display face. Cinzel = certificate/brand voice (wordmarks, headers, classification, compat score); monospace = machine/data voice (HVAC panel, fields). Sized Cinzel down after long names ("Windows-Down Purist", 21 chars) would overflow.
- **Metallic gold.** `MetalButton`/`GoldSurface` via expo-linear-gradient on every primary CTA + classification bars; `elevation` for Android depth.
- **Real QR.** Replaced the ASCII fake QR with a real scannable one (dark-on-light so it actually scans), deep-linking to the Play Store.
- **Cleanup.** Deleted the orphaned Expo-template cluster + off-brand `DashboardKnob`; legacy tailwind colors → brand tokens. Net −206 lines.

**2. Light + dark theme (`81ee98a`)**
- Current navy+gold preserved unchanged as **LIGHT** (default). Added **DARK** (true-black AMOLED, gold brightened to pop) + sun/moon toggle on the landing screen.
- `LIGHT`/`DARK` palettes in `constants/palette.ts`, each with its own gradients, + `useTheme()` hook.
- `themeMode` + `toggleTheme()` in the Zustand store, kept outside `initial` so `reset()` never wipes it.
- Every component reads `const C = useTheme()` (dashboard uses `useDashC()`), so all existing `C.xxx` refs theme automatically. `_layout` stack bg follows theme.

**3. Vehicle-logo fix (`90245cb`)**
- Make-select badges showed ford/honda/nissan as mismatched dark boxes. Cause: those 3 shipped as RGB PNGs with a baked dark-navy background, while the other 7 were transparent RGBA marks. Keyed out the navy (corners + enclosed regions) with ImageMagick → all 10 now consistent gold marks. Verified by eye via a rendered montage. (These files predated and were untouched by the design commit.)

## Verification

No device render possible (Android app; web bundler bus-errors on memory here). Verified via TypeScript (clean) + ESLint (no new issues) on every change. Logo fix verified visually via montage.

## TODO — carry-over for next session

**Blocked this session (environment):**
1. **Install the newest build on the phone** — the explicit ask, undoable here: no Android toolchain, no Expo auth (`eas login` couldn't complete through the `!` one-shot; `~/.expo/state.json` has only a device UUID). Device IS reachable over adb (`127.0.0.1:5555`), so install is one command once an APK exists. Either: **laptop** → `cd android && ./gradlew assembleRelease` then `adb uninstall app.climatepermit.android && adb install …/app-release.apk`; or **EAS** → token at https://expo.dev/settings/access-tokens, set `EXPO_TOKEN`, `npx eas-cli build -p android --profile preview`, `adb install`.
2. **Eyeball new visuals on-device** — Cinzel hero sizes, gold gradient direction, and the `DARK` palette values (all tuned blind; two-line tweaks in `constants/palette.ts`).

**Pre-existing ship blockers (unchanged):**
3. Real AdMob app ID — `app.json` still has Google's test ID. Android-only, so no `iosAppId` needed.
4. Play Console listing — screenshots (update for new look + dark mode), feature graphic, descriptions, rating.
5. Play Install Referrer flow not verified end-to-end (needs publish).
6. iOS not configured. Android-first.

**Nice-to-have:**
7. Persist theme across launches (`themeMode` is in-memory; add zustand `persist` + AsyncStorage).
8. Pre-existing lint nits left as-is (expo-image type warnings, unescaped quotes, a few exhaustive-deps).
