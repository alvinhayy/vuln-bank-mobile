import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SIZES } from '../styles/theme';
import { THREAT_LABELS, useSecurity } from './SecurityContext';

/**
 * A lightweight, dismissible banner that surfaces freeRASP detections on screen.
 *
 * This is an *educational* aid: in a security lab it lets you watch RASP react
 * in real time as you root the device, attach Frida, run the app on an emulator,
 * repackage the APK, and so on. A production app would normally react silently
 * (log to a backend, degrade functionality, or exit) rather than announce it.
 */
const ThreatBanner: React.FC = () => {
  const { threats, error } = useSecurity();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (threats.length === 0 && !error)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          🛡️ freeRASP · {threats.length} threat
          {threats.length === 1 ? '' : 's'} detected
        </Text>
        <TouchableOpacity
          onPress={() => setDismissed(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.dismiss}>✕</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>⚠️ {error}</Text> : null}

      <ScrollView
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {threats.map(name => (
          <View key={name} style={styles.chip}>
            <Text style={styles.chipText}>{THREAT_LABELS[name] ?? name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.danger,
    paddingTop: SIZES.spacing.sm,
    paddingBottom: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  dismiss: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    paddingLeft: SIZES.spacing.sm,
  },
  error: {
    color: COLORS.white,
    fontSize: SIZES.xSmall,
    marginTop: 2,
  },
  chipScroll: {
    marginTop: SIZES.spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.xs,
  },
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: SIZES.radius.sm,
    paddingVertical: 4,
    paddingHorizontal: SIZES.spacing.sm,
  },
  chipText: {
    color: COLORS.white,
    fontSize: SIZES.xSmall,
    fontWeight: '500',
  },
});

export default ThreatBanner;
