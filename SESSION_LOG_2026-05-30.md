# Session Log — 2026-05-30

Major work day. Started with a working but visually flat first-cut app from 2026-05-14; ended with a full premium dark-gold rebrand, AI-generated brand identity, and the install-referrer flow plumbed end to end.

## What shipped

### Visual rebrand: parody-DMV → premium dark-gold

Stripped the original "United States Department of Climate Control" cream/green/amber parody-government aesthetic and replaced with a premium dark-navy + warm-gold treatment across every screen:

- **Landing** (`app/index.tsx`): Deep navy `#0a0e14` bg, big glowing gold "CLIMATE PERMIT" wordmark with text-shadow halo, pulsing gold seal (3 concentric rings + snowflake center), premium embossed gold CTA "ISSUE MY PERMIT," staggered fade-in entrance animations.
- **Car select** (`app/car-select.tsx`): Dark mode, embossed 3D pill tiles for each make + model with light top/left + dark bottom/right bevels, alternating subtle row tints.
- **Dashboard** (`app/dashboard.tsx`): Full palette swap (kept the existing OEM-HVAC-panel structure, swapped greens for golds, creams for warm whites).
- **Result + permit card** (`app/result.tsx`, `components/PermitCard.tsx`): Dark premium card with gold border, gold classification bar with glow, embossed share buttons, staggered entrance animations.
- **App config** (`app.json` + `app/_layout.tsx`): `userInterfaceStyle: dark`, splash bg `#0a0e14`, adaptive-icon bg `#0a0e14`, StatusBar style `light`, contentStyle bg `#0a0e14`.

Rationale: Original parody-DMV aesthetic depended on users having a visceral "I've waited at the DMV" emotional memory. Most modern users don't — government services are increasingly digital. Cream paper read as "muted weird" rather than "haha bureaucracy." Dark-gold reads as "premium personality test" to every user regardless of demographic.

### AI-generated brand identity

All assets generated via GPT image-1 (OpenAI) with locked brand-palette prompts. ~40 images total, batched in parallel:

- **10 brand logo marks** (`assets/images/brands/`): gold-on-dark stylized brand emblems — Toyota three-oval T, Honda slanted H, Ford oval, Chevy bowtie, Tesla swept-T, BMW quadrant roundel, Subaru six-stars, Hyundai slanted-H-in-oval, Nissan circular badge, Jeep seven-slot grille.
- **11 brand dashboard banners** (`assets/images/dashboards/`): per-brand stylized HVAC center-stack illustrations matching each brand's signature layout (Tesla = absurdly empty touchscreen; Ford F-150 = chunky truck cabin; BMW = iDrive cluster; etc).
- **27 per-model vehicle silhouettes** (`assets/images/vehicles/`): gold-on-dark side-profile silhouettes for every car in the catalog (Toyota RAV4/Camry/Corolla/Tacoma; Honda Civic/CR-V/Accord/Pilot; Ford F-150/Explorer/Bronco; Chevy Silverado/Equinox/Tahoe; Tesla Model 3/Model Y; BMW 3-Series/X3; Subaru Outback/Forester; Hyundai Tucson/Elantra; Nissan Rogue/Altima; Jeep Wrangler/Grand Cherokee; Generic).
- **Launcher icon** (`assets/images/icon.png`): Gold seal on dark navy, matching the landing-screen seal. Replaced the Expo scaffold default (blue stylized "A" with construction-line crosshair). Baked into APK via native rebuild.
- **Maroon mesh texture** (`assets/images/textures/maroon-mesh.png`): Marshall-amplifier-style perforated metal grille over maroon vinyl. Trialed inside LCD displays — pulled back to plain `#5c2a2a` background because amber digits got drowned by the busy mesh.

### Brand banners + per-model vehicle integration

- **Dashboard banner** (`app/dashboard.tsx` `BrandBanner` component): User's selected make+model loads its specific brand dashboard illustration at the top of the quiz screen, framed in a gold polaroid border. Includes an animated amber HUD overlay (driver temp readout, A/C · AUTO · RCRC indicator dots, 7-cell fan-speed bar). Tap image cycles driver temp +2°F, long-press −2°F.
- **Permit card vehicle badge** (`components/PermitCard.tsx`): Replaced the generic 🚗 emoji with the specific per-model silhouette via `lib/vehicleImages.ts`. Tesla Model Y permit shows a Model Y crossover; Ford F-150 permit shows an F-150 truck.

