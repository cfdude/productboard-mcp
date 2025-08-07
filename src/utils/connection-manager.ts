/**
 * Connection manager for handling multiple concurrent MCP connections
 */

interface Connection {
  id: string;
  createdAt: Date;
  lastUsed: Date;
  requestCount: number;
  isActive: boolean;
}

class ConnectionManager {
  private connections = new Map<string, Connection>();
  private requestQueue = new Map<
    string,
    Array<{
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      request: any;
    }>
  >();
  private activeRequests = new Map<string, number>();
  private readonly maxConcurrentRequests = 10;
  private readonly connectionTimeout = 300000; // 5 minutes

  /**
   * Register a new connection
   */
  registerConnection(connectionId: string): void {
    this.connections.set(connectionId, {
      id: connectionId,
      createdAt: new Date(),
      lastUsed: new Date(),
      requestCount: 0,
      isActive: true,
    });

    // Initialize request tracking
    this.activeRequests.set(connectionId, 0);
    this.requestQueue.set(connectionId, []);

    // Connection registered successfully
  }

  /**
   * Handle incoming request with queuing and concurrency control
   */
  async handleRequest<T>(
    connectionId: string,
    requestHandler: () => Promise<T>
  ): Promise<T> {
    // Register connection if not exists
    if (!this.connections.has(connectionId)) {
      this.registerConnection(connectionId);
    }

    const connection = this.connections.get(connectionId)!;
    connection.lastUsed = new Date();
    connection.requestCount++;

    // Check if we can process immediately
    const currentActive = this.activeRequests.get(connectionId) || 0;

    if (currentActive >= this.maxConcurrentRequests) {
      // Queue the request
      return new Promise<T>((resolve, reject) => {
        const queue = this.requestQueue.get(connectionId) || [];
        queue.push({ resolve, reject, request: requestHandler });
        this.requestQueue.set(connectionId, queue);
      });
    }

    return this.executeRequest(connectionId, requestHandler);
  }

  /**
   * Execute a request with proper tracking
   */
  private async executeRequest<T>(
    connectionId: string,
    requestHandler: () => Promise<T>
  ): Promise<T> {
    // Increment active request count
    const currentActive = this.activeRequests.get(connectionId) || 0;
    this.activeRequests.set(connectionId, currentActive + 1);

    try {
      const result = await requestHandler();
      return result;
    } finally {
      // Decrement active request count
      const newActive = (this.activeRequests.get(connectionId) || 1) - 1;
      this.activeRequests.set(connectionId, newActive);

      // Process next queued request if any
      this.processQueue(connectionId);
    }
  }

  /**
   * Process queued requests for a connection
   */
  private processQueue(connectionId: string): void {
    const queue = this.requestQueue.get(connectionId) || [];
    const currentActive = this.activeRequests.get(connectionId) || 0;

    if (queue.length > 0 && currentActive < this.maxConcurrentRequests) {
      const { resolve, reject, request } = queue.shift()!;
      this.requestQueue.set(connectionId, queue);

      this.executeRequest(connectionId, request)
        .then((result: unknown) => resolve(result))
        .catch((error: any) => reject(error));
    }
  }

  /**
   * Close and cleanup a connection
   */
  closeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.isActive = false;

      // Reject any queued requests
      const queue = this.requestQueue.get(connectionId) || [];
      queue.forEach(({ reject }) => {
        reject(new Error('Connection closed'));
      });

      // Cleanup
      this.connections.delete(connectionId);
      this.activeRequests.delete(connectionId);
      this.requestQueue.delete(connectionId);

      // Connection closed and cleaned up
    }
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    totalConnections: number;
    activeConnections: number;
    totalRequests: number;
    queuedRequests: number;
  } {
    const activeConnections = Array.from(this.connections.values()).filter(
      conn => conn.isActive
    ).length;

    const totalRequests = Array.from(this.connections.values()).reduce(
      (sum, conn) => sum + conn.requestCount,
      0
    );

    const queuedRequests = Array.from(this.requestQueue.values()).reduce(
      (sum, queue) => sum + queue.length,
      0
    );

    return {
      totalConnections: this.connections.size,
      activeConnections,
      totalRequests,
      queuedRequests,
    };
  }

  /**
   * Cleanup stale connections
   */
  cleanupStaleConnections(): void {
    const now = new Date();
    const staleConnections: string[] = [];

    this.connections.forEach((connection, id) => {
      const timeSinceLastUse = now.getTime() - connection.lastUsed.getTime();
      if (timeSinceLastUse > this.connectionTimeout) {
        staleConnections.push(id);
      }
    });

    staleConnections.forEach(id => this.closeConnection(id));

    if (staleConnections.length > 0) {
      // Stale connections cleaned up successfully
    }
  }
}

// Singleton instance
export const connectionManager = new ConnectionManager();

// Cleanup interval - store reference for testing
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

// Only set interval if not in test environment
if (process.env.NODE_ENV !== 'test') {
  cleanupInterval = setInterval(() => {
    connectionManager.cleanupStaleConnections();
  }, 60000); // Every minute
}

// Export function to clear interval for testing
export const clearCleanupInterval = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};
