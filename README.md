# Climate Permit

A satirical Android personality quiz that classifies you into one of 16 archetypes based on how you operate your car's HVAC controls. The result is a shareable Operator Permit card, styled as a California Driver License parody.

**Premise:** You configure 10 climate settings as you would in real life (driver temp, fan speed, vent direction, recirculation, A/C, climate mode, rear vents, heated seats, pre-cool). The app maps your behavior onto a self/other × controller/chill 2x2 grid and assigns you to one of 16 archetypes (Subarctic Tyrant, Tropical Tyrant, Fresh Air Fascist, Trust-Fall Diplomat, etc).

## Stack

- **Framework:** Expo SDK 54 (new architecture + React Compiler)
- **Routing:** expo-router (file-based)
- **Styling:** NativeWind v4 + inline RN StyleSheet
- **State:** Zustand
- **Vector:** react-native-svg (for the California bear silhouette + SVG icons)
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Share artifact:** react-native-view-shot (rasterizes permit card to JPG)
- **Install referrer:** react-native-play-install-referrer (carries compat payload through Play Store install)

## Architecture

All-local. Zero backend.

- **Scoring** (`lib/scoring.ts`): Pure functions. Quiz answers → trait flags → quadrant → archetype lookup in `data/archetypes.ts`.
- **Couple compatibility** (`lib/encode.ts`): Quiz state is base64-encoded into a Play Store share URL. Recipient installs via that URL, the app reads the referrer on first launch (`lib/installReferrer.ts`), decodes the payload, routes them to `/compat/[payload]` to take their own quiz and see the comparison.
- **Permit card** (`components/PermitCard.tsx`): Renders the shareable artifact as a faithful California Driver License parody — serif italic deep-navy "California" headline, numbered DL field prefixes, red ID values, gold California grizzly silhouette, cursive signature, holographic gold strip, repeating watermarks, per-model vehicle silhouette in the photo box.
- **Brand-specific dashboard banner** (`app/dashboard.tsx` BrandBanner): The user's selected make+model loads a brand-styled dashboard illustration at the top of the quiz screen, framed as the "operating sample" photo equivalent on a DL.

## Visual Identity — California Department of Climate Control

Cohesive California DMV document aesthetic across every screen. The app reads as one multi-page government form titled *Application for Climate Operator Permit, Form 21-B*.

- **Background:** Cream paper `#f5efde` everywhere
- **Primary headline:** Serif italic deep-navy `#0e2d63` "California" (matches the real CA DL exactly)
- **Block subtitle:** Bold sans `#0e2d63` "CLIMATE PERMIT"
- **Body text:** Ink black `#0a0a0a` and dim `#7a7a7a`
- **ID values:** CA DL red `#b41d23` for DLN, EXP, DOB, ISS — same red as the real card
- **Accent:** Navy `#0e2d63` for field-number prefixes (4d, 4b, 3, etc.) and section labels
- **Gold:** `#c78c19` for the California bear seal, holographic strip, and brand-logo borders
- **Typography hierarchy:** Serif italic for display moments ("California", signatures), bold monospace for field labels (`4d DLN`, `SECTION 1.A`, `16 HGT`), system sans for body and field values
- **Watermarks:** Faint repeating "STATE OF CALIFORNIA" navy bands (5-6% opacity), large faint bear silhouette behind content, subtle horizontal gold security grid lines, repeating DLN sub-id stamps along edges
- **California bear silhouette** in gold, top-right corner of every screen — the recurring brand mark

The dashboard quiz screen is the exception: it contains the in-fiction "operating sample" — an illustrated HVAC panel the user operates. The panel itself stays as a real OEM-looking control object (cream-paper-faced knobs with navy line art, blue-to-red dash gradient for the temperature knob, cool/warm color semantics preserved), but the framing around it (header, section number, form chrome) matches the DMV paper aesthetic. The HVAC panel is the equivalent of the headshot photo on a DL — a high-fidelity rendering inside the form.

## Asset Pipeline

- `assets/images/icon.png` — Carbon-fibre A/C-knob squircle launcher icon (1024×1024)
- `assets/images/android-icon-foreground.png` — Same composition for the Android adaptive-icon foreground
- `assets/images/splash-icon.png` — Splash version
- `assets/images/brands/{brand}.png` — 10 stylized brand logo marks (gold-bordered photo-box style)
- `assets/images/dashboards/{brand}.png` — 11 brand-specific dashboard banner illustrations
- `assets/images/vehicles/{make}-{model}.png` — 27 per-model side-profile silhouettes (used in both the BrandBanner and the PermitCard photo box)
- `assets/images/hvac-icons/{face,mix,feet,defrost,feet_defrost,recirc}.png` — Standard OEM HVAC pictograms extracted from a reference strip, recolored white-on-transparent for `tintColor` theming
- `assets/images/textures/maroon-mesh.png` — Marshall-amp grille texture (legacy; preserved as reference but unused)

The launcher icon is rendered programmatically with PIL (see `SESSION_LOG_2026-06-09` below). Other visual assets were AI-generated via GPT image-1 with brand-locked prompts during the dark-gold era.

## Share Flow

