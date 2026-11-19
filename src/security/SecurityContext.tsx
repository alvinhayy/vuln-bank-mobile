import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useFreeRasp,
  type CallState,
  type RaspExecutionStateEventActions,
  type SuspiciousAppInfo,
  type ThreatEventActions,
} from 'freerasp-react-native';
import { talsecConfig } from './freeRaspConfig';

/**
 * Every threat freeRASP can report. Kept as a union so the rest of the app can
 * reason about detections in a type-safe way (see ThreatBanner).
 */
export type ThreatName = keyof ThreatEventActions;

/**
 * Human-readable labels used by the on-screen banner. Handy in a lab so you can
 * see *which* RASP check tripped while you attack the app (root, Frida, etc.).
 */
export const THREAT_LABELS: Record<ThreatName, string> = {
  privilegedAccess: 'Root / Jailbreak',
  debug: 'Debugger attached',
  simulator: 'Emulator / Simulator',
  appIntegrity: 'App integrity / Repackaged',
  unofficialStore: 'Unofficial store',
  hooks: 'Hooking framework (Frida/Xposed)',
  deviceBinding: 'Device binding',
  deviceID: 'Device ID',
  passcode: 'No device passcode',
  secureHardwareNotAvailable: 'No secure hardware',
  obfuscationIssues: 'Missing obfuscation',
  devMode: 'Developer mode',
  systemVPN: 'System VPN active',
  malware: 'Malware / suspicious app',
  adbEnabled: 'ADB enabled',
  screenshot: 'Screenshot taken',
  screenRecording: 'Screen recording',
  multiInstance: 'Cloned / multi-instance',
  timeSpoofing: 'Time spoofing',
  locationSpoofing: 'Location spoofing',
  unsecureWifi: 'Unsecure Wi-Fi',
  automation: 'Automation framework',
  bootloader: 'Unlocked bootloader',
  ongoingCall: 'Ongoing phone call',
};

interface SecurityContextValue {
  /** `true` once freeRASP has started successfully. */
  started: boolean;
  /** `true` once the fast RASP checks have completed. */
  checksFinished: boolean;
  /** Distinct threats detected so far, in the order they first fired. */
  threats: ThreatName[];
  /** Startup/registration error from freeRASP, if any. */
  error: string | null;
  isThreatActive: (name: ThreatName) => boolean;
  clearThreats: () => void;
}

const SecurityContext = createContext<SecurityContextValue>({
  started: false,
  checksFinished: false,
  threats: [],
  error: null,
  isThreatActive: () => false,
  clearThreats: () => {},
});

/**
 * Wraps the app, starts freeRASP via the `useFreeRasp` hook, and exposes the
 * live threat state to the rest of the tree.
 *
 * Note: `useFreeRasp` must be called exactly once, at the top of the component
 * tree — which is why this lives in a provider rendered at the app root.
 */
export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [threats, setThreats] = useState<ThreatName[]>([]);
  const [checksFinished, setChecksFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = useCallback((name: ThreatName, detail?: string) => {
    console.warn(
      `[freeRASP] threat detected: ${name}${detail ? ` — ${detail}` : ''}`,
    );
    setThreats(prev => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const clearThreats = useCallback(() => setThreats([]), []);

  // One callback per threat. Most are no-arg; `malware` and `ongoingCall`
  // receive extra data, which we fold into the log line.
  const actions = useMemo<ThreatEventActions>(() => {
    const flag = (name: ThreatName) => () => report(name);
    return {
      // ——— Android & iOS ———
      privilegedAccess: flag('privilegedAccess'),
      debug: flag('debug'),
      simulator: flag('simulator'),
      appIntegrity: flag('appIntegrity'),
      unofficialStore: flag('unofficialStore'),
      hooks: flag('hooks'),
      deviceBinding: flag('deviceBinding'),
      secureHardwareNotAvailable: flag('secureHardwareNotAvailable'),
      systemVPN: flag('systemVPN'),
      passcode: flag('passcode'),
      screenshot: flag('screenshot'),
      screenRecording: flag('screenRecording'),
      timeSpoofing: flag('timeSpoofing'),
      // ——— iOS only ———
      deviceID: flag('deviceID'),
      // ——— Android only ———
      obfuscationIssues: flag('obfuscationIssues'),
      devMode: flag('devMode'),
      adbEnabled: flag('adbEnabled'),
      multiInstance: flag('multiInstance'),
      locationSpoofing: flag('locationSpoofing'),
      unsecureWifi: flag('unsecureWifi'),
      automation: flag('automation'),
      bootloader: flag('bootloader'),
      malware: (apps: SuspiciousAppInfo[]) =>
        report('malware', `${apps?.length ?? 0} suspicious app(s)`),
      ongoingCall: (state: CallState) => report('ongoingCall', String(state)),
    };
  }, [report]);

  const raspExecutionStateActions = useMemo<RaspExecutionStateEventActions>(
    () => ({
      fastChecksFinished: () => setChecksFinished(true),
      postponedChecksFinished: () => {},
    }),
    [],
  );

  const { started, error: raspError } = useFreeRasp(
    talsecConfig,
    actions,
    raspExecutionStateActions,
  );

  useEffect(() => {
    if (raspError) {
      console.error(
        `[freeRASP] startup error ${raspError.code}: ${raspError.message}`,
      );
      setError(`${raspError.code}: ${raspError.message}`);
    }
  }, [raspError]);

  const value = useMemo<SecurityContextValue>(
    () => ({
      started,
      checksFinished,
      threats,
      error,
      isThreatActive: (name: ThreatName) => threats.includes(name),
      clearThreats,
    }),
    [started, checksFinished, threats, error, clearThreats],
  );

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextValue =>
  useContext(SecurityContext);

export default SecurityContext;
