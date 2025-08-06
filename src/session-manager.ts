/**
 * Session management for ProductBoard MCP Server
 * Provides isolated state per connection to prevent conflicts between multiple clients
 */

import { randomBytes } from 'crypto';
import { debugLog } from './utils/debug-logger.js';

export interface SessionState {
  sessionId: string;
  createdAt: Date;
  lastActivity: Date;
  clientInfo?: {
    userAgent?: string;
    clientId?: string;
  };
  apiInstances: Map<string, any>;
  configCache: Map<string, any>;
  requestCount: number;
  activeRequests: Set<string>;
}

export interface SessionManager {
  createSession(sessionId?: string): SessionState;
  getSession(sessionId: string): SessionState | undefined;
  updateActivity(sessionId: string): void;
  removeSession(sessionId: string): void;
  cleanupInactiveSessions(): void;
  getActiveSessionCount(): number;
  getSessionStats(): SessionStats;
}

export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  totalRequests: number;
  averageRequestsPerSession: number;
  oldestSession?: Date;
}

class ProductBoardSessionManager implements SessionManager {
  private sessions = new Map<string, SessionState>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly sessionTimeout: number = 300000; // 5 minutes
  private readonly cleanupIntervalMs: number = 60000; // 1 minute

  constructor() {
    this.startCleanupTimer();
    debugLog('session-manager', 'SessionManager initialized', {
      sessionTimeout: this.sessionTimeout,
      cleanupInterval: this.cleanupIntervalMs,
    });
  }

  createSession(sessionId?: string): SessionState {
    const id = sessionId || this.generateSessionId();
    
    const session: SessionState = {
      sessionId: id,
      createdAt: new Date(),
      lastActivity: new Date(),
      apiInstances: new Map(),
      configCache: new Map(),
      requestCount: 0,
      activeRequests: new Set(),
    };

    this.sessions.set(id, session);

    debugLog('session-manager', 'Session created', {
      sessionId: id,
      totalSessions: this.sessions.size,
    });

    return session;
  }

  getSession(sessionId: string): SessionState | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.updateActivity(sessionId);
    }
    return session;
  }

  updateActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  removeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    // Clean up any remaining active requests
    if (session.activeRequests.size > 0) {
      debugLog('session-manager', 'Cleaning up active requests during session removal', {
        sessionId,
        activeRequestCount: session.activeRequests.size,
      });
      session.activeRequests.clear();
    }

    // Clear cached instances and configurations
    session.apiInstances.clear();
    session.configCache.clear();

    this.sessions.delete(sessionId);

    debugLog('session-manager', 'Session removed', {
      sessionId,
      remainingSessions: this.sessions.size,
    });
  }

  cleanupInactiveSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      
      if (timeSinceActivity > this.sessionTimeout) {
        expiredSessions.push(sessionId);
      }
    }

    if (expiredSessions.length > 0) {
      debugLog('session-manager', 'Cleaning up expired sessions', {
        expiredCount: expiredSessions.length,
        expiredSessions,
      });

      for (const sessionId of expiredSessions) {
        this.removeSession(sessionId);
      }
    }
  }

  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  getSessionStats(): SessionStats {
    const sessions = Array.from(this.sessions.values());
    const totalRequests = sessions.reduce((sum, session) => sum + session.requestCount, 0);
    
    return {
      totalSessions: sessions.length,
      activeSessions: sessions.length,
      totalRequests,
      averageRequestsPerSession: sessions.length > 0 ? totalRequests / sessions.length : 0,
      oldestSession: sessions.length > 0 
        ? new Date(Math.min(...sessions.map(s => s.createdAt.getTime())))
        : undefined,
    };
  }

  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = randomBytes(8).toString('hex');
    return `pb-${timestamp}-${randomPart}`;
  }

  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveSessions();
    }, this.cleanupIntervalMs);

    // Ensure cleanup timer doesn't keep the process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Clean up all sessions
    const sessionIds = Array.from(this.sessions.keys());
    for (const sessionId of sessionIds) {
      this.removeSession(sessionId);
    }

    debugLog('session-manager', 'SessionManager shutdown completed', {
      cleanedUpSessions: sessionIds.length,
    });
  }
}

// Global session manager instance
export const sessionManager = new ProductBoardSessionManager();

// Graceful shutdown handling
process.on('SIGINT', () => {
  sessionManager.shutdown();
});

process.on('SIGTERM', () => {
  sessionManager.shutdown();
});