1. **"Share Your Permit"** — Captures the permit card as a JPG via react-native-view-shot, opens system share sheet with image + "I got X on Climate Permit. Get it: [Play Store URL]"
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

Output: `android/app/build/outputs/apk/release/app-release.apk` (~150 MB with all bundled assets). Takes ~50 min on first build (R8 code shrinking + full optimization). Subsequent builds use the gradle cache (~2-3 min for JS-only changes; ~10-12 min when a new native module is added).

To install:

```bash
adb uninstall app.climatepermit.android      # required if debug-signed install exists OR icon changed
adb install android/app/build/outputs/apk/release/app-release.apk
```

After install, the app is fully standalone — no laptop, no Metro, no ADB needed. Behaves exactly like a Play Store install.

### Launcher icon caching gotcha

Expo extracts `assets/images/icon.png` into `android/app/src/main/res/mipmap-*dpi/ic_launcher*.webp` during `prebuild`. Subsequent edits to `icon.png` do **NOT** regenerate them — gradle picks up the stale webp files. If you change the launcher icon, you must either:

- Run `npx expo prebuild --clean` (regenerates everything, may revert other native tweaks), or
- Run a Python pass that resizes the master to all 5 densities (mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi for both legacy 48dp icons and adaptive 108dp foreground) and overwrites the webp files. Then rebuild. See `SESSION_LOG_2026-06-09` below for the script outline.

### Wireless ADB

Phone wireless-ADB rotates ports on reconnect. To find the current port:

```bash
adb mdns services 2>&1 | grep adb-tls-connect | head -1
adb connect <ip:port>
adb devices    # verify
```

The phone may also expose a non-TLS port at `192.168.1.234:5555` which is usually more stable.

## Ship Blockers

These have to be resolved before Play Store submission:

1. Real AdMob app ID — `app.json` still has Google's test ID `ca-app-pub-3940256099942544~3347511713`. Register at platform.admob.com.
2. Play Console listing — screenshots (reshot against the new DMV aesthetic), feature graphic (1024×500), short + long descriptions, content rating questionnaire.
3. iOS not configured. Android-first.
4. Play Install Referrer flow has not been verified end-to-end against a real Play Store install (only works after app is published).

See **"What's Left to Ship — Next Session Handoff"** at the very end of this file for the full handoff note.

---

# Session Logs

The visual direction shifted significantly over the course of these sessions. The 2026-05-30 session log describes the **premium dark-gold OEM HVAC aesthetic** that was the project's direction through 2026-06-06. The 2026-06-09 session log documents the **full pivot to the California DMV document aesthetic** that's now shipping. The earlier logs are kept here for historical context — names and file paths still match, but anything about gold colours, dark navy backgrounds, glowing amber text, or chrome bevels describes what the app *was*, not what it *is*.

## Session 2026-05-30 — Premium dark-gold rebrand (legacy aesthetic)

Major work day. Started with a working but visually flat first-cut app from 2026-05-14; ended with a full premium dark-gold rebrand, AI-generated brand identity, and the install-referrer flow plumbed end to end.

### What shipped

#### Visual rebrand: parody-DMV → premium dark-gold

Stripped the original "United States Department of Climate Control" cream/green/amber parody-government aesthetic and replaced with a premium dark-navy + warm-gold treatment across every screen:

- **Landing** (`app/index.tsx`): Deep navy `#0a0e14` bg, big glowing gold "CLIMATE PERMIT" wordmark with text-shadow halo, pulsing gold seal (3 concentric rings + snowflake center), premium embossed gold CTA "ISSUE MY PERMIT," staggered fade-in entrance animations.
- **Car select** (`app/car-select.tsx`): Dark mode, embossed 3D pill tiles for each make + model with light top/left + dark bottom/right bevels, alternating subtle row tints.
- **Dashboard** (`app/dashboard.tsx`): Full palette swap (kept the existing OEM-HVAC-panel structure, swapped greens for golds, creams for warm whites).
- **Result + permit card** (`app/result.tsx`, `components/PermitCard.tsx`): Dark premium card with gold border, gold classification bar with glow, embossed share buttons, staggered entrance animations.
- **App config** (`app.json` + `app/_layout.tsx`): `userInterfaceStyle: dark`, splash bg `#0a0e14`, adaptive-icon bg `#0a0e14`, StatusBar style `light`, contentStyle bg `#0a0e14`.

Rationale (at the time): Original parody-DMV aesthetic depended on users having a visceral "I've waited at the DMV" emotional memory. Most modern users don't — government services are increasingly digital. Cream paper read as "muted weird" rather than "haha bureaucracy." Dark-gold reads as "premium personality test" to every user regardless of demographic.

*(This rationale was reversed in 2026-06-09 — see the latest session log. We came back to the DMV aesthetic with surgical typography from the real CA DL, and it lands.)*

#### AI-generated brand identity

All assets generated via GPT image-1 (OpenAI) with locked brand-palette prompts. ~40 images total, batched in parallel:

