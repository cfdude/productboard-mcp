/**
 * High-performance lightweight tools for status checking, validation, and monitoring
 */

import { lightweightQueryEngine } from '../utils/lightweight-query-engine.js';
import {
  performanceCollector,
  memoryMonitor,
  globalCache,
} from '../utils/performance-monitor.js';
import { ValidationError } from '../errors/index.js';
import { ToolDefinition } from '../types/tool-types.js';

/**
 * Check status for multiple entities with minimal data transfer
 */
export async function checkEntityStatus(args: {
  entityType:
    | 'features'
    | 'notes'
    | 'companies'
    | 'users'
    | 'products'
    | 'components';
  ids: string[];
  fields?: string[];
  format?: 'summary' | 'detailed' | 'counts';
  useCache?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<unknown> {
  const {
    entityType,
    ids,
    fields = ['id', 'status', 'updatedAt'],
    format = 'summary',
    useCache = true,
  } = args;

  // Validate inputs
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationError('ids must be a non-empty array', 'ids');
  }

  if (ids.length > 500) {
    throw new ValidationError('Maximum 500 IDs allowed per request', 'ids');
  }

  const validEntityTypes = [
    'features',
    'notes',
    'companies',
    'users',
    'products',
    'components',
  ];
  if (!validEntityTypes.includes(entityType)) {
    throw new ValidationError(
      `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}`,
      'entityType'
    );
  }

  try {
    const options = {
      fields,
      cache: useCache,
      cacheTtl: 180000, // 3 minutes
    };

    const result = await lightweightQueryEngine.checkMultipleStatus(
      entityType,
      ids,
      options
    );

    // Format response based on requested format
    switch (format) {
      case 'summary':
        return {
          summary: result.summary,
          total: result.total,
          statusDistribution: result.byStatus,
          lastUpdated: result.lastUpdated,
        };

      case 'counts':
        return {
          total: result.total,
          byStatus: result.byStatus,
        };

      case 'detailed':
        return result;

      default:
        return result;
    }
  } catch (error: any) {
    throw new Error(`Status check failed: ${error.message}`);
  }
}

/**
 * Validate existence of multiple entities
 */
export async function validateEntityExistence(args: {
  entityType:
    | 'features'
    | 'notes'
    | 'companies'
    | 'users'
    | 'products'
    | 'components';
  ids: string[];
  returnMissing?: boolean;
  returnExisting?: boolean;
  useCache?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const {
    entityType,
    ids,
    returnMissing = true,
    returnExisting = false,
    useCache = true,
  } = args;

  // Validate inputs
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationError('ids must be a non-empty array', 'ids');
  }

  if (ids.length > 1000) {
    throw new ValidationError(
      'Maximum 1000 IDs allowed per existence check',
      'ids'
    );
  }

  try {
    const options = {
      cache: useCache,
      cacheTtl: 300000, // 5 minutes - existence is more stable
    };

    const result = await lightweightQueryEngine.validateExistence(
      entityType,
      ids,
      options
    );

    // Format response based on what caller wants
    const response: any = {
      total: result.total,
      existingCount: result.existingCount,
      missingCount: result.missingCount,
    };

    if (returnMissing) {
      response.missing = result.missing;
    }

    if (returnExisting) {
      response.existing = result.existing;
    }

    // Add helpful summary
    if (result.missingCount > 0) {
      response.summary = `${result.missingCount} of ${result.total} entities not found`;
    } else {
      response.summary = `All ${result.total} entities exist`;
    }

    return response;
  } catch (error: any) {
    throw new Error(`Existence validation failed: ${error.message}`);
  }
}

/**
 * Track progress for batch operations using custom markers
 */
export async function trackBatchProgress(args: {
  entityType:
    | 'features'
    | 'notes'
    | 'companies'
    | 'users'
    | 'products'
    | 'components';
  ids: string[];
  progressMarker: string;
  includeDetails?: boolean;
  groupBy?: 'status' | 'progress';
  useCache?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const {
    entityType,
    ids,
    progressMarker,
    includeDetails = false,
    groupBy,
    useCache = true,
  } = args;

  // Validate inputs
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ValidationError('ids must be a non-empty array', 'ids');
  }

  if (!progressMarker || typeof progressMarker !== 'string') {
    throw new ValidationError(
      'progressMarker must be a non-empty string',
      'progressMarker'
    );
  }

  if (ids.length > 500) {
    throw new ValidationError(
      'Maximum 500 IDs allowed per progress check',
      'ids'
    );
  }

  try {
    const options = {
      cache: useCache,
      cacheTtl: 120000, // 2 minutes - progress changes frequently
    };

    const result = await lightweightQueryEngine.trackBatchProgress(
      entityType,
      ids,
      progressMarker,
      options
    );

    const response: any = {
      completed: result.completed,
      pending: result.pending,
      total: result.total,
      summary: result.summary,
      completionRate: Math.round((result.completed / result.total) * 100),
    };

    if (includeDetails && result.details) {
      response.details = result.details;
    }

    if (groupBy && result.details) {
      response.groupedBy = groupProgressDetails(result.details, groupBy);
    }

    return response;
  } catch (error: any) {
    throw new Error(`Progress tracking failed: ${error.message}`);
  }
}

/**
 * Get entity counts without fetching full data
 */
export async function getEntityCounts(args: {
  entityType:
    | 'features'
    | 'notes'
    | 'companies'
    | 'users'
    | 'products'
    | 'components';
  filters?: Record<string, any>;
  useCache?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const { entityType, filters = {}, useCache = true } = args;

  try {
    const options = {
      cache: useCache,
      cacheTtl: 300000, // 5 minutes
    };

    const result = await lightweightQueryEngine.getEntityCount(
      entityType,
      filters,
      options
    );

    return {
      entityType,
      count: result.count,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      timestamp: result.timestamp,
      cached: useCache,
    };
  } catch (error: any) {
    throw new Error(`Entity count failed: ${error.message}`);
  }
}

/**
 * Perform system health check
 */
export async function performHealthCheck(args: {
  includeDetails?: boolean;
  includeCacheStats?: boolean;
  includeMemoryStats?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const {
    includeDetails = true,
    includeCacheStats = false,
    includeMemoryStats = false,
  } = args;

  try {
    const healthResult = await lightweightQueryEngine.healthCheck();

    const response: any = {
      status: healthResult.status,
      responseTime: healthResult.responseTime,
      timestamp: healthResult.timestamp,
      checks: healthResult.checks,
    };

    if (includeDetails) {
      response.details = {
        apiLatency: healthResult.details.apiLatency,
        memoryUsage: {
          heapUsed: Math.round(
            healthResult.details.memoryUsage.heapUsed / 1024 / 1024
          ),
          heapTotal: Math.round(
            healthResult.details.memoryUsage.heapTotal / 1024 / 1024
          ),
          rss: Math.round(healthResult.details.memoryUsage.rss / 1024 / 1024),
        },
      };
    }

    if (includeCacheStats) {
      response.cache = globalCache.getStats();
    }

    if (includeMemoryStats) {
      const memStats = memoryMonitor.getStats();
      response.memory = {
        current: {
          heapUsed: Math.round(memStats.current.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memStats.current.heapTotal / 1024 / 1024),
        },
        trend: memStats.trend,
        isCritical: memoryMonitor.isCritical(),
      };
    }

    return response;
  } catch (error: any) {
    return {
      status: 'unhealthy',
      responseTime: -1,
      timestamp: Date.now(),
      error: error.message,
      checks: {
        api: false,
        cache: false,
        memory: false,
      },
    };
  }
}

/**
 * Get performance statistics
 */
export async function getPerformanceStats(args: {
  operation?: string;
  includePercentiles?: boolean;
  clearOldMetrics?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const {
    operation,
    includePercentiles = true,
    clearOldMetrics = false,
  } = args;

  try {
    // Clear old metrics if requested
    if (clearOldMetrics) {
      const cleared = performanceCollector.clearOldMetrics(3600000); // 1 hour
      console.log(`Cleared ${cleared} old performance metrics`);
    }

    const stats = performanceCollector.getStats(operation);

    const response: any = {
      operation: operation || 'all',
      totalRequests: stats.totalRequests,
      averageDuration: Math.round(stats.averageDuration),
      cacheHitRate: Math.round(stats.cacheHitRate * 100),
      errorRate: Math.round(stats.errorRate * 100),
      averageDataSize: Math.round(stats.averageDataSize),
    };

    if (includePercentiles && stats.totalRequests > 0) {
      response.percentiles = {
        p50: Math.round(stats.percentiles.p50),
        p90: Math.round(stats.percentiles.p90),
        p95: Math.round(stats.percentiles.p95),
        p99: Math.round(stats.percentiles.p99),
      };
    }

    // Add memory cleanup info
    const memoryStats = memoryMonitor.getStats();
    response.memoryTrend = memoryStats.trend;

    return response;
  } catch (error: any) {
    throw new Error(`Performance stats failed: ${error.message}`);
  }
}

/**
 * Clear caches and perform cleanup
 */
export async function performCleanup(args: {
  clearCache?: boolean;
  clearMetrics?: boolean;
  forceGC?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<any> {
  const { clearCache = false, clearMetrics = false, forceGC = false } = args;

  const results: any = {
    timestamp: Date.now(),
    actions: [],
  };

  try {
    if (clearCache) {
      const beforeSize = globalCache.size();
      globalCache.clear();
      results.actions.push({
        action: 'cache_cleared',
        beforeSize,
        afterSize: 0,
      });
    }

    if (clearMetrics) {
      const beforeCount = performanceCollector.getMetricsCount();
      const cleared = performanceCollector.clearOldMetrics(0); // Clear all
      results.actions.push({
        action: 'metrics_cleared',
        beforeCount,
        clearedCount: cleared,
      });
    }

    if (forceGC) {
      const beforeMemory = process.memoryUsage();
      const gcSuccess = memoryMonitor.forceGC();
      const afterMemory = process.memoryUsage();

      results.actions.push({
        action: 'garbage_collection',
        success: gcSuccess,
        memoryBefore: Math.round(beforeMemory.heapUsed / 1024 / 1024),
        memoryAfter: Math.round(afterMemory.heapUsed / 1024 / 1024),
        freedMB: Math.round(
          (beforeMemory.heapUsed - afterMemory.heapUsed) / 1024 / 1024
        ),
      });
    }

    return results;
  } catch (error: any) {
    results.error = error.message;
    return results;
  }
}

/**
 * Group progress details by specified field
 */
function groupProgressDetails(
  details: Array<{
    id: string;
    status: string;
    progress: boolean;
    marker?: string;
  }>,
  groupBy: 'status' | 'progress'
): Record<string, any> {
  const groups: Record<string, any> = {};

  for (const detail of details) {
    const key =
      groupBy === 'status'
        ? detail.status
        : detail.progress
          ? 'completed'
          : 'pending';

    if (!groups[key]) {
      groups[key] = {
        count: 0,
        ids: [],
      };
    }

    groups[key].count++;
    groups[key].ids.push(detail.id);
  }

  return groups;
}

/**
 * Tool handler function
 */
export async function handlePerformanceTool(
  operation: string,
  args: any
): Promise<any> {
  switch (operation) {
    case 'check_entity_status':
      return checkEntityStatus(args);

    case 'validate_entity_existence':
      return validateEntityExistence(args);

    case 'track_batch_progress':
      return trackBatchProgress(args);

    case 'get_entity_counts':
      return getEntityCounts(args);

    case 'perform_health_check':
      return performHealthCheck(args);

    case 'get_performance_stats':
      return getPerformanceStats(args);

    case 'perform_cleanup':
      return performCleanup(args);

    default:
      throw new ValidationError(
        `Unknown performance operation: ${operation}`,
        'operation'
      );
  }
}

/**
 * Setup performance tools definitions
 */
export function setupPerformanceTools(): ToolDefinition[] {
  return [
    {
      name: 'check_entity_status',
      description:
        'Check status for multiple entities with minimal data transfer. Optimized for quick status overview of large entity sets.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: [
              'features',
              'notes',
              'companies',
              'users',
              'products',
              'components',
            ],
            description: 'Type of entities to check status for',
          },
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of entity IDs to check (max 500)',
            maxItems: 500,
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description: 'Fields to include in status check',
            default: ['id', 'status', 'updatedAt'],
          },
          format: {
            type: 'string',
            enum: ['summary', 'detailed', 'counts'],
            description: 'Response format level',
            default: 'summary',
          },
          useCache: {
            type: 'boolean',
            description: 'Whether to use intelligent caching',
            default: true,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
        required: ['entityType', 'ids'],
      },
    },
    {
      name: 'validate_entity_existence',
      description:
        'Validate existence of multiple entities efficiently. Returns missing/existing entity lists.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: [
              'features',
              'notes',
              'companies',
              'users',
              'products',
              'components',
            ],
            description: 'Type of entities to validate',
          },
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of entity IDs to validate (max 1000)',
            maxItems: 1000,
          },
          returnMissing: {
            type: 'boolean',
            description: 'Include missing entity IDs in response',
            default: true,
          },
          returnExisting: {
            type: 'boolean',
            description: 'Include existing entity IDs in response',
            default: false,
          },
          useCache: {
            type: 'boolean',
            description: 'Whether to use intelligent caching',
            default: true,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
        required: ['entityType', 'ids'],
      },
    },
    {
      name: 'track_batch_progress',
      description:
        'Track progress for batch operations using custom markers (e.g., status:completed, customField).',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: [
              'features',
              'notes',
              'companies',
              'users',
              'products',
              'components',
            ],
            description: 'Type of entities to track',
          },
          ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of entity IDs to track (max 500)',
            maxItems: 500,
          },
          progressMarker: {
            type: 'string',
            description:
              'Progress marker (e.g., "status:completed", "customField", "approved")',
          },
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed progress info per entity',
            default: false,
          },
          groupBy: {
            type: 'string',
            enum: ['status', 'progress'],
            description: 'Group results by status or progress',
          },
          useCache: {
            type: 'boolean',
            description: 'Whether to use intelligent caching',
            default: true,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
        required: ['entityType', 'ids', 'progressMarker'],
      },
    },
    {
      name: 'get_entity_counts',
      description:
        'Get entity counts without fetching full data. Optimized for dashboard metrics and overview statistics.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: [
              'features',
              'notes',
              'companies',
              'users',
              'products',
              'components',
            ],
            description: 'Type of entities to count',
          },
          filters: {
            type: 'object',
            description: 'Optional filters to apply to count',
            additionalProperties: true,
          },
          useCache: {
            type: 'boolean',
            description: 'Whether to use intelligent caching',
            default: true,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
        required: ['entityType'],
      },
    },
    {
      name: 'perform_health_check',
      description:
        'Perform comprehensive system health check including API connectivity, cache status, and memory usage.',
      inputSchema: {
        type: 'object',
        properties: {
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed health metrics',
            default: true,
          },
          includeCacheStats: {
            type: 'boolean',
            description: 'Include cache performance statistics',
            default: false,
          },
          includeMemoryStats: {
            type: 'boolean',
            description: 'Include detailed memory usage stats',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
      },
    },
    {
      name: 'get_performance_stats',
      description:
        'Get detailed performance statistics including response times, cache hit rates, and percentiles.',
      inputSchema: {
        type: 'object',
        properties: {
          operation: {
            type: 'string',
            description:
              'Specific operation to get stats for (omit for all operations)',
          },
          includePercentiles: {
            type: 'boolean',
            description:
              'Include response time percentiles (p50, p90, p95, p99)',
            default: true,
          },
          clearOldMetrics: {
            type: 'boolean',
            description:
              'Clear metrics older than 1 hour before returning stats',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
      },
    },
    {
      name: 'perform_cleanup',
      description:
        'Clear caches and perform system cleanup. Useful for memory management and troubleshooting.',
      inputSchema: {
        type: 'object',
        properties: {
          clearCache: {
            type: 'boolean',
            description: 'Clear intelligent cache',
            default: false,
          },
          clearMetrics: {
            type: 'boolean',
            description: 'Clear performance metrics',
            default: false,
          },
          forceGC: {
            type: 'boolean',
            description: 'Force garbage collection (if available)',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: { type: 'string', description: 'Workspace ID' },
        },
      },
    },
  ];
}
