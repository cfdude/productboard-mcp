/**
 * Session-aware configuration loading for ProductBoard MCP Server
 * Provides isolated configuration per session to prevent conflicts
 */

import { SessionState } from '../session-manager.js';
import { debugLog } from './debug-logger.js';

export interface SessionConfig {
  apiToken?: string;
  baseUrl?: string;
  timeouts?: {
    request?: number;
    response?: number;
  };
  rateLimiting?: {
    enabled: boolean;
    maxRequestsPerMinute: number;
  };
  caching?: {
    enabled: boolean;
    ttlSeconds: number;
  };
}

/**
 * Load configuration for a specific session
 */
export function loadSessionConfig(session: SessionState): SessionConfig {
  const cacheKey = 'session-config';
  
  // Check session cache first
  if (session.configCache.has(cacheKey)) {
    debugLog('session-config', 'Configuration loaded from session cache', {
      sessionId: session.sessionId,
    });
    return session.configCache.get(cacheKey);
  }

  // Load configuration from environment variables
  const config: SessionConfig = {
    apiToken: process.env.PRODUCTBOARD_API_TOKEN,
    baseUrl: process.env.PRODUCTBOARD_BASE_URL || 'https://api.productboard.com',
    timeouts: {
      request: parseInt(process.env.PRODUCTBOARD_REQUEST_TIMEOUT || '30000'),
      response: parseInt(process.env.PRODUCTBOARD_RESPONSE_TIMEOUT || '30000'),
    },
    rateLimiting: {
      enabled: process.env.PRODUCTBOARD_RATE_LIMITING !== 'false',
      maxRequestsPerMinute: parseInt(process.env.PRODUCTBOARD_MAX_REQUESTS_PER_MINUTE || '100'),
    },
    caching: {
      enabled: process.env.PRODUCTBOARD_CACHING !== 'false',
      ttlSeconds: parseInt(process.env.PRODUCTBOARD_CACHE_TTL || '300'),
    },
  };

  // Cache the configuration in the session
  session.configCache.set(cacheKey, config);

  debugLog('session-config', 'Configuration loaded and cached', {
    sessionId: session.sessionId,
    hasApiToken: !!config.apiToken,
    baseUrl: config.baseUrl,
    rateLimitingEnabled: config.rateLimiting?.enabled,
    cachingEnabled: config.caching?.enabled,
  });

  return config;
}

/**
 * Update session configuration
 */
export function updateSessionConfig(session: SessionState, updates: Partial<SessionConfig>): void {
  const cacheKey = 'session-config';
  const currentConfig = session.configCache.get(cacheKey) || {};
  
  const updatedConfig = {
    ...currentConfig,
    ...updates,
  };

  session.configCache.set(cacheKey, updatedConfig);

  debugLog('session-config', 'Session configuration updated', {
    sessionId: session.sessionId,
    updates: Object.keys(updates),
  });
}

/**
 * Clear session configuration cache
 */
export function clearSessionConfigCache(session: SessionState): void {
  const cacheKey = 'session-config';
  session.configCache.delete(cacheKey);

  debugLog('session-config', 'Session configuration cache cleared', {
    sessionId: session.sessionId,
  });
}

/**
 * Validate session configuration
 */
export function validateSessionConfig(config: SessionConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.apiToken) {
    errors.push('PRODUCTBOARD_API_TOKEN environment variable is required');
  }

  if (!config.baseUrl) {
    errors.push('Base URL is required');
  } else {
    try {
      new URL(config.baseUrl);
    } catch {
      errors.push('Base URL must be a valid URL');
    }
  }

  if (config.timeouts?.request && (config.timeouts.request < 1000 || config.timeouts.request > 120000)) {
    errors.push('Request timeout must be between 1000ms and 120000ms');
  }

  if (config.rateLimiting?.maxRequestsPerMinute && config.rateLimiting.maxRequestsPerMinute < 1) {
    errors.push('Rate limiting max requests per minute must be at least 1');
  }

  if (config.caching?.ttlSeconds && config.caching.ttlSeconds < 0) {
    errors.push('Cache TTL seconds cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}