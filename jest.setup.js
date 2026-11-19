/* eslint-env jest */
/**
 * Jest setup.
 *
 * AsyncStorage relies on a native module that is absent under Jest, so we swap
 * in the official mock shipped with the package. (freerasp-react-native is
 * mocked separately via __mocks__/freerasp-react-native.js.)
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Vector icons ship native font assets that Jest cannot transform; stub them.
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
