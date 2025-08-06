/**
 * Main ProductboardServer class following session management pattern from Jira MCP analysis
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { setupToolHandlers } from './tools/index.js';
import { setupDynamicToolHandlers } from './tools/index-dynamic.js';
import { setupDocumentation } from './documentation/documentation-provider.js';
import { sessionManager, SessionState } from './session-manager.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { debugLog } from './utils/debug-logger.js';

export class ProductboardServer {
  private server: Server;
  private initialized = false;
  private currentSession: SessionState | null = null;

  constructor() {
    debugLog('productboard-server', 'Initializing ProductBoard MCP Server');
    this.server = new Server(
      {
        name: 'productboard-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Setup error handling with session context
    this.server.onerror = error => {
      debugLog('productboard-server', 'MCP Server Error', {
        sessionId: this.currentSession?.sessionId,
        error: error.message,
        stack: error.stack,
      });
      console.error('[MCP Error]', error);
    };

    // Note: Removed global process handlers to avoid conflicts with Claude's process management
    // Session cleanup is handled by transport close events
    debugLog(
      'productboard-server',
      'ProductBoard MCP Server initialization completed'
    );
  }

  /**
   * Initialize the server with tool handlers
   */
  async initialize(session?: SessionState) {
    if (this.initialized) return;

    debugLog(
      'productboard-server',
      'Initializing server with session support',
      {
        sessionId: session?.sessionId,
      }
    );

    // Setup tool handlers - use dynamic loading if manifest exists
    const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
    if (existsSync(manifestPath)) {
      console.error('Using dynamic tool loading with manifest');
      debugLog('productboard-server', 'Using dynamic tool loading');
      await setupDynamicToolHandlers(this.server, session);
    } else {
      console.error('Using static tool loading (no manifest found)');
      debugLog('productboard-server', 'Using static tool loading');
      setupToolHandlers(this.server, session);
    }

    // Setup documentation (prompts and resources)
    setupDocumentation(this.server);

    this.initialized = true;
  }

  /**
   * Start the server with session management
   */
  async run() {
    debugLog(
      'productboard-server',
      'Starting ProductBoard MCP server transport'
    );

    const transport = new StdioServerTransport();

    // Create a session for this STDIO connection with cryptographically secure random ID
    const randomSuffix = randomBytes(8).toString('hex');
    const sessionId = `pb-stdio-${Date.now()}-${randomSuffix}`;
    this.currentSession = sessionManager.createSession(sessionId);

    debugLog('productboard-server', 'Created session for STDIO connection', {
      sessionId: this.currentSession.sessionId,
      totalSessions: sessionManager.getActiveSessionCount(),
    });

    // Add transport event logging with session context
    transport.onclose = () => {
      debugLog('productboard-server', 'MCP transport closed', {
        sessionId: this.currentSession?.sessionId,
      });
      if (this.currentSession) {
        sessionManager.removeSession(this.currentSession.sessionId);
        debugLog(
          'productboard-server',
          'Session cleaned up on transport close',
          {
            sessionId: this.currentSession.sessionId,
          }
        );
      }
    };

    transport.onerror = error => {
      debugLog('productboard-server', 'MCP transport error', {
        sessionId: this.currentSession?.sessionId,
        error: error.message,
        stack: error.stack,
      });
    };

    // Initialize with current session
    await this.initialize(this.currentSession);

    try {
      await this.server.connect(transport);
      console.error('ProductBoard MCP server running on stdio');
      debugLog(
        'productboard-server',
        'ProductBoard MCP server running on stdio transport',
        {
          sessionId: this.currentSession.sessionId,
          activeSessions: sessionManager.getActiveSessionCount(),
        }
      );

      // Log server connection status
      debugLog('productboard-server', 'Server connection established', {
        sessionId: this.currentSession.sessionId,
        serverName: 'productboard-server',
        serverVersion: '0.1.0',
      });
    } catch (error: any) {
      debugLog(
        'productboard-server',
        'Failed to connect MCP server transport',
        {
          sessionId: this.currentSession?.sessionId,
          error: error.message,
          stack: error.stack,
        }
      );

      // Clean up session on connection failure
      if (this.currentSession) {
        sessionManager.removeSession(this.currentSession.sessionId);
      }

      throw error;
    }
  }
}
