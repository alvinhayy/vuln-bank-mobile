# 🛡️ Talsec freeRASP integration

This fork adds [Talsec **freeRASP**](https://docs.talsec.app/freerasp/freerasp/introduction)
(Runtime Application Self-Protection) to the Vulnerable Bank mobile app.

The base app is intentionally insecure. freeRASP is a *defensive* layer bolted on
top so you can **watch a RASP react in real time** to the very attack techniques
this app exists to practice: rooted/jailbroken devices, emulators, debuggers,
hooking frameworks (Frida/Xposed), repackaged/resigned builds, and more.

> Package: [`freerasp-react-native@6.0.0`](https://github.com/talsec/Free-RASP-ReactNative)
> · React Native 0.79 (bare), TypeScript.

---

## What was added

| File | Purpose |
| --- | --- |
| `src/security/freeRaspConfig.ts` | The `TalsecConfig` for this app (package/bundle ids, cert hash + Team ID placeholders, `watcherMail`, `isProd`, `killOnBypass`). |
| `src/security/SecurityContext.tsx` | `SecurityProvider` that starts freeRASP via the `useFreeRasp` hook, registers **every** threat callback, and exposes live detections through `useSecurity()`. |
| `src/security/ThreatBanner.tsx` | A dismissible on-screen banner that lists detected threats (educational aid). |
| `App.tsx` | Wrapped the tree in `<SecurityProvider>` and rendered `<ThreatBanner />`. |
| `__mocks__/freerasp-react-native.js` | Jest mock of the native SDK so the test suite runs. |
| `jest.setup.js`, `jest.config.js` | Register mocks (freeRASP, AsyncStorage, vector-icons) so `npm test` passes. |
| `__tests__/security.test.tsx` | Smoke tests for the config shape and the provider contract. |

`package.json` gained the `freerasp-react-native` dependency.

---

## ⚙️ Configure before a real release

Open `src/security/freeRaspConfig.ts` and replace the placeholders:

| Field | What to put |
| --- | --- |
| `androidConfig.certificateHashes` | Base64 **SHA-256** of your **release** signing certificate. |
| `iosConfig.appTeamId` | Your Apple Developer **Team ID**. |
| `watcherMail` | An email you control — receives Talsec security reports. |

Already filled for this project:

- `androidConfig.packageName` → `com.vulnerablebankapp` (from `android/app/build.gradle`).
- `iosConfig.appBundleIds` → `org.reactjs.native.example.VulnerableBankApp` (default RN bundle id).

### Getting the Android signing hash

```bash
keytool -list -v -keystore <your-release.keystore> -alias <alias>
# copy the SHA256 line (hex) and convert it to base64 — see:
# https://docs.talsec.app/freerasp/freerasp/wiki/getting-signing-certificate-hash
```

> The **debug** keystore hash will not match, so `appIntegrity` is **expected to
> fire in development builds**. `isProd` is wired to `!__DEV__`, so dev builds run
> in freeRASP "Dev" mode (relaxed + verbose logs).

---

## 🔧 Build & run

**No `expo prebuild` and no manual Gradle edits are required.** The native
`android/` and `ios/` projects already exist, and `freerasp-react-native` wires
its own Maven repositories, the `app.talsec.plugin` Gradle plugin, and
dependencies through React Native **autolinking**.

Prerequisites (all already satisfied by this project):

- Android `minSdkVersion` ≥ 23 → project is **24** ✅
- Kotlin ≥ 2.0.0 → project is **2.0.21** ✅
- Android Gradle Plugin ≥ 8.3 (from RN 0.79) ✅ · Java **17** ✅
- **Android SDK Platform 36** must be installed — freeRASP compiles its module
  against `compileSdk 36`. Install it via Android Studio SDK Manager or
  `sdkmanager "platforms;android-36"` if a build complains about SDK 36.

```bash
npm install

# Android
npm run android

# iOS (installs the vendored TalsecRuntime.xcframework via CocoaPods)
cd ios && pod install && cd ..
npm run ios
```

> freeRASP uses native modules, so it does **not** run under Expo Go / a plain
> JS runtime — build the real app with `npm run android` / `npm run ios`.

---

## 🧪 Try it in a security lab

Build and run, then trigger checks and watch the red banner / `[freeRASP]`
console warnings appear:

| Technique | Threat that fires |
| --- | --- |
| Run on a rooted phone or jailbroken device | `privilegedAccess` |
| Run on an Android emulator / iOS Simulator | `simulator` |
| Attach a debugger (`adb`, lldb) | `debug` |
| Attach **Frida** / Xposed / inject a `.so` | `hooks` |
| Re-sign / repackage the APK, or run a debug build | `appIntegrity` |
| Install from outside an official store | `unofficialStore` |
| Enable developer mode / ADB | `devMode`, `adbEnabled` |

Every freeRASP callback (cross-platform, Android-only and iOS-only) is wired in
`SecurityContext.tsx`, so additional checks (`systemVPN`, `screenshot`,
`timeSpoofing`, `malware`, …) will surface the same way.

### Enforcement (observe vs. react)

freeRASP only *detects* threats and calls your callbacks — the SDK never kills
the app on its own, and `killOnBypass` only guards against tampering with the
callback mechanism, not ordinary threats. The reaction is your code.

This app exposes a single switch, `ENFORCE_RASP` in `src/security/freeRaspConfig.ts`:

- `ENFORCE_RASP = true` (**default**): on an *active attack* — root/jailbreak
  (`privilegedAccess`), a hooking framework (`hooks`), or a repackaged/re-signed
  binary (`appIntegrity`) — the app calls `abortApp()` and terminates. On a
  rooted/emulator/compromised device it closes on launch. Environmental signals
  (`devMode`, `adbEnabled`, `unofficialStore`, `simulator`, …) stay alert-only.
- `ENFORCE_RASP = false`: observe-only — every threat just raises the on-screen
  banner, nothing is killed. Use this to keep the lab app launchable on a rooted
  test device.

The critical set lives in `CRITICAL_THREATS` in `src/security/SecurityContext.tsx`.
For a production posture you can also keep `isProd: true`, and in the callbacks
log to your backend, wipe session tokens, or degrade functionality instead of
(or in addition to) terminating.

---

## Reference

- freeRASP React Native docs: <https://docs.talsec.app/freerasp/freerasp/integration/react-native/expo>
- freeRASP React Native repo: <https://github.com/talsec/Free-RASP-ReactNative>
