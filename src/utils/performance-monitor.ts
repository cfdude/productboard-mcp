/**
 * Performance monitoring and optimization utilities for ProductBoard MCP server
 */
/* eslint-disable no-undef */

export interface PerformanceMetrics {
  requestId: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  cacheHit?: boolean;
  dataSize?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  errorCount?: number;
  retryCount?: number;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size?: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
  averageAccessCount: number;
}

export interface ThrottleConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (operation: string, params?: unknown) => string;
}

export interface QueryOptimization {
  batchSize: number;
  concurrency: number;
  retryConfig: {
    maxRetries: number;
    backoffMs: number;
    exponential: boolean;
  };
  cacheConfig: {
    ttl: number;
    maxSize: number;
    strategy: 'LRU' | 'TTL' | 'FIFO';
  };
}

/**
 * Advanced caching system with intelligent TTL and memory management
 */
export class IntelligentCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private maxSize: number;
  private defaultTtl: number;
  private strategy: 'LRU' | 'TTL' | 'FIFO';
  private hitCount = 0;
  private missCount = 0;

  constructor(
    maxSize: number = 1000,
    defaultTtl: number = 300000, // 5 minutes
    strategy: 'LRU' | 'TTL' | 'FIFO' = 'LRU'
  ) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
    this.strategy = strategy;
  }

  /**
   * Get cached value with intelligent expiration
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    const now = Date.now();

    // Check if entry is expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.missCount++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.hitCount++;

    // Update LRU order
    if (this.strategy === 'LRU') {
      this.updateAccessOrder(key);
    }

    return entry.data;
  }

  /**
   * Set cached value with dynamic TTL based on data characteristics
   */
  set(key: string, data: T, customTtl?: number): void {
    const now = Date.now();
    const ttl = customTtl || this.calculateDynamicTtl(data);
    const size = this.estimateDataSize(data);

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl,
      accessCount: 0,
      lastAccessed: now,
      size,
    };

    // Remove old entry if exists
    if (this.cache.has(key)) {
      this.removeFromAccessOrder(key);
    }

    // Evict if at capacity
    while (this.cache.size >= this.maxSize) {
      this.evictEntry();
    }

    this.cache.set(key, entry);
    this.accessOrder.push(key);
  }

  /**
   * Calculate dynamic TTL based on data characteristics
   */
  private calculateDynamicTtl(data: T): number {
    // Base TTL
    let ttl = this.defaultTtl;

    // Adjust TTL based on data type and size
    if (Array.isArray(data)) {
      // Larger arrays get longer TTL (more expensive to regenerate)
      const arrayLength = data.length;
      if (arrayLength > 100) ttl *= 2;
      if (arrayLength > 1000) ttl *= 3;
    }

    // Static data gets longer TTL
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      if (
        obj.status &&
        ['released', 'archived'].includes(obj.status as string)
      ) {
        ttl *= 5; // Static status data can be cached longer
      }
      if (obj.createdAt && !obj.updatedAt) {
        ttl *= 3; // Immutable data gets longer TTL
      }
    }

    return Math.min(ttl, 3600000); // Max 1 hour TTL
  }

  /**
   * Estimate data size for memory management
   */
  private estimateDataSize(data: T): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate
    } catch {
      return 1000; // Default size estimate
    }
  }

  /**
   * Evict entry based on strategy
   */
  private evictEntry(): void {
    let keyToEvict: string | undefined;

    switch (this.strategy) {
      case 'LRU':
        keyToEvict = this.accessOrder[0];
        break;
      case 'FIFO':
        keyToEvict = this.accessOrder[0];
        break;
      case 'TTL': {
        // Find entry with shortest remaining TTL
        let shortestTtl = Infinity;
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          const remainingTtl = entry.ttl - (now - entry.timestamp);
          if (remainingTtl < shortestTtl) {
            shortestTtl = remainingTtl;
            keyToEvict = key;
          }
        }
        break;
      }
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.removeFromAccessOrder(keyToEvict);
    }
  }

  /**
   * Update access order for LRU strategy
   */
  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  /**
   * Remove key from access order array
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const now = Date.now();
    let totalSize = 0;
    let oldestEntry = now;
    let newestEntry = 0;
    let totalAccessCount = 0;

    for (const entry of this.cache.values()) {
      totalSize += entry.size || 0;
      if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
      if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
      totalAccessCount += entry.accessCount;
    }

    return {
      totalEntries: this.cache.size,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0,
      memoryUsage: totalSize,
      oldestEntry,
      newestEntry,
      averageAccessCount: totalAccessCount / this.cache.size || 0,
    };
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        this.removeFromAccessOrder(key);
        clearedCount++;
      }
    }

    return clearedCount;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Request throttling and rate limiting
 */
