import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { SecurityProvider } from './src/security/SecurityContext';
import ThreatBanner from './src/security/ThreatBanner';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/styles/theme';

/**
 * Vulnerable Bank Mobile App
 *
 * This app is intentionally built with security vulnerabilities for educational
 * purposes. It demonstrates common security issues in mobile banking applications.
 *
 * It is additionally hardened with Talsec freeRASP (Runtime Application
 * Self-Protection) so that, in a security lab, you can observe a RASP layer
 * reacting to root/jailbreak, emulators, debuggers, hooking frameworks (Frida),
 * repackaging and more. See src/security/ and SECURITY-FREERASP.md.
 */
const App = () => {
  return (
    <SecurityProvider>
      <AuthProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.COLORS.backgroundDark}
        />
        <ThreatBanner />
        <AppNavigator />
      </AuthProvider>
    </SecurityProvider>
  );
};

export default App;
