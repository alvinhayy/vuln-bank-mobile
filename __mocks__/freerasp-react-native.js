/**
 * Jest mock for freerasp-react-native.
 *
 * freeRASP relies on native modules that are not present in the Jest/Node test
 * environment, so we stub the public surface the app uses. The `useFreeRasp`
 * hook reports "not started / no error" so components render normally in tests.
 */
module.exports = {
  useFreeRasp: () => ({ started: false, error: null }),
  talsecStart: jest.fn(() => Promise.resolve()),
  setThreatListeners: jest.fn(),
  startOngoingCallDetection: jest.fn(() => Promise.resolve()),
  stopOngoingCallDetection: jest.fn(() => Promise.resolve()),
  addToWhitelist: jest.fn(() => Promise.resolve()),
  storeExternalId: jest.fn(() => Promise.resolve()),
  removeExternalId: jest.fn(() => Promise.resolve()),
  blockScreenCapture: jest.fn(() => Promise.resolve()),
  isScreenCaptureBlocked: jest.fn(() => Promise.resolve(false)),
  abortApp: jest.fn(),
  TalsecError: class TalsecError extends Error {},
};