export class RequestThrottler {
  private requests = new Map<string, number[]>();
  private config: ThrottleConfig;

  constructor(config: ThrottleConfig) {
    this.config = config;
  }

  /**
   * Check if request should be throttled
   */
  shouldThrottle(operation: string, params?: unknown): boolean {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(operation, params)
      : operation;

    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get or create request history for this key
    let requestTimes = this.requests.get(key) || [];

    // Remove requests outside the current window
    requestTimes = requestTimes.filter(time => time > windowStart);

    // Update the map
    this.requests.set(key, requestTimes);

    // Check if we're at the limit
    return requestTimes.length >= this.config.maxRequests;
  }

  /**
   * Record a request
   */
  recordRequest(
    operation: string,
    params?: unknown,
    wasSuccessful?: boolean
  ): void {
    // Skip recording based on config
    if (wasSuccessful && this.config.skipSuccessfulRequests) return;
    if (!wasSuccessful && this.config.skipFailedRequests) return;

    const key = this.config.keyGenerator
      ? this.config.keyGenerator(operation, params)
      : operation;

    const now = Date.now();
    const requestTimes = this.requests.get(key) || [];
    requestTimes.push(now);
    this.requests.set(key, requestTimes);
  }

  /**
   * Get throttle status for operation
   */
  getThrottleStatus(
    operation: string,
    params?: unknown
  ): {
    isThrottled: boolean;
    requestCount: number;
    timeUntilReset: number;
  } {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(operation, params)
      : operation;

    const requestTimes = this.requests.get(key) || [];
    const now = Date.now();

    const activeRequests = requestTimes.filter(
      time => time > now - this.config.windowMs
    );

    return {
      isThrottled: activeRequests.length >= this.config.maxRequests,
      requestCount: activeRequests.length,
      timeUntilReset:
        activeRequests.length > 0
          ? this.config.windowMs - (now - Math.min(...activeRequests))
          : 0,
    };
  }
}

/**
 * Performance metrics collector
 */
export class PerformanceCollector {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics: number;

  constructor(maxMetrics: number = 10000) {
    this.maxMetrics = maxMetrics;
  }

  /**
   * Start tracking a performance metric
   */
  start(operation: string, requestId?: string): PerformanceMetrics {
    const metric: PerformanceMetrics = {
      requestId: requestId || this.generateRequestId(),
      operation,
      startTime: Date.now(),
      memoryUsage: process.memoryUsage(),
    };

    this.metrics.push(metric);

    // Keep metrics array from growing too large
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    return metric;
  }

  /**
   * End tracking a performance metric
   */
  end(metric: PerformanceMetrics, success: boolean = true): PerformanceMetrics {
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    if (!success) {
      metric.errorCount = (metric.errorCount || 0) + 1;
    }

    return metric;
  }

  /**
   * Record cache hit/miss
   */
  recordCacheHit(metric: PerformanceMetrics, isHit: boolean): void {
    metric.cacheHit = isHit;
  }

  /**
   * Record data size
   */
  recordDataSize(metric: PerformanceMetrics, dataSize: number): void {
    metric.dataSize = dataSize;
  }

  /**
   * Record retry attempt
   */
  recordRetry(metric: PerformanceMetrics): void {
    metric.retryCount = (metric.retryCount || 0) + 1;
  }

