/**
 * Simplified bulk operations with diff-only focus
 * Provides efficient bulk update capabilities with change tracking
 */

import { ValidationError } from '../errors/index.js';
import { performanceCollector } from './performance-monitor.js';

export interface BulkUpdateRequest {
  entityType: string;
  updates: Array<{
    id: string;
    changes: Record<string, unknown>;
    expectedVersion?: string;
    metadata?: Record<string, unknown>;
  }>;
  options?: {
    batchSize?: number;
    concurrency?: number;
    continueOnError?: boolean;
    validateBeforeUpdate?: boolean;
    trackChanges?: boolean;
  };
}

export interface BulkUpdateResult {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
    originalData?: Record<string, unknown>;
  }>;
  skipped: string[];
  changes: Array<{
    id: string;
    before: Record<string, unknown>;
    after: Record<string, unknown>;
    diff: Record<string, unknown>;
  }>;
  summary: {
    total: number;
    successCount: number;
    failureCount: number;
    skippedCount: number;
    changesCount: number;
  };
}

export interface DiffOperation {
  operation: 'add' | 'remove' | 'change';
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface EntityDiff {
  id: string;
  entityType: string;
  operations: DiffOperation[];
  hasChanges: boolean;
  changeCount: number;
  significantChanges: string[];
}

/**
 * Simplified bulk operations engine with diff-only focus
 */
export class BulkOperationsEngine {
  private defaultBatchSize = 25;
  private defaultConcurrency = 3;
  private maxBatchSize = 50;

  /**
   * Perform bulk updates with diff tracking
   */
  async performBulkUpdate(
    request: BulkUpdateRequest,
    entityHandler: (
      operation: string,
      params: Record<string, unknown>
    ) => Promise<unknown>
  ): Promise<BulkUpdateResult> {
    const metric = performanceCollector.start('bulk_update');

    try {
      const { entityType, updates, options = {} } = request;

      const {
        batchSize = this.defaultBatchSize,
        concurrency = this.defaultConcurrency,
        continueOnError = true,
        validateBeforeUpdate = true,
        trackChanges = true,
      } = options;

      // Validate inputs
      if (!updates || updates.length === 0) {
        throw new ValidationError('Updates array cannot be empty', 'updates');
      }

      if (updates.length > 500) {
        throw new ValidationError(
          'Maximum 500 updates allowed per bulk operation',
          'updates'
        );
      }

      const result: BulkUpdateResult = {
        successful: [],
        failed: [],
        skipped: [],
        changes: [],
        summary: {
          total: updates.length,
          successCount: 0,
          failureCount: 0,
          skippedCount: 0,
          changesCount: 0,
        },
      };

      // Pre-validate updates if requested
      if (validateBeforeUpdate) {
        const validationErrors = this.validateUpdates(updates);
        if (validationErrors.length > 0) {
          throw new ValidationError(
            `Validation failed: ${validationErrors.join(', ')}`,
            'updates'
          );
        }
      }

      // Process updates in batches
      const batches = this.createBatches(
        updates,
        Math.min(batchSize, this.maxBatchSize)
      );

      for (let i = 0; i < batches.length; i += concurrency) {
        const batchSlice = batches.slice(i, i + concurrency);
        const batchPromises = batchSlice.map(batch =>
          this.processBatch(batch, entityType, entityHandler, trackChanges)
        );

        const batchResults = await Promise.allSettled(batchPromises);

        for (const batchResult of batchResults) {
          if (batchResult.status === 'fulfilled') {
            this.mergeBatchResult(result, batchResult.value);
          } else if (!continueOnError) {
            throw new Error(`Batch processing failed: ${batchResult.reason}`);
          } else {
            console.warn('Batch processing failed:', batchResult.reason);
          }
        }
      }

      // Update summary
      result.summary.successCount = result.successful.length;
      result.summary.failureCount = result.failed.length;
      result.summary.skippedCount = result.skipped.length;
      result.summary.changesCount = result.changes.length;

      performanceCollector.recordDataSize(
        metric,
        JSON.stringify(result).length
      );
      performanceCollector.end(metric, true);

      return result;
    } catch (error) {
      performanceCollector.end(metric, false);
      throw error;
    }
  }

