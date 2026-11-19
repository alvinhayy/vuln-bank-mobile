/**
 * @format
 *
 * Smoke tests for the Talsec freeRASP integration layer. freerasp-react-native
 * is mocked (see __mocks__/freerasp-react-native.js), so these exercise our
 * wiring — config shape and the SecurityProvider/useSecurity contract — not the
 * native SDK.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { talsecConfig } from '../src/security/freeRaspConfig';
import {
  SecurityProvider,
  THREAT_LABELS,
  useSecurity,
} from '../src/security/SecurityContext';

describe('talsecConfig', () => {
  it('has the required Talsec fields wired to this app', () => {
    expect(talsecConfig.watcherMail).toBeTruthy();
    expect(talsecConfig.androidConfig?.packageName).toBe('com.vulnerablebankapp');
    expect(talsecConfig.androidConfig?.certificateHashes.length).toBeGreaterThan(0);
    expect(talsecConfig.iosConfig?.appBundleIds.length).toBeGreaterThan(0);
    expect(talsecConfig.iosConfig?.appTeamId).toBeTruthy();
  });
});

describe('THREAT_LABELS', () => {
  it('provides a human-readable label for core cross-platform threats', () => {
    for (const key of [
      'privilegedAccess',
      'debug',
      'simulator',
      'appIntegrity',
      'hooks',
    ] as const) {
      expect(THREAT_LABELS[key]).toBeTruthy();
    }
  });
});

describe('SecurityProvider', () => {
  it('exposes a default (no-threat) security state to consumers', async () => {
    let captured: ReturnType<typeof useSecurity> | undefined;

    const Probe = () => {
      captured = useSecurity();
      return <Text>probe</Text>;
    };

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <SecurityProvider>
          <Probe />
        </SecurityProvider>,
      );
    });

    expect(captured).toBeDefined();
    expect(captured?.started).toBe(false);
    expect(captured?.threats).toEqual([]);
    expect(captured?.error).toBeNull();
    expect(captured?.isThreatActive('hooks')).toBe(false);
  });
});
