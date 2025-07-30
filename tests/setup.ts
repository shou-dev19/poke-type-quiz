// Test setup file for Vitest

// Global test utilities
import { beforeEach, afterEach, vi } from 'vitest';

// Mock console methods in tests to reduce noise
beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Global test helpers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeTypeOf(expected: string): T;
    }
  }
}

// Add custom matchers if needed
expect.extend({
  toBeTypeOf(received: any, expected: string) {
    const actualType = typeof received;
    const pass = actualType === expected;
    
    return {
      message: () =>
        `expected ${received} to be of type ${expected}, but got ${actualType}`,
      pass,
    };
  },
});

export {};