  /**
   * Process a single batch of updates
   */
  private async processBatch(
    batch: Array<{
      id: string;
      changes: Record<string, unknown>;
      expectedVersion?: string;
      metadata?: Record<string, unknown>;
    }>,
    entityType: string,
    entityHandler: (
      operation: string,
      params: Record<string, unknown>
    ) => Promise<unknown>,
    trackChanges: boolean
  ): Promise<Partial<BulkUpdateResult>> {
    const batchResult: Partial<BulkUpdateResult> = {
      successful: [],
      failed: [],
      skipped: [],
      changes: [],
    };

    for (const update of batch) {
      try {
        let beforeData: Record<string, unknown> = {};

        // Get current data if tracking changes
        if (trackChanges) {
          try {
            const currentResponse = await entityHandler(`get_${entityType}`, {
              id: update.id,
              detail: 'basic',
            });
            beforeData = this.extractEntityData(currentResponse);
          } catch (error) {
            // If entity doesn't exist, skip or create new
            if (this.isNotFoundError(error)) {
              batchResult.skipped?.push(update.id);
              continue;
            }
            throw error;
          }
        }

        // Apply the update
        const updateParams = {
          id: update.id,
          ...update.changes,
          ...(update.expectedVersion && {
            expectedVersion: update.expectedVersion,
          }),
        };

        const updateResponse = await entityHandler(
          `update_${entityType}`,
          updateParams
        );
        const afterData = this.extractEntityData(updateResponse);

        batchResult.successful?.push(update.id);

        // Track changes if requested
        if (trackChanges) {
          const diff = this.createEntityDiff(update.id, beforeData, afterData);
          if (diff.hasChanges) {
            batchResult.changes?.push({
              id: update.id,
              before: beforeData,
              after: afterData,
              diff: this.generateDiffObject(diff),
            });
          }
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        batchResult.failed?.push({
          id: update.id,
          error: errorMessage,
          originalData: update.changes,
        });
      }
    }

    return batchResult;
  }

  /**
   * Generate entity diff between before and after states
   */
  createEntityDiff(
    id: string,
    before: Record<string, unknown>,
    after: Record<string, unknown>
  ): EntityDiff {
    const operations: DiffOperation[] = [];
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
      const oldValue = before[key];
      const newValue = after[key];

      if (!(key in before) && key in after) {
        // Field was added
        operations.push({
          operation: 'add',
          path: key,
          newValue,
        });
      } else if (key in before && !(key in after)) {
        // Field was removed
        operations.push({
          operation: 'remove',
          path: key,
          oldValue,
        });
      } else if (this.valuesAreDifferent(oldValue, newValue)) {
        // Field was changed
        operations.push({
          operation: 'change',
          path: key,
          oldValue,
          newValue,
        });
      }
    }

    const significantChanges = operations
      .filter(op => this.isSignificantChange(op))
      .map(op => op.path);

    return {
      id,
      entityType: 'entity', // Will be set by caller
      operations,
      hasChanges: operations.length > 0,
      changeCount: operations.length,
      significantChanges,
    };
  }

  /**
   * Compare field values for differences
   */
  private valuesAreDifferent(oldValue: unknown, newValue: unknown): boolean {
    // Handle null/undefined
    if (oldValue === null || oldValue === undefined) {
      return newValue !== null && newValue !== undefined;
    }
    if (newValue === null || newValue === undefined) {
      return oldValue !== null && oldValue !== undefined;
    }

    // Handle arrays
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length !== newValue.length) return true;
      return oldValue.some((item, index) =>
        this.valuesAreDifferent(item, newValue[index])
      );
    }

    // Handle objects
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      const oldKeys = Object.keys(oldValue as Record<string, unknown>);
      const newKeys = Object.keys(newValue as Record<string, unknown>);

      if (oldKeys.length !== newKeys.length) return true;

