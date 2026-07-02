# Play Store launch kit — Climate Permit

Everything needed for the listing, in order. Code side is done; the
account steps are George's.

## George's checklist (in order)

1. **Play Console** (play.google.com/console) — if the account is NEW
   (post-Nov 2023, personal): Google requires a closed test with 20
   testers for 14 days before production. Older accounts go straight to
   production.
2. **AdMob** (admob.google.com):
   - Add app → Android → "Climate Permit" (link it to the Play listing
     once it exists).
   - Copy the **App ID** (`ca-app-pub-XXXX~YYYY`) → paste into `app.json`
     under the `react-native-google-mobile-ads` plugin block (currently
     Google's sample ID — the app will crash on launch with a real
     build if this stays wrong).
   - Create 2 ad units: **Anchored adaptive banner** and **Interstitial**
     → paste both IDs into `eas.json` → `build.production.env`
     (they're `REPLACE_WITH_...` placeholders now; the app ships with
     ads silently DISABLED if left unset — it will never serve test ads
     in production).
   - AdMob → Privacy & messaging → create a **GDPR message** for the app
     (the in-app consent popup is already wired; it needs this configured
     server-side to have something to show).
   - Add `app-ads.txt` to the site root once AdMob gives you the line.
3. **Build**: `npx eas build --platform android --profile production`
   (EAS manages the upload keystore automatically). Download the `.aab`.
4. **Play Console → create app**: free, with ads = yes.
   - Privacy policy URL: `https://gugosf114.github.io/climate-permit/privacy.html`
   - App category: Entertainment. Tags: quiz, humor.
5. **Data safety form** (declarations for the AdMob SDK — the app itself
   collects nothing, has no accounts, no network calls of its own):
   - Collects: **Device or other IDs** (advertising ID) — shared with
     Google for **Advertising**; ephemeral: no; optional: no.
   - Data encrypted in transit: yes. Deletion request mechanism: n/a.
   - App activity → Ad interactions: collected by the ads SDK.
6. **Content rating questionnaire**: no violence/sex/drugs/gambling/UGC →
   lands at **Everyone / PEGI 3**. It's parody; there's a disclaimer
   in-app.
7. **Ads declaration**: yes, contains ads (banner + interstitial).
8. Upload the `.aab`, add listing text + screenshots below, submit.

## Listing copy

**Title (30 chars max):** `Climate Permit — HVAC Quiz`

**Short description (80 chars max):**
`Get your official car A/C operator permit. 16 archetypes. Test your passenger.`

**Full description:**

Every car has two climates: the one on the dashboard and the one between
the people arguing about it.

CLIMATE PERMIT examines how you actually operate your car's HVAC — driver
temp, fan speed, vents, recirc, the pre-cool ritual — and issues your
official Operator Permit: one of sixteen classifications, from SUBARCTIC
TYRANT to TRUST-FALL DIPLOMAT.

★ A real DMV-style examination (Form 21-B, Rev 04)
★ Sixteen operator archetypes across the Self/Other × Controller/Chill grid
★ A shareable permit card — gold seal, restrictions, scannable code
★ COUPLE COMPATIBILITY: send your permit link, make your partner take the
  exam, receive your official compatibility index
★ Day Window and Night Service themes
★ No account. No tracking of your own. Just ads keeping the lights on.

This is a parody. It is not a government document. Your marriage is not
legally binding on the basis of a 41% compatibility index.

**Screenshots needed (min 2, 1080×2520 works):** landing (light), landing
(night mode), car select, dashboard quiz, permit result, compat result.
Capture over adb: `adb exec-out screencap -p > shot.png` (use `-d 0` if
the multiple-display warning appears).

**Feature graphic (1024×500):** permit-card art on paper background —
can be generated from PermitCard proportions; TODO when listing is created.
