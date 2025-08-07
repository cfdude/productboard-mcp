/**
 * @jest-environment node
 */

import { describe, it, expect, jest } from '@jest/globals';

// Mock debug logger
jest.mock('../utils/debug-logger.js', () => ({
  debugLog: jest.fn(),
}));

describe('SessionManager - Basic Tests', () => {
  it('should have basic functionality', () => {
    // This is just a placeholder test to ensure the test infrastructure works
    expect(true).toBe(true);
  });

  it('should be able to import session manager', async () => {
    // Dynamic import to avoid timer issues during module loading
    const { sessionManager } = await import('../session-manager.js');

    expect(sessionManager).toBeDefined();
    expect(typeof sessionManager.createSession).toBe('function');
    expect(typeof sessionManager.getSession).toBe('function');
    expect(typeof sessionManager.removeSession).toBe('function');
    expect(typeof sessionManager.getActiveSessionCount).toBe('function');
  });
});
