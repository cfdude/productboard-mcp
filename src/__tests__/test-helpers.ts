/**
 * Test helpers for mocking dependencies
 */

import { jest } from '@jest/globals';

// Mock axios at module level before any imports
jest.mock('axios', () => ({
  default: {
    create: jest.fn(() => ({
      get: jest.fn().mockRejectedValue(new Error('Unmocked axios call')),
      post: jest.fn().mockRejectedValue(new Error('Unmocked axios call')),
      put: jest.fn().mockRejectedValue(new Error('Unmocked axios call')),
      patch: jest.fn().mockRejectedValue(new Error('Unmocked axios call')),
      delete: jest.fn().mockRejectedValue(new Error('Unmocked axios call')),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
  },
}));