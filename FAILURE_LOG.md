# Failure Log

Running log of dead ends, wrong turns, and decisions that cost time. Kept so future sessions don't repeat the same mistakes.

## 2026-05-30 — Debug builds for end-user testing

**Failure:** Shipped debug builds to George's phone for ALL daily-use testing through 2026-05-30. Debug builds don't bundle the JS — the phone fetches it from Metro on the laptop at runtime via an ADB reverse-port tunnel. Every wireless-ADB port rotation, every USB unplug, every Metro restart broke the app on the phone. Multiple hours spent diagnosing "splash screen stuck" / "couldn't connect to development server" symptoms before recognizing the root cause was the choice of build variant.

**Fix:** `./gradlew assembleRelease` produces a standalone APK with the JS bundle baked in. No Metro dependency at runtime, no ADB needed after install. Should have been the default deliverable for end-user testing from the start.

**Lesson:** Debug builds are for the developer's own laptop, where Metro is live and ADB is wired. For a phone that needs to LIVE WITH the app between sessions, ship a release build. The 53-min build cost is paid once; the recurring ADB-reconnect tax is paid forever.

---

## 2026-05-30 — Maroon mesh inside LCD displays

**Failure:** Tried to render the WiM-style maroon vinyl + Marshall-grille perforated-metal pattern inside the driver/passenger temp LCD readouts. Generated a beautiful texture tile via GPT image-1, layered it under the amber digits with Windows-92 chunky bevels around the chassis. Looked dramatic.

When George took a screenshot: the amber digits were completely lost in the busy grille texture. Contrast was inadequate. The "DRIVER" label and "70°F" digits became invisible against the perforated maroon. The Win92 bevels survived because they're high-contrast borders, but the actual readable content disappeared.

**Fix:** Reverted to solid `#5c2a2a` maroon background. Kept the amber digits + thin border from the original design. Mesh texture file preserved at `assets/images/textures/maroon-mesh.png` as reference but unused.

**Lesson:** When stacking a texture-heavy background under foreground content, eyeball the contrast on a phone screen at actual size — not on a 1024px design preview. The 32%-black dot grid that looked elegant in isolation became visual noise that swallowed everything in front of it.

---

## 2026-05-30 — `truck-pickup` icon name

**Failure:** Typed `'truck-pickup'` as the MaterialCommunityIcons name for trucks in `STYLE_ICON` map. TypeScript caught it immediately: `Type '"truck-pickup"' is not assignable to type ...`. The valid icon is just `'truck'`.

**Lesson:** Mostly avoidable by checking MaterialCommunityIcons docs before guessing. Cheap to fix because TS catches icon-name typos for `@expo/vector-icons` — they're strictly typed as a union. Good news: the same TS pass confirmed all my other ~15 icon names DID exist, so just one fix.

---

## 2026-05-30 — Two failed APK build attempts before `JAVA_HOME`

**Failure:** First `npx expo run:android` failed with `ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH`. Second attempt failed the same way before I set `JAVA_HOME` to `C:\Program Files\Android\Android Studio\jbr`.

**Fix:** Always set `JAVA_HOME` + `ANDROID_HOME` + add Android SDK platform-tools to `PATH` before any gradle command. Documented in `README.md` under Dev section.

---

## 2026-05-29 → ongoing — Wireless ADB port rotation

**Failure mode:** Android's wireless ADB rotates its listening port every time the phone reconnects, sleeps, or the user toggles Wireless Debugging in Settings. Each session began with "phone offline" + needing to grep `adb devices` for the new port, then re-running `adb -s NEW:PORT reverse tcp:8081 tcp:8081` + `adb -s NEW:PORT shell am force-stop ...` to rebridge and relaunch.

**Mitigation:** Wrote a small `PHONE=$(adb devices | awk '/device$/ {print $1; exit}')` one-liner to auto-detect the current device. Doesn't solve the rotation, just survives it.

**Real fix:** The release-APK route (above) makes this irrelevant — once a release APK is installed, ADB is no longer needed for the app to run. Wireless ADB rotation only matters when iterating code from a laptop.

---

## 2026-05-30 — Wrong assumption about share link URL appearance

**Failure:** Shipped the "Test Your Partner" share link as `https://gugosf114.github.io/climate-permit/compat/?c=PAYLOAD`. Tested by curl — page loads, content renders correctly. THEN tested by following the redirect chain: GitHub Pages has a CNAME pointing `gugosf114.github.io` to `mybakingcreations.com`, so the visible URL in recipient text messages becomes `https://mybakingcreations.com/climate-permit/compat/?c=PAYLOAD`. A baking-website URL showing up in a partner-quiz share text is confusing.

**Fix:** Switched delivery mechanism entirely. Share URL now points to Play Store with the payload as an install-referrer parameter. Google hosts everything, no custom site to maintain, no domain quirks.

**Lesson:** Test the URL the recipient actually sees, not just the URL you typed in code. The HTTP 301 redirect made the visible URL different from the source URL.

---

## 2026-05-29 — `jq` not installed in Git Bash

**Failure:** First batch-generation script for the 11 brand dashboard images used `jq` to construct the JSON request bodies. `jq: command not found` in Git Bash on Windows. All 11 generations failed before sending anything.

**Fix:** Rewrote the script in Python (always available, no extra dep) using `json.dumps` to build request bodies and `urllib.request` to call the OpenAI API. Used `concurrent.futures.ThreadPoolExecutor` for parallelism.

**Lesson:** Don't assume `jq` exists on Windows machines. Default to Python for JSON construction.

---

## 2026-05-29 → 2026-05-30 — Auto-navigation to dashboard via `adb shell input tap`

**Failure:** Tried to auto-navigate from landing → car-select → model selection → dashboard via `adb shell input tap X Y` commands so I could screenshot the dashboard state from script. Tap coordinates kept missing — bounced the app to home screen, opened settings, or tapped wrong list items. Screen size and dynamic content made coordinates unreliable.

**Fix:** Asked George to navigate to the target screen himself, then I screenshot. The interactive navigation is cheaper for him than coordinate-guessing is for me.

**Lesson:** Don't try to automate navigation flows via raw `input tap` against a real device. Either use UI automation (Espresso, etc) or just have the human do the navigation.
