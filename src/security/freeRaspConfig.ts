import type { TalsecConfig } from 'freerasp-react-native';

/**
 * freeRASP (Talsec) configuration for the Vulnerable Bank app.
 *
 * freeRASP adds Runtime Application Self-Protection (RASP) to the app. In this
 * intentionally-vulnerable lab it lets you *observe* a hardening layer reacting
 * to the very techniques this app is meant to practice against: rooted/jailbroken
 * devices, emulators, debuggers, Frida/hooking, repackaging, and more.
 *
 * ⚠️  Replace the placeholders below before building a real RELEASE:
 *   - androidConfig.certificateHashes : base64 SHA-256 of your RELEASE signing cert
 *   - iosConfig.appTeamId             : your Apple Developer Team ID
 *   - watcherMail                     : an email you control (receives Talsec reports)
 *
 * How to get the Android release signing hash (base64 SHA-256):
 *   keytool -list -v -keystore <your.keystore> -alias <alias>
 *   # then convert the printed hex SHA-256 to base64 (see docs.talsec.app),
 *   # or read it straight from Play Console → App integrity → Play app signing.
 * The DEBUG keystore hash will NOT match, so `appIntegrity` is expected to fire
 * in development builds — that is normal.
 */
export const talsecConfig: TalsecConfig = {
  androidConfig: {
    packageName: 'com.vulnerablebankapp',
    // base64 SHA-256 of the release signing certificate (android/app/vbm-release.keystore,
    // alias vbm-release). Regenerate this if you sign with a different keystore.
    certificateHashes: ['78YlOUuNQp9mZORikbC8xItVhvDWMVECO+/KeXmFNeY='],
    // Optional: alternative app stores you consider trustworthy.
    // supportedAlternativeStores: ['com.sec.android.app.samsungapps'],
  },
  iosConfig: {
    // Default RN bundle id for this project (see ios/*.xcodeproj). Update if you
    // change PRODUCT_BUNDLE_IDENTIFIER.
    appBundleIds: ['org.reactjs.native.example.VulnerableBankApp'],
    // TODO: replace with your Apple Developer Team ID.
    appTeamId: 'REPLACE_WITH_APPLE_TEAM_ID',
  },
  // TODO: set an email you control to receive Talsec security reports.
  watcherMail: 'security@example.com',
  // Dev builds run in "Dev" mode (relaxed + verbose logs); release builds run in
  // "Release" mode where every check is live. Flip automatically on build type.
  isProd: !__DEV__,
  // Android only. Keep false in a lab so you can observe bypass attempts instead
  // of the app being killed instantly. Set true to harden a real release.
  killOnBypass: false,
};

/**
 * RASP enforcement switch.
 *
 * freeRASP only *detects* threats and invokes your callbacks — the SDK never
 * terminates the app by itself (and `killOnBypass` only guards against tampering
 * with the callback mechanism, not ordinary threats). When this is `true`, the
 * critical threats in `CRITICAL_THREATS` (see SecurityContext) trigger
 * `abortApp()` — freeRASP's secure termination. Everything else only raises the
 * on-screen banner, in either mode.
 *
 * `true` = hardened: the app terminates itself when an active attack is detected
 * (root/jailbreak, hooking, repackaging). On a rooted/emulator/compromised
 * device the app will close on launch — that is RASP working as intended.
 * Set to `false` to return to observe-only mode (alert + banner, no kill) so the
 * lab app stays launchable on such devices.
 */
export const ENFORCE_RASP = true;