      return oldKeys.some(key =>
        this.valuesAreDifferent(
          (oldValue as Record<string, unknown>)[key],
          (newValue as Record<string, unknown>)[key]
        )
      );
    }

    // Handle primitives
    return oldValue !== newValue;
  }

  /**
   * Determine if a change is significant (should be highlighted)
   */
  private isSignificantChange(operation: DiffOperation): boolean {
    const significantFields = [
      'status',
      'name',
      'title',
      'summary',
      'priority',
      'assignee',
      'dueDate',
      'startDate',
      'endDate',
      'archived',
      'deleted',
    ];

    return significantFields.includes(operation.path.toLowerCase());
  }

  /**
   * Generate diff object for API response
   */
  private generateDiffObject(diff: EntityDiff): Record<string, unknown> {
    const diffObj: Record<string, unknown> = {};

    for (const operation of diff.operations) {
      switch (operation.operation) {
        case 'add':
          diffObj[`+${operation.path}`] = operation.newValue;
          break;
        case 'remove':
          diffObj[`-${operation.path}`] = operation.oldValue;
          break;
        case 'change':
          diffObj[`~${operation.path}`] = {
            from: operation.oldValue,
            to: operation.newValue,
          };
          break;
      }
    }

    return diffObj;
  }

  /**
   * Validate updates before processing
   */
  private validateUpdates(
    updates: Array<{ id: string; changes: Record<string, unknown> }>
  ): string[] {
    const errors: string[] = [];

    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];

      if (!update.id || typeof update.id !== 'string') {
        errors.push(`Update ${i}: id is required and must be a string`);
      }

      if (!update.changes || typeof update.changes !== 'object') {
        errors.push(`Update ${i}: changes is required and must be an object`);
      }

      if (Object.keys(update.changes || {}).length === 0) {
        errors.push(`Update ${i}: changes cannot be empty`);
      }
    }

    return errors;
  }

  /**
   * Extract entity data from API response
   */
  private extractEntityData(response: unknown): Record<string, unknown> {
    if (typeof response === 'object' && response !== null) {
      const typedResponse = response as { content?: Array<{ text?: string }> };
      if (typedResponse.content?.[0]?.text) {
        try {
          const parsed = JSON.parse(typedResponse.content[0].text);
          return parsed.data || parsed || {};
        } catch {
          return {};
        }
      }
    }
    return {};
  }

  /**
   * Check if error indicates entity not found
   */
  private isNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.toLowerCase().includes('not found') ||
        error.message.toLowerCase().includes('404')
      );
    }
    return false;
  }

  /**
   * Merge batch result into main result
   */
  private mergeBatchResult(
    mainResult: BulkUpdateResult,
    batchResult: Partial<BulkUpdateResult>
  ): void {
    if (batchResult.successful) {
      mainResult.successful.push(...batchResult.successful);
    }
    if (batchResult.failed) {
      mainResult.failed.push(...batchResult.failed);
    }
    if (batchResult.skipped) {
      mainResult.skipped.push(...batchResult.skipped);
    }
    if (batchResult.changes) {
      mainResult.changes.push(...batchResult.changes);
    }
  }

  /**
   * Create batches from array of updates
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    return batches;
  }
}

/**
 * Utility functions for diff operations
 */
export class DiffUtils {
  /**
   * Generate human-readable summary of changes
   */
  static generateChangeSummary(changes: EntityDiff[]): string {
    if (changes.length === 0) {
      return 'No changes detected';
    }

    const totalChanges = changes.reduce(
      (sum, change) => sum + change.changeCount,
      0
    );
    const entitiesWithChanges = changes.filter(
      change => change.hasChanges
    ).length;
    const significantChangesCount = changes.reduce(
      (sum, change) => sum + change.significantChanges.length,
      0
    );

    let summary = `${entitiesWithChanges} entities changed, ${totalChanges} total modifications`;

    if (significantChangesCount > 0) {
      summary += `, ${significantChangesCount} significant changes`;
    }

    return summary;
  }

  /**
   * Filter changes by significance
   */
  static filterSignificantChanges(changes: EntityDiff[]): EntityDiff[] {
    return changes.filter(change => change.significantChanges.length > 0);
  }

  /**
   * Group changes by operation type
   */
  static groupChangesByOperation(
    changes: EntityDiff[]
  ): Record<string, DiffOperation[]> {
    const grouped: Record<string, DiffOperation[]> = {
      add: [],
      remove: [],
      change: [],
    };

    for (const change of changes) {
      for (const operation of change.operations) {
        grouped[operation.operation].push(operation);
      }
    }

    return grouped;
  }

  /**
   * Create diff report in various formats
   */
  static createDiffReport(
    changes: EntityDiff[],
    format: 'summary' | 'detailed' | 'compact' = 'summary'
  ): string {
    if (changes.length === 0) {
      return 'No changes detected.';
    }

    switch (format) {
      case 'summary':
        return this.generateChangeSummary(changes);

      case 'compact':
        return changes
          .filter(change => change.hasChanges)
          .map(change => `${change.id}: ${change.changeCount} changes`)
          .join(', ');

      case 'detailed':
        return changes
          .filter(change => change.hasChanges)
          .map(change => {
            const operations = change.operations
              .map(op => `  ${op.operation} ${op.path}`)
              .join('\n');
            return `${change.id} (${change.changeCount} changes):\n${operations}`;
          })
          .join('\n\n');

      default:
        return this.generateChangeSummary(changes);
    }
  }
}

// Export singleton instance
export const bulkOperationsEngine = new BulkOperationsEngine();