### Install referrer flow (NEW)

Replaced the GitHub Pages web fallback with Play Store install-referrer routing:

- **Share URL** (`lib/config.ts` `compatShareUrl`): Now generates `https://play.google.com/store/apps/details?id=app.climatepermit.android&referrer=compat%3DPAYLOAD` instead of the github.io URL.
- **Reader** (`lib/installReferrer.ts`): On app launch, reads the Play Install Referrer via `react-native-play-install-referrer`, parses the `compat=` parameter.
- **Router** (`app/_layout.tsx`): On mount, if a referrer payload is found AND the user hasn't already taken their own quiz, routes them straight to `/compat/[payload]`.
- **"Share Your Permit"** (`app/result.tsx`): Fallback text now includes the Play Store URL instead of the github.io URL.

The web fallback at `docs/compat/index.html` is preserved but unreferenced. Reason for the switch: per-conversation decision that recipients dropped onto a "mybakingcreations.com/climate-permit/compat/..." URL (the redirect destination of gugosf114.github.io due to the MBC custom-domain CNAME) was confusing. Play Store hosts everything, no custom site to maintain.

### Smaller polish

- "Change Vehicle" back button now a proper chunky bezel button with chevron icon and bright-gold text (was tiny opacity-55 text).
- `ISSUE_DATE` in PermitCard fixed from module-load to render-time computation (so the date stays accurate if the app is left open).
- Parody disclaimer ("Not affiliated with any government agency") on landing — defuses Play Store review risk.
- Landing subtitle explains the satire premise so the joke lands before tapping the CTA.

## Decisions and reversals

- **Maroon mesh inside LCD displays** — implemented, tested live, reverted. Amber digits had no readable contrast against the busy perforated-grille texture. Kept only the maroon background color, dropped the mesh + Win92 chunky bevels.
- **Web fallback → install referrer** — switched delivery mechanism for the "Test Your Partner" payload. Trade-off: recipient with the app already installed won't be auto-routed to compat (Play Store referrer only fires on actual install). For already-installed users, future work could add Android App Links.

## Ship blockers (still pending)

1. Real AdMob `androidAppId` — `app.json` still has Google's test ID `ca-app-pub-3940256099942544~3347511713`. Register the app on platform.admob.com, get the real ID, swap it.
2. Real-device verification of the install-referrer round-trip — can only be tested after the app is published to Play Store (the referrer mechanism requires a real Play Store install, not sideloaded APK).
3. Play Console listing — screenshots, feature graphic (1024×500), short description (80 chars), long description (4000 chars), content-rating questionnaire, target audience.
4. iOS — still not configured. Android-first.
5. `react-native-play-install-referrer` requires a fresh native rebuild for the read-side to actually function on the device. Code is in; rebuild was not run this session.

## Files touched

```
app/_layout.tsx                                   modified (install referrer reader)
app/index.tsx                                     rewritten (dark/gold landing)
app/car-select.tsx                                rewritten (dark/gold + real logos)
app/dashboard.tsx                                 modified (palette swap, BrandBanner, maroon LCD)
app/result.tsx                                    rewritten (dark/gold result)
app.json                                          modified (dark UI, dark splash + icon bg)
components/PermitCard.tsx                         rewritten (dark/gold permit + vehicle silhouette)
lib/config.ts                                     rewritten (Play Store referrer URL)
lib/installReferrer.ts                            NEW (Play Install Referrer reader)
lib/dashboardImages.ts                            NEW (make → brand dashboard image)
lib/brandLogos.ts                                 NEW (make → brand logo image)
lib/vehicleImages.ts                              NEW (make+model → vehicle silhouette)
assets/images/icon.png                            replaced (gold seal launcher icon)
assets/images/android-icon-foreground.png         replaced
assets/images/splash-icon.png                     replaced
assets/images/brands/*.png                        NEW (10 brand marks)
assets/images/dashboards/*.png                    NEW (11 brand dashboards)
assets/images/vehicles/*.png                      NEW (27 vehicle silhouettes)
assets/images/textures/maroon-mesh.png            NEW (trial texture, unused)
package.json + package-lock.json                  modified (react-native-play-install-referrer)
README.md                                         rewritten (real project documentation)
SESSION_LOG_2026-05-30.md                         NEW (this file)
```