- **10 brand logo marks** (`assets/images/brands/`): gold-on-dark stylized brand emblems — Toyota three-oval T, Honda slanted H, Ford oval, Chevy bowtie, Tesla swept-T, BMW quadrant roundel, Subaru six-stars, Hyundai slanted-H-in-oval, Nissan circular badge, Jeep seven-slot grille.
- **11 brand dashboard banners** (`assets/images/dashboards/`): per-brand stylized HVAC center-stack illustrations matching each brand's signature layout (Tesla = absurdly empty touchscreen; Ford F-150 = chunky truck cabin; BMW = iDrive cluster; etc).
- **27 per-model vehicle silhouettes** (`assets/images/vehicles/`): gold-on-dark side-profile silhouettes for every car in the catalog.
- **Launcher icon** (`assets/images/icon.png`): Gold seal on dark navy, matching the landing-screen seal. *(Later replaced 2026-06-09 with the carbon-fibre A/C knob.)*
- **Maroon mesh texture** (`assets/images/textures/maroon-mesh.png`): Marshall-amplifier-style perforated metal grille over maroon vinyl. Trialed inside LCD displays — pulled back to plain `#5c2a2a` background because amber digits got drowned by the busy mesh.

#### Install referrer flow (NEW)

Replaced the GitHub Pages web fallback with Play Store install-referrer routing:

- **Share URL** (`lib/config.ts` `compatShareUrl`): Now generates `https://play.google.com/store/apps/details?id=app.climatepermit.android&referrer=compat%3DPAYLOAD` instead of the github.io URL.
- **Reader** (`lib/installReferrer.ts`): On app launch, reads the Play Install Referrer via `react-native-play-install-referrer`, parses the `compat=` parameter.
- **Router** (`app/_layout.tsx`): On mount, if a referrer payload is found AND the user hasn't already taken their own quiz, routes them straight to `/compat/[payload]`.
- **"Share Your Permit"** (`app/result.tsx`): Fallback text now includes the Play Store URL instead of the github.io URL.

The web fallback at `docs/compat/index.html` is preserved but unreferenced. Reason for the switch: recipients dropped onto a "mybakingcreations.com/climate-permit/compat/..." URL (the redirect destination of gugosf114.github.io due to the MBC custom-domain CNAME) was confusing. Play Store hosts everything, no custom site to maintain.

## Session 2026-05-31 → 2026-06-03 — Defensive install-referrer + release-APK build path

Short session continuing the install-referrer work from 2026-05-30. Mostly cleanup + the realization that we'd been shipping debug builds when release builds were the right call.

### What shipped

#### Defensive install-referrer reader (`lib/installReferrer.ts`)

Moved the `require('react-native-play-install-referrer')` from top-of-file static import to a try/catch'd lazy require inside the function body. Reason: when the native module isn't linked into the installed APK (e.g. after npm-install but before native rebuild), the static import crashes the entire JS bundle at startup — splash screen never resolves. The lazy require silently resolves the referrer to `null` when the module is absent, app boots normally.

```ts
// Before — crashed app if module unlinked
import { PlayInstallReferrer } from 'react-native-play-install-referrer';

// After — boots regardless of link state
const { PlayInstallReferrer } = require('react-native-play-install-referrer');
```

Belt-and-suspenders for the inevitable "I forgot to rebuild" moment.

#### Release APK build path established

Built the first standalone release APK via `./gradlew assembleRelease`. Takes 53 minutes on this hardware (vs ~5 min for debug — release does full R8 code shrinking, full optimization, native debug symbol stripping, and APK signing). Output: `android/app/build/outputs/apk/release/app-release.apk`, 152 MB.

Standalone behavior: JS bundle is baked in, no Metro dependency at runtime, no ADB needed after install. Behaves exactly like a Play Store install.