  /**
   * Get performance statistics
   */
  getStats(operation?: string): {
    totalRequests: number;
    averageDuration: number;
    cacheHitRate: number;
    errorRate: number;
    averageDataSize: number;
    percentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  } {
    const filteredMetrics = operation
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageDuration: 0,
        cacheHitRate: 0,
        errorRate: 0,
        averageDataSize: 0,
        percentiles: { p50: 0, p90: 0, p95: 0, p99: 0 },
      };
    }

    const durations = filteredMetrics
      .filter(m => m.duration !== undefined)
      .map(m => m.duration as number)
      .sort((a, b) => a - b);

    const cacheHits = filteredMetrics.filter(m => m.cacheHit === true).length;
    const cacheTotal = filteredMetrics.filter(
      m => m.cacheHit !== undefined
    ).length;

    const errors = filteredMetrics.filter(m => (m.errorCount || 0) > 0).length;

    const dataSizes = filteredMetrics
      .filter(m => m.dataSize !== undefined)
      .map(m => m.dataSize as number);

    return {
      totalRequests: filteredMetrics.length,
      averageDuration:
        durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      cacheHitRate: cacheTotal > 0 ? cacheHits / cacheTotal : 0,
      errorRate: errors / filteredMetrics.length,
      averageDataSize:
        dataSizes.reduce((a, b) => a + b, 0) / dataSizes.length || 0,
      percentiles: {
        p50: this.percentile(durations, 0.5),
        p90: this.percentile(durations, 0.9),
        p95: this.percentile(durations, 0.95),
        p99: this.percentile(durations, 0.99),
      },
    };
  }

  /**
   * Calculate percentile
   */
  private percentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;

    const index = Math.ceil(sortedArray.length * percentile) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(olderThanMs: number = 3600000): number {
    const cutoff = Date.now() - olderThanMs;
    const initialLength = this.metrics.length;

    this.metrics = this.metrics.filter(m => m.startTime > cutoff);

    return initialLength - this.metrics.length;
  }

  /**
   * Get current metrics count
   */
  getMetricsCount(): number {
    return this.metrics.length;
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private measurements: Array<{
    timestamp: number;
    usage: NodeJS.MemoryUsage;
  }> = [];
  private maxMeasurements: number;

  constructor(maxMeasurements: number = 1000) {
    this.maxMeasurements = maxMeasurements;
  }

  /**
   * Record current memory usage
   */
  recordUsage(): NodeJS.MemoryUsage {
    const usage = process.memoryUsage();
    const measurement = {
      timestamp: Date.now(),
      usage,
    };

    this.measurements.push(measurement);

    // Keep measurements array from growing too large
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift();
    }

    return usage;
  }

  /**
   * Get memory usage statistics
   */
  getStats(): {
    current: NodeJS.MemoryUsage;
    peak: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    average: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    if (this.measurements.length === 0) {
      const current = process.memoryUsage();
      return {
        current,
        peak: current,
        average: current,
        trend: 'stable',
      };
    }

    const current = this.measurements[this.measurements.length - 1].usage;

    // Calculate peak values
    const peak = this.measurements.reduce(
      (max, measurement) => ({
        rss: Math.max(max.rss, measurement.usage.rss),
        heapTotal: Math.max(max.heapTotal, measurement.usage.heapTotal),
        heapUsed: Math.max(max.heapUsed, measurement.usage.heapUsed),
        external: Math.max(max.external, measurement.usage.external),
      }),
      { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }
    );

    // Calculate average values
    const total = this.measurements.reduce(
      (sum, measurement) => ({
        rss: sum.rss + measurement.usage.rss,
        heapTotal: sum.heapTotal + measurement.usage.heapTotal,
        heapUsed: sum.heapUsed + measurement.usage.heapUsed,
        external: sum.external + measurement.usage.external,
      }),
      { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }
    );

    const average = {
      rss: total.rss / this.measurements.length,
      heapTotal: total.heapTotal / this.measurements.length,
      heapUsed: total.heapUsed / this.measurements.length,
      external: total.external / this.measurements.length,
    };

    // Calculate trend
    const trend = this.calculateTrend();

    return {
      current,
      peak,
      average,
      trend,
    };
  }

  /**
   * Calculate memory usage trend
   */
  private calculateTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.measurements.length < 10) return 'stable';

    const recent = this.measurements.slice(-10);
    const older = this.measurements.slice(-20, -10);

    if (older.length === 0) return 'stable';

    const recentAvg =
      recent.reduce((sum, m) => sum + m.usage.heapUsed, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, m) => sum + m.usage.heapUsed, 0) / older.length;

    const changePercent = (recentAvg - olderAvg) / olderAvg;

    if (changePercent > 0.1) return 'increasing';
    if (changePercent < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Check if memory usage is critical
   */
  isCritical(thresholdMB: number = 1000): boolean {
    const current = process.memoryUsage();
    return current.heapUsed / 1024 / 1024 > thresholdMB;
  }

  /**
   * Force garbage collection if available
   */
  forceGC(): boolean {
    if (global.gc) {
      global.gc();
      return true;
    }
    return false;
  }
}

// Export singleton instances for easy use
export const performanceCollector = new PerformanceCollector();
export const memoryMonitor = new MemoryMonitor();
export const globalCache = new IntelligentCache(5000, 300000, 'LRU');

// Default throttle configurations
export const defaultThrottleConfig: ThrottleConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyGenerator: (operation: string) => operation,
};

export const aggressiveThrottleConfig: ThrottleConfig = {
  maxRequests: 20,
  windowMs: 60000,
  keyGenerator: (operation: string, params?: unknown) =>
    `${operation}_${(params as Record<string, unknown>)?.instance || 'default'}`,
};