Install requires uninstalling the previously-installed debug-signed APK first (release-signed APKs can't overwrite debug-signed installs of the same package id).

### Decisions

**Stopped iterating on debug builds for the daily-use APK.** Up through 2026-05-30 every install was a debug build, which made the app dependent on a live Metro server + active ADB tunnel just to launch. Every time wireless ADB rotated its port or USB cable disconnected, the app on the phone broke. Hours of "phone offline" diagnosis was paid for this choice. Release build is the correct deliverable for a phone that needs to actually USE the app independently — debug build is only for hot-iterating code from a laptop in the same room.

## Session 2026-06-06 — Rotary HVAC knob iterations

Picked up the standalone release APK that was built but never installed on 2026-06-03, then iterated five times on the dashboard temperature preset UI based on live feedback.

### What shipped

#### Released APK installed on phone (completes 2026-06-03 handoff task)

The release-signed `app-release.apk` from 2026-06-03 was sitting on disk uninstalled because the phone was disconnected at handoff. This session opened with `adb uninstall app.climatepermit.android && adb install ...`, completing the carry-over task. App is now fully standalone — no Metro, no ADB dependency at runtime.

#### Temperature preset UI — five iterations to land on OEM rotary dial

The original `TempStepper` in `app/dashboard.tsx` was a horizontal row of small boxed chips below each maroon LCD. Visually disconnected from the dashboard aesthetic, and the left-driver/right-passenger column split read as one ambiguous row.

Iteration history (each ended in a release APK build + install):

1. **Maroon LCD preset strip.** Extended the LCD's maroon `#5c2a2a` face with amber digits separated by thin dark grooves. Same recessed-bevel treatment as `LCDReadout` so the strip welded visually to the LCD above. Active cell got an amber triangle indicator + glow. SAME cell was a gold-trimmed slot at the start of the passenger strip. *Verdict: better than chips, but still felt like a row of buttons.*

2. **Tick-mark thermometer scale.** Replaced cells with a continuous arc of tick marks across the full 60-80°F range, 11 ticks evenly distributed, major ticks at 60/64/68/72/76/80 labeled. No horizontal scroll — all 11 values visible at once, killing the discoverability problem. Active value got a triangle dot above + brighter label. *Verdict: prettier but still flat — didn't read as a physical control.*

3. **Brass rotary knob.** Built a real touchable rotary using `PanResponder`. Knob = 124dp brass-on-dark disc, gold rim + inner ring, amber tick marks around the upper 180° arc, gold number labels at major positions, glowing amber pointer. Touch math: `angle = atan2(dx, -dy)` clamped to [-90°, +90°], mapped to one of the 11 `TEMP_STEPS` values. Drag-to-rotate AND tap-to-snap both worked from a single PanResponder. SAME became a separate pill below the passenger knob. *Verdict: George rejected — the brass/gold aesthetic felt wrong, wanted a clean OEM look.*

4. **OEM-style navy knob with cool-warm dash scale.** Pivoted on reference photo (classic 3-knob HVAC panel). Disc switched to dark navy `#0e1825` with thin dark rim. Tick marks became colored dashes around the perimeter: blue (`#5489c4`) for 60-66°F, neutral warm-white for 68-72°F, red (`#c2604f`) for 74-80°F. Numbers in plain white outside the perimeter, no glow. White pointer = a vertical stem + triangle tip. *Verdict: aesthetic right, but pointer wrong — too thin.*

5. **Chunky pointer pillar with arrowhead.** Replaced the thin white stem with a wide (18dp) dark navy raised "handle" pillar — looks like a physical knob grip rotated to the active position. Rounded top, subtle border `#26344d`, drop shadow for raised effect. Big white triangle (9×14dp) sits atop the pillar as the indicator. Matches the reference's "dark handle + white arrowhead" composition.

#### Touch interaction (unchanged across iterations 3-5)

```
handleTouch(locationX, locationY):
  dx = locationX - KNOB_RADIUS
  dy = locationY - KNOB_RADIUS
  angle = atan2(dx, -dy) * 180/π        // 0° = north, +/- clockwise
  angle = clamp(angle, -90, 90)
  idx   = round((angle + 90) / 18)      // 18° per step, 11 steps
  newValue = TEMP_STEPS[idx]
  if (newValue !== last) { Haptics.selectionAsync(); onChange(newValue) }
```

Single `PanResponder` handles both tap and drag — `onPanResponderGrant` for the initial touch position, `onPanResponderMove` for continuous drag updates. Haptic on every step crossing.

### Build cadence learning

The 2026-06-03 session log warned that cold release builds take 53 min. This session ran four release builds back-to-back with the Gradle cache warm:

- Build 2 (maroon strip): ~3 min
- Build 3 (tick scale): 2 min 41 s
- Build 4 (brass knob): 3 min 41 s
- Build 5 (OEM navy): 2 min 12 s

Warm-cache release builds are fast enough for design iteration. The 53-min figure only applies to first build per machine / after `gradle clean`.

## Session 2026-06-07 — Design tokens + ISSUED stamp + knob spring animation

Smaller session that added foundational design-token infrastructure and polish details to the dashboard quiz and result page:

- **Design-token system** introduced in `constants/tokens.ts` — central source of truth for the palette, glow helpers, and gold-bevel border presets. Compat flow unified into the gold aesthetic. (Commits: `6b720d6`, `c8076f5`)
- **Permit ISSUED stamp reveal** added to `app/result.tsx` — red "ISSUED / DEPT · OF · CLIMATE" stamp animates onto the permit card with spring physics at ~680ms after page load, rotated -14°. (Commit: `be1039d`)
- **Knob needle spring animation** added to dashboard. The pointer now animates with `withSpring` between detent positions instead of snapping instantly. (Commit: `a956934`)

The ISSUED stamp animation was kept in the 2026-06-09 redesign; the spring animation on the knob carries through to the cream-paper schematic knob.

## Session 2026-06-08 → 2026-06-09 — Pivot to California DMV document aesthetic

Two-day push that took the app from a fragmented "premium dark-gold OEM HVAC panel" aesthetic to a single cohesive **California Department of Climate Control** document-form aesthetic across every screen. Plus a launcher icon replacement and the permit card rebuilt as a California Driver License parody.

### What shipped

#### Launcher icon: gold seal → carbon-fibre A/C knob

The previous launcher (gold concentric rings + snowflake) read as generic placeholder. Replaced with a custom-rendered PIL composition:

- 1024×1024 master rendered programmatically: dark navy bg + chrome bezel knob (vertical-gradient ring) + glossy black inner disc + cool blue arc (top-left, 178°–258°) + warm red arc (top-right, 282°–2°) + green LED bar at 12 o'clock with a soft glow halo + bold white **A/C** text on a carbon-fibre squircle (22% rounded corners) backdrop. Carbon fibre is a real basketweave at 14px tile with per-row highlight offsets, plus a vignette gradient toward the corners.
- Exported to `assets/images/icon.png`, `splash-icon.png`, `android-icon-foreground.png`
- Discovered Expo only extracts the launcher into `android/app/src/main/res/mipmap-*dpi/ic_launcher*.webp` during `prebuild` — subsequent edits to `assets/images/icon.png` do **not** regenerate them. Wrote a Python pass that resizes the master icon to all 5 densities (mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi for both legacy 48dp icons and adaptive 108dp foreground), recolors a solid `#101014` background for `ic_launcher_background.webp`, and a grayscale-derivative for `ic_launcher_monochrome.webp` (Android 13+ themed icons). Otherwise the new icon never reaches the APK.

#### Vent direction PNG icons

Replaced the composite-View HVAC pictograms (which read as scribbles) with proper OEM glyphs extracted from a reference image. Six-icon strip split via column-scan + per-segment vertical trim, recolored white-on-transparent so `tintColor` can theme them. Stored at `assets/images/hvac-icons/` (face, mix, feet, defrost, recirc — the recirc icon is reused as the dashboard's Recirc button).

This is the move that required `react-native-svg` (added as a native dep — full clean rebuild needed, ~12 min first time, ~3 min thereafter).

#### PermitCard rewrite: California Driver License parody

The premium dark-gold permit card is gone. The card is now built faithfully against the real 2019/2025 California DL specimens (downloaded from Wikimedia Commons during the session):

- **Top header**: serif italic deep-navy **California** (`#0e2d63`) + monospace `USA` subscript + block-bold "CLIMATE PERMIT" + gold California grizzly silhouette top-right (SVG with the shoulder hump emphasised) + cursive italic "Golden State" tagline.
- **Field layout**: full DL numbered-prefix convention — `4d DLN`, `4b EXP`, `3 DOB`, `1 LN`, `2 FN`, `8` (address line = vehicle make/model + "SACRAMENTO, CA 95818"), `9 CLASS`, `9a END NONE`, `12 REST NONE`, `4a ISS`, `15 SEX OPR`, `18 EYES`, `16 HGT`, `19 HAIR`, `17 WGT`, `5 DD` scan code. Maps quiz answers onto DL fields: HGT = driver temp, WGT = fan, HAIR = climate mode, EYES = vent.
- **Color mix matches the real card**: navy field-number prefixes, red ID values (DLN/EXP/DOB/ISS), navy bold last-name + class, black bold first-name + address, dim grey scan codes.
- **Photo box**: vehicle silhouette in a gold-bordered portrait frame, diagonal "CLIMATE" sample watermark, repeating SSC sub-id beneath.
- **Cursive signature line** with the archetype's first-name + last-initial in serif italic, above a thin ink rule.
- **Holographic gold strip** at the bottom: `CA · DCC · [DLN]` left, italic "Issued under penalty of comfort" centre, `REV·04` right.
- **Watermarks**: faint repeating `STATE OF CALIFORNIA` bands (6% opacity), big diagonal text behind the card, large faint bear silhouette dead-centre, repeating DLN sub-id stamps along the left edge (vertical 90° rotation) and bottom edge.

Explanation text (the archetype description) bumped 50% — `fontSize: s(8)` → `s(12)`.

#### App-wide DMV paper aesthetic — every screen

The framing screens (landing, car-select, result wrapper, dashboard) were all converted from dark-navy + amber-glow + chrome bevels to the unified document aesthetic.

Shared visual language across every screen:
- Cream `#f5efde` paper backdrop
- Subtle horizontal gold security-grid lines (4% opacity)
- Repeating `STATE OF CALIFORNIA` navy watermark bands (5–6% opacity)
- Large faint bear silhouette behind content
- Top `California [USA] / CLIMATE PERMIT [bear]` header band
- Section number prefix in navy mono (e.g. `SECTION 2 · OPERATING SAMPLE`)
- Red-bordered section-number box matching the permit's `1`/`2`/`✓` motif
- Short red rule under section titles
- Black sans-serif headlines, navy + red + black field-value mix matching the DL

**`app/index.tsx` (Landing → Form Cover)**
- `FORM 21-B · REV 04` microtype top
- "APPLICATION FOR / Climate Operator Permit" mixed-weight headline
- Red rule + dotted navy hairline + "DEPT · OF · CLIMATE · CONTROL" microtext
- "SECTION 1 · ASSESSMENT NOTICE" red-left-bar callout box
- DL-style strip on the cover: `3 DOB: THE PRESENT (red)` · `4b EXP: 12/31/2099 (red)` · `12 REST: NONE (black bold)`
- Navy filled "BEGIN APPLICATION" CTA, sharp corners, letter-spaced white caps
- "AUTHORIZED" rule + parody disclaimer footer

**`app/car-select.tsx` (Form Section 1)**
- `SECTION 1.A · VEHICLE / MAKE` heading
- "Please indicate the make of the vehicle to be operated."
- Cream paper rows with gold-bordered brand-logo boxes, bold black sans for make name, "REGISTERED MAKE" navy mono subtitle, navy `›` chevron
- Section title flips to `SECTION 1.B · {MAKE} · MODEL` after selection, "‹ RETURN TO SECTION 1.A" back link

**`app/result.tsx` (Result Wrapper)**
- `PERMIT ISSUED · SEE BELOW` red mono header
- Archetype name in big black sans + italic dark grey oneLineBurn
- Red checkmark `✓` in a red-bordered section-number box
- PermitCard rendered inside `ViewShot` for capture-to-share
- "ISSUED" red animated stamp slams onto the card (kept from 06-07)
- Below the card: numbered field boxes `9 · QUADRANT · BIAS PROFILE` and `18 · COMPATIBLE OPERATORS`, mirroring the card's own field numbering
- Navy filled "Share Your Permit", red filled "View Compatibility" or navy-outlined "Test Your Partner"
- Banner ad bar tinted to paperDeep instead of dark navy

**`app/dashboard.tsx` (Form Section 2 · Operating Sample)**
- Header band identical to other screens
- `SECTION 2 · OPERATING SAMPLE` + vehicle make/model as section title + red `2` box + red rule
- "‹ RETURN TO SECTION 1" back link replaces the old gold "CHANGE VEHICLE" button
- Vehicle dashboard photo banner kept as the "operating sample" — equivalent to the DL photo

#### Cohesion pass — second iteration on the dashboard quiz

After walking the whole flow with screenshots and finding the dashboard mid-section still had visual leftovers from the old aesthetic, did a targeted fix pass:

- **Maroon DRIVER / PASSENGER LCDs** — killed the `#5c2a2a` background. Now cream paper boxes with `16 HGT` field-number prefix matching CA DL convention, value rendered in bold red sans. No more car-stereo screens on a paper form.
- **DashButton inactive state** — borderWidth 1.2 → 2px navy, background `rgba(14,45,99,0.045)` faint navy tint, borderRadius 2 → 3. The empty-button shape is now always readable instead of looking like loose floating icons + checkboxes.
- **HUD overlay on brand-banner dashboard photo** — flipped from `rgba(20,20,16,0.85)` dark backgrounds to `rgba(245,239,222,0.94)` translucent paper. Field labels gained `16 HGT` style numbered prefixes. Temp value swapped to bold red. A/C / AUTO / RCRC dots and the 7-bar fan indicator now render as small navy-outlined squares that fill red when on (was navy-glow gradient). Tap hint chip swapped to paper.
- **Knob disc + CircleButton drop shadows** stripped. Paper has ink, not shadows. Borders bumped 1.5 → 2px to keep the disc edge crisp without depth.
- **STATE OF CALIFORNIA watermark density** dropped across all four screens. Landing 0.10 → 0.055, car-select 0.09 → 0.05, PermitCard 0.10 → 0.06. Reads as subtle security paper now, not busy form.
- **Bear silhouette** rewrote across all four files (PermitCard, landing, car-select, result). New SVG path has the shoulder hump emphasised, snout extending left with the ear pair on top, drooping head, rounded body — actually reads as a California grizzly instead of the previous chubby blob. ViewBox 100×62 → 100×55 for a flatter walking stance.

---

# Failure Log

Running log of dead ends, wrong turns, and decisions that cost time. Kept so future sessions don't repeat the same mistakes.

## 2026-05-30 — Debug builds for end-user testing

**Failure:** Shipped debug builds to George's phone for ALL daily-use testing through 2026-05-30. Debug builds don't bundle the JS — the phone fetches it from Metro on the laptop at runtime via an ADB reverse-port tunnel. Every wireless-ADB port rotation, every USB unplug, every Metro restart broke the app on the phone. Multiple hours spent diagnosing "splash screen stuck" / "couldn't connect to development server" symptoms before recognizing the root cause was the choice of build variant.

**Fix:** `./gradlew assembleRelease` produces a standalone APK with the JS bundle baked in. No Metro dependency at runtime, no ADB needed after install. Should have been the default deliverable for end-user testing from the start.

**Lesson:** Debug builds are for the developer's own laptop, where Metro is live and ADB is wired. For a phone that needs to LIVE WITH the app between sessions, ship a release build. The 53-min build cost is paid once; the recurring ADB-reconnect tax is paid forever.

## 2026-05-30 — Maroon mesh inside LCD displays

**Failure:** Tried to render the WiM-style maroon vinyl + Marshall-grille perforated-metal pattern inside the driver/passenger temp LCD readouts. Generated a beautiful texture tile via GPT image-1, layered it under the amber digits with Windows-92 chunky bevels around the chassis. Looked dramatic.

When George took a screenshot: the amber digits were completely lost in the busy grille texture. Contrast was inadequate. The "DRIVER" label and "70°F" digits became invisible against the perforated maroon.

**Fix:** Reverted to solid `#5c2a2a` maroon background. Kept the amber digits + thin border. Mesh texture preserved at `assets/images/textures/maroon-mesh.png` as reference but unused. *(The maroon background itself was later killed in 2026-06-09 when LCDs were reskinned to cream paper.)*

**Lesson:** When stacking a texture-heavy background under foreground content, eyeball the contrast on a phone screen at actual size — not on a 1024px design preview.

## 2026-05-30 — `truck-pickup` icon name

**Failure:** Typed `'truck-pickup'` as the MaterialCommunityIcons name for trucks. TypeScript caught it immediately: `Type '"truck-pickup"' is not assignable to type ...`. The valid icon is just `'truck'`.

**Lesson:** Mostly avoidable by checking MaterialCommunityIcons docs before guessing. Cheap to fix because TS catches icon-name typos for `@expo/vector-icons` — they're strictly typed as a union.

## 2026-05-30 — Two failed APK build attempts before `JAVA_HOME`

**Failure:** First `npx expo run:android` failed with `ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH`. Second attempt failed the same way before setting `JAVA_HOME` to `C:\Program Files\Android\Android Studio\jbr`.

**Fix:** Always set `JAVA_HOME` + `ANDROID_HOME` + add Android SDK platform-tools to `PATH` before any gradle command. Documented in the Dev section above.

## 2026-05-29 → ongoing — Wireless ADB port rotation

**Failure mode:** Android's wireless ADB rotates its listening port every time the phone reconnects, sleeps, or the user toggles Wireless Debugging in Settings. Each session began with "phone offline" + needing to grep `adb devices` for the new port, then re-running `adb -s NEW:PORT reverse tcp:8081 tcp:8081` + `adb -s NEW:PORT shell am force-stop ...` to rebridge and relaunch.

**Mitigation:** Wrote a small `PHONE=$(adb devices | awk '/device$/ {print $1; exit}')` one-liner to auto-detect the current device. Also `adb mdns services 2>&1 | grep adb-tls-connect` finds the current port.

**Real fix:** The release-APK route makes this irrelevant — once a release APK is installed, ADB is no longer needed for the app to run. Wireless ADB rotation only matters when iterating code from a laptop.

## 2026-05-30 — Wrong assumption about share link URL appearance

**Failure:** Shipped the "Test Your Partner" share link as `https://gugosf114.github.io/climate-permit/compat/?c=PAYLOAD`. Tested by curl — page loads, content renders correctly. THEN tested by following the redirect chain: GitHub Pages has a CNAME pointing `gugosf114.github.io` to `mybakingcreations.com`, so the visible URL in recipient text messages becomes `https://mybakingcreations.com/climate-permit/compat/?c=PAYLOAD`. A baking-website URL showing up in a partner-quiz share text is confusing.

**Fix:** Switched delivery mechanism entirely. Share URL now points to Play Store with the payload as an install-referrer parameter. Google hosts everything, no custom site to maintain, no domain quirks.

**Lesson:** Test the URL the recipient actually sees, not just the URL you typed in code. The HTTP 301 redirect made the visible URL different from the source URL.

## 2026-05-29 — `jq` not installed in Git Bash

**Failure:** First batch-generation script for the 11 brand dashboard images used `jq` to construct the JSON request bodies. `jq: command not found` in Git Bash on Windows.

**Fix:** Rewrote the script in Python using `json.dumps` and `urllib.request`. Used `concurrent.futures.ThreadPoolExecutor` for parallelism.

**Lesson:** Don't assume `jq` exists on Windows machines. Default to Python for JSON construction.

## 2026-05-29 → 2026-05-30 — Auto-navigation via `adb shell input tap`

**Failure:** Tried to auto-navigate from landing → car-select → model selection → dashboard via `adb shell input tap X Y`. Tap coordinates kept missing — bounced the app to home screen, opened settings, or tapped wrong list items.

**Fix:** Asked George to navigate to the target screen himself, then screenshot.

**Lesson:** Don't try to automate navigation flows via raw `input tap` against a real device. Either use UI automation (Espresso, etc) or just have the human do the navigation. *(2026-06-09 reversed this for one specific session — when George explicitly asked for a programmatic walkthrough, the taps mostly worked because the targets were known per-screen.)*

## 2026-06-06 — Samsung Fold `screencap -p` stdout pollution

**Failure:** Tried to grab a phone screenshot via `adb exec-out screencap -p > out.png`. Output file had a `.png` extension but failed image-magic detection — flagged as plain `data`. PIL refused to open it. The PNG bytes were correct — they were just prefixed by a `[Warning] Multiple display detected...` string written to stdout by Samsung's `screencap` implementation on foldable devices.

**Fix:** Find the PNG magic header (`\x89PNG`) in the captured bytes and strip everything before it.

```python
data = open('out.png', 'rb').read()
i = data.find(b'\x89PNG')
open('clean.png', 'wb').write(data[i:])
```

In the session the warning was 347 bytes long.

**Lesson:** Any device with a non-trivial display topology (Fold, Flip, multi-screen tablet) may inject stderr-flavored text into `screencap -p` stdout. Always validate the PNG magic before treating the output as an image. The standard `2>/dev/null` redirect does NOT catch this — the warning isn't on stderr; it's on stdout.

## 2026-06-06 — "I'm looking at it, nothing's changed" (looking at the wrong thing)

**Failure:** Rebuilt + reinstalled the dashboard UI with new TempStepper, told George to verify. He came back with "nothing's changed, did you actually install it?" Spent two tool calls verifying the bundle was fresh, the APK lastUpdateTime was within seconds, and the new color literals were in the bundled JS. All checked out. Took a fresh screenshot of his phone — turns out he was looking at the Claude Code chat with the OLD screenshot of the app pinned as a message attachment thumbnail above the input box. He had not actually switched apps to Climate Permit.

**Fix:** Take a screenshot of the phone before claiming installation success. The screenshot proves what's *visible*, not just what's *installed*.

**Lesson:** "I'm looking at it" is ambiguous when the user is on a phone juggling Claude Code + the target app. When in doubt, the installer's success is verified by the device's current foreground screen, not by anything the user reports.

## 2026-06-09 — Expo launcher icon caching across mipmap densities

**Failure:** Replaced `assets/images/icon.png` with the carbon-fibre A/C knob design. Rebuilt + reinstalled the APK three times. The app drawer still showed the old icon every time. Verified the APK was fresh, the JS bundle was new, the icon file on disk was the new one.

**Root cause:** Expo extracts `assets/images/icon.png` into `android/app/src/main/res/mipmap-*dpi/ic_launcher*.webp` only during `prebuild`. Once those webp files exist, gradle bundles them directly — `icon.png` is irrelevant for subsequent builds.

**Fix:** Wrote a Python script that takes the master `icon.png`, resizes to all 5 densities for both the 48dp legacy icon and the 108dp adaptive foreground, writes a solid background webp at each density, and writes a grayscale-derived monochrome webp at each density. Wholesale replacement, then rebuild.

**Lesson:** `assets/images/icon.png` is the *source* for the initial prebuild, not the build-time input. After prebuild, the mipmap webp files in `android/app/src/main/res/` are what gets packaged. Either run `npx expo prebuild --clean` (which may revert other native tweaks) or manually overwrite the mipmap files.

## 2026-06-09 — Wikimedia blocks curl downloads of bear silhouette

**Failure:** Tried to download a California grizzly bear silhouette PNG from Wikimedia Commons (`upload.wikimedia.org/wikipedia/commons/.../California_Republic_flag.svg/512px-...png`) using `curl -sL -A "Mozilla/5.0"`. Returned an HTML error page instead of the image. Several variants of user-agent and thumbnail-size URL all returned the same 2KB error page.

**Fix:** Wrote a hand-crafted SVG `<Path>` of the bear silhouette directly. Not photographic-quality, but adequate for the small (32-50dp) icon placements.

**Lesson:** Wikimedia hotlink protection is aggressive. For programmatic image asset sourcing, download via a browser (which sends the right Referer + Accept headers) and serve from local. Or use a different CDN-friendly source.

---

# What's Left to Ship — Next Session Handoff

**Read this first if you're picking up this project cold.**

The app is currently visually code-complete. Every screen reads as one unified California DMV document — cream paper, navy italic "California" headline, gold bear seal, repeating watermarks, and field-numbered DL-style typography. The permit card is a faithful California Driver License parody. The launcher icon is a custom carbon-fibre A/C knob squircle.

What still has to happen before Play Store submission:

## Ship blockers (must do)

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

## iOS (deferred)

Not configured. Whole flow has only been built and tested on Android. Treat iOS as a future project, not a v1 blocker.

## Smaller polish on the list

- HUD overlay text labels on the brand-banner dashboard photo are very small at the size they sit. Could bump +1px.
- The bear silhouette is a hand-coded SVG path and decent but not perfect. A traced PNG from the official state flag (Wikimedia blocks curl — manual download via browser, then convert to white-on-transparent) would be cleaner.
- Temp-knob dashes are thin on cream. Could bump to 2px from 1.5px.
- Consider stripping or de-emphasising the "10 SETTINGS REMAINING" footer band on the dashboard quiz — it reads as old chrome.

## What NOT to revisit

- The dashboard quiz framing IS the operating sample (the equivalent of the DL photo). Keep the HVAC panel illustrated as an object inside the form. Do not convert it back into a "photo of the real dashboard."
- The permit card's CA DL field layout is meticulously matched to the real 2019/2025 specimen. Do not "simplify" the numbered field prefixes (`4d DLN`, `3 DOB`, `9 CLASS`, etc.) — they're the visual signature.
- The launcher icon is final. Do not regenerate the gold seal version.

## Build + install reminders

- Native rebuild is only needed if a new native module is added. `react-native-svg` is already linked.
- Standard release build: `cd android && ./gradlew assembleRelease` — 2-3 min on warm cache, 10-12 min cold.
- Install: `adb -s <device> install -r android/app/build/outputs/apk/release/app-release.apk` (use `install` without `-r` after `uninstall` for a clean install; required when the launcher icon changes because Android caches icons aggressively).
- Phone wireless ADB rotates ports on reconnect — discover with `adb mdns services` then `adb connect <ip:port>`. Or use the more stable `192.168.1.234:5555` non-TLS port if it's enabled.
