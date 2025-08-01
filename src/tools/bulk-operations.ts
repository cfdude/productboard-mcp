/**
 * Bulk operations tools with diff-only focus
 * Provides efficient bulk update capabilities with change tracking
 */

import { bulkOperationsEngine, DiffUtils } from '../utils/bulk-operations.js';
import { ValidationError } from '../errors/index.js';
import { ToolDefinition } from '../types/tool-types.js';
import { withContext } from '../utils/tool-wrapper.js';

// Import tool handlers for entity operations
import { handleFeaturesTool } from './features.js';
import { handleNotesTool } from './notes.js';
import { handleCompaniesTool } from './companies.js';
import { handleUsersTool } from './users.js';
import { handleObjectivesTool } from './objectives.js';

/**
 * Perform batch updates with diff tracking
 */
export async function performBulkUpdate(args: {
  entityType: 'features' | 'notes' | 'companies' | 'users' | 'objectives';
  updates: Array<{
    id: string;
    changes: Record<string, unknown>;
    expectedVersion?: string;
    metadata?: Record<string, unknown>;
  }>;
  batchSize?: number;
  concurrency?: number;
  continueOnError?: boolean;
  validateBeforeUpdate?: boolean;
  trackChanges?: boolean;
  diffFormat?: 'summary' | 'detailed' | 'compact';
  includeUnchanged?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<unknown> {
  const {
    entityType,
    updates,
    batchSize = 25,
    concurrency = 3,
    continueOnError = true,
    validateBeforeUpdate = true,
    trackChanges = true,
    diffFormat = 'summary',
    includeUnchanged = false,
  } = args;

  // Validate entity type
  const supportedTypes = [
    'features',
    'notes',
    'companies',
    'users',
    'objectives',
  ];
  if (!supportedTypes.includes(entityType)) {
    throw new ValidationError(
      `Unsupported entity type. Must be one of: ${supportedTypes.join(', ')}`,
      'entityType'
    );
  }

  // Validate updates
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new ValidationError('updates must be a non-empty array', 'updates');
  }

  if (updates.length > 500) {
    throw new ValidationError(
      'Maximum 500 updates allowed per bulk operation',
      'updates'
    );
  }

  try {
    // Get the appropriate entity handler
    const entityHandler = getEntityHandler(entityType);

    // Perform bulk update
    const result = await bulkOperationsEngine.performBulkUpdate(
      {
        entityType,
        updates,
        options: {
          batchSize: Math.min(batchSize, 50),
          concurrency: Math.min(concurrency, 5),
          continueOnError,
          validateBeforeUpdate,
          trackChanges,
        },
      },
      entityHandler
    );

    // Format response
    const response = {
      entityType,
      summary: result.summary,
      successful: result.successful,
      failed: result.failed.map(f => ({
        id: f.id,
        error: f.error,
      })),
      ...(result.skipped.length > 0 && { skipped: result.skipped }),
    };

    // Add change tracking if enabled
    if (trackChanges && result.changes.length > 0) {
      const entityDiffs = result.changes.map(change => {
        const diff = bulkOperationsEngine.createEntityDiff(
          change.id,
          change.before,
          change.after
        );
        return {
          ...diff,
          entityType,
        };
      });

      // Add diff report
      (response as Record<string, unknown>).changeReport =
        DiffUtils.createDiffReport(entityDiffs, diffFormat);

      // Add detailed changes if requested or format is detailed
      if (diffFormat === 'detailed' || includeUnchanged) {
        (response as Record<string, unknown>).changes = result.changes.map(
          change => ({
            id: change.id,
            diff: change.diff,
            ...(includeUnchanged && {
              before: change.before,
              after: change.after,
            }),
          })
        );
      }

      // Add significant changes summary
      const significantChanges = entityDiffs.filter(
        diff => diff.significantChanges.length > 0
      );
      if (significantChanges.length > 0) {
        (response as Record<string, unknown>).significantChanges =
          significantChanges.map(diff => ({
            id: diff.id,
            fields: diff.significantChanges,
          }));
      }
    }

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Bulk update failed: ${errorMessage}`);
  }
}

/**
 * Compare entities and generate diff report without making changes
 */
export async function compareEntities(args: {
  entityType: 'features' | 'notes' | 'companies' | 'users' | 'objectives';
  comparisons: Array<{
    id: string;
    proposedChanges: Record<string, unknown>;
  }>;
  diffFormat?: 'summary' | 'detailed' | 'compact';
  highlightSignificant?: boolean;
  includeUnchanged?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<unknown> {
  const {
    entityType,
    comparisons,
    diffFormat = 'summary',
    highlightSignificant = true,
    includeUnchanged = false,
  } = args;

  // Validate inputs
  if (!Array.isArray(comparisons) || comparisons.length === 0) {
    throw new ValidationError(
      'comparisons must be a non-empty array',
      'comparisons'
    );
  }

  if (comparisons.length > 100) {
    throw new ValidationError(
      'Maximum 100 comparisons allowed per request',
      'comparisons'
    );
  }

  try {
    const entityHandler = getEntityHandler(entityType);
    const diffs = [];

    // Process each comparison
    for (const comparison of comparisons) {
      try {
        // Get current entity data
        const currentResponse = await entityHandler(`get_${entityType}`, {
          id: comparison.id,
          detail: 'standard',
        });

        const currentData = extractEntityData(currentResponse);
        const proposedData = { ...currentData, ...comparison.proposedChanges };

        // Generate diff
        const diff = bulkOperationsEngine.createEntityDiff(
          comparison.id,
          currentData,
          proposedData
        );

        if (diff.hasChanges || includeUnchanged) {
          diffs.push({
            ...diff,
            entityType,
            proposedChanges: comparison.proposedChanges,
          });
        }
      } catch (error) {
        diffs.push({
          id: comparison.id,
          entityType,
          error:
            error instanceof Error ? error.message : 'Failed to fetch entity',
          hasChanges: false,
          changeCount: 0,
          operations: [],
          significantChanges: [],
        });
      }
    }

    // Generate response
    const response = {
      entityType,
      totalComparisons: comparisons.length,
      entitiesWithChanges: diffs.filter(d => d.hasChanges).length,
      totalChanges: diffs.reduce((sum, d) => sum + (d.changeCount || 0), 0),
      diffReport: DiffUtils.createDiffReport(diffs, diffFormat),
    };

    // Add detailed diffs
    if (diffFormat === 'detailed') {
      (response as Record<string, unknown>).diffs = diffs.map(diff => ({
        id: diff.id,
        hasChanges: diff.hasChanges,
        changeCount: diff.changeCount,
        operations: diff.operations,
        ...(highlightSignificant &&
          diff.significantChanges.length > 0 && {
            significantChanges: diff.significantChanges,
          }),
      }));
    }

    // Add significant changes summary
    if (highlightSignificant) {
      const significantDiffs = diffs.filter(
        d => d.significantChanges && d.significantChanges.length > 0
      );
      if (significantDiffs.length > 0) {
        (response as Record<string, unknown>).significantChanges =
          significantDiffs.map(diff => ({
            id: diff.id,
            fields: diff.significantChanges,
          }));
      }
    }

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Entity comparison failed: ${errorMessage}`);
  }
}

/**
 * Validate bulk update request without executing
 */
export async function validateBulkUpdate(args: {
  entityType: 'features' | 'notes' | 'companies' | 'users' | 'objectives';
  updates: Array<{
    id: string;
    changes: Record<string, unknown>;
    expectedVersion?: string;
  }>;
  checkExistence?: boolean;
  validateFields?: boolean;
  instance?: string;
  workspaceId?: string;
}): Promise<unknown> {
  const {
    entityType,
    updates,
    checkExistence = true,
    validateFields = true,
  } = args;

  // Validate inputs
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new ValidationError('updates must be a non-empty array', 'updates');
  }

  const validationResults = {
    valid: true,
    totalUpdates: updates.length,
    validUpdates: 0,
    invalidUpdates: 0,
    errors: [] as Array<{
      id: string;
      field?: string;
      error: string;
      severity: 'error' | 'warning';
    }>,
    warnings: [] as Array<{
      id: string;
      field?: string;
      message: string;
    }>,
    summary: '',
  };

  try {
    const entityHandler = getEntityHandler(entityType);

    // Validate each update
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      let updateValid = true;

      // Basic validation
      if (!update.id || typeof update.id !== 'string') {
        validationResults.errors.push({
          id: update.id || `update[${i}]`,
          error: 'ID is required and must be a string',
          severity: 'error',
        });
        updateValid = false;
      }

      if (!update.changes || typeof update.changes !== 'object') {
        validationResults.errors.push({
          id: update.id || `update[${i}]`,
          error: 'Changes object is required',
          severity: 'error',
        });
        updateValid = false;
      }

      if (Object.keys(update.changes || {}).length === 0) {
        validationResults.errors.push({
          id: update.id || `update[${i}]`,
          error: 'Changes cannot be empty',
          severity: 'error',
        });
        updateValid = false;
      }

      // Check entity existence
      if (checkExistence && update.id) {
        try {
          await entityHandler(`get_${entityType}`, {
            id: update.id,
            detail: 'basic',
          });
        } catch {
          validationResults.errors.push({
            id: update.id,
            error: 'Entity not found',
            severity: 'error',
          });
          updateValid = false;
        }
      }

      // Field validation (basic checks)
      if (validateFields && update.changes) {
        for (const [field, value] of Object.entries(update.changes)) {
          if (field === 'id') {
            validationResults.warnings.push({
              id: update.id,
              field,
              message: 'ID field in changes will be ignored',
            });
          }

          if (value === null || value === undefined) {
            validationResults.warnings.push({
              id: update.id,
              field,
              message: 'Null/undefined value may clear field',
            });
          }
        }
      }

      if (updateValid) {
        validationResults.validUpdates++;
      } else {
        validationResults.invalidUpdates++;
      }
    }

    // Set overall validity
    validationResults.valid = validationResults.invalidUpdates === 0;

    // Generate summary
    if (validationResults.valid) {
      validationResults.summary = `All ${validationResults.totalUpdates} updates are valid`;
      if (validationResults.warnings.length > 0) {
        validationResults.summary += ` (${validationResults.warnings.length} warnings)`;
      }
    } else {
      validationResults.summary = `${validationResults.invalidUpdates} of ${validationResults.totalUpdates} updates failed validation`;
    }

    return validationResults;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Bulk validation failed: ${errorMessage}`);
  }
}

/**
 * Get entity handler for the specified type
 */
function getEntityHandler(
  entityType: string
): (operation: string, params: Record<string, unknown>) => Promise<unknown> {
  return async (operation: string, params: Record<string, unknown>) => {
    return await withContext(async () => {
      switch (entityType) {
        case 'features':
          return await handleFeaturesTool(operation, params);
        case 'notes':
          return await handleNotesTool(operation, params);
        case 'companies':
          return await handleCompaniesTool(operation, params);
        case 'users':
          return await handleUsersTool(operation, params);
        case 'objectives':
          return await handleObjectivesTool(operation, params);
        default:
          throw new ValidationError(
            `Unsupported entity type: ${entityType}`,
            'entityType'
          );
      }
    });
  };
}

/**
 * Extract entity data from tool response
 */
function extractEntityData(response: unknown): Record<string, unknown> {
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
 * Tool handler function
 */
export async function handleBulkOperationsTool(
  operation: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (operation) {
    case 'perform_bulk_update':
      return performBulkUpdate(args as Parameters<typeof performBulkUpdate>[0]);

    case 'compare_entities':
      return compareEntities(args as Parameters<typeof compareEntities>[0]);

    case 'validate_bulk_update':
      return validateBulkUpdate(
        args as Parameters<typeof validateBulkUpdate>[0]
      );

    default:
      throw new ValidationError(
        `Unknown bulk operations operation: ${operation}`,
        'operation'
      );
  }
}

/**
 * Setup bulk operations tools definitions
 */
export function setupBulkOperationsTools(): ToolDefinition[] {
  return [
    {
      name: 'perform_bulk_update',
      description:
        'Perform batch updates with diff tracking and change analysis. Supports features, notes, companies, users, and objectives.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: ['features', 'notes', 'companies', 'users', 'objectives'],
            description: 'Type of entities to update',
          },
          updates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Entity ID to update',
                },
                changes: {
                  type: 'object',
                  description: 'Fields to update with new values',
                  additionalProperties: true,
                },
                expectedVersion: {
                  type: 'string',
                  description: 'Expected version for optimistic locking',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata for the update',
                  additionalProperties: true,
                },
              },
              required: ['id', 'changes'],
            },
            description: 'Array of updates to perform (max 500)',
            maxItems: 500,
          },
          batchSize: {
            type: 'number',
            description: 'Number of updates per batch (default: 25, max: 50)',
            minimum: 1,
            maximum: 50,
            default: 25,
          },
          concurrency: {
            type: 'number',
            description: 'Number of concurrent batches (default: 3, max: 5)',
            minimum: 1,
            maximum: 5,
            default: 3,
          },
          continueOnError: {
            type: 'boolean',
            description: 'Continue processing if some updates fail',
            default: true,
          },
          validateBeforeUpdate: {
            type: 'boolean',
            description: 'Validate all updates before processing',
            default: true,
          },
          trackChanges: {
            type: 'boolean',
            description: 'Track and report changes made',
            default: true,
          },
          diffFormat: {
            type: 'string',
            enum: ['summary', 'detailed', 'compact'],
            description: 'Format for change reporting',
            default: 'summary',
          },
          includeUnchanged: {
            type: 'boolean',
            description: 'Include entities that had no changes in response',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID',
          },
        },
        required: ['entityType', 'updates'],
      },
    },
    {
      name: 'compare_entities',
      description:
        'Compare current entity state with proposed changes without making updates. Shows what would change.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: ['features', 'notes', 'companies', 'users', 'objectives'],
            description: 'Type of entities to compare',
          },
          comparisons: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Entity ID to compare',
                },
                proposedChanges: {
                  type: 'object',
                  description:
                    'Proposed changes to compare against current state',
                  additionalProperties: true,
                },
              },
              required: ['id', 'proposedChanges'],
            },
            description: 'Array of entities to compare (max 100)',
            maxItems: 100,
          },
          diffFormat: {
            type: 'string',
            enum: ['summary', 'detailed', 'compact'],
            description: 'Format for diff reporting',
            default: 'summary',
          },
          highlightSignificant: {
            type: 'boolean',
            description:
              'Highlight significant changes (status, priority, etc.)',
            default: true,
          },
          includeUnchanged: {
            type: 'boolean',
            description: 'Include entities with no changes in results',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID',
          },
        },
        required: ['entityType', 'comparisons'],
      },
    },
    {
      name: 'validate_bulk_update',
      description:
        'Validate bulk update request without executing. Checks for errors and potential issues.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: ['features', 'notes', 'companies', 'users', 'objectives'],
            description: 'Type of entities to validate',
          },
          updates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Entity ID to update',
                },
                changes: {
                  type: 'object',
                  description: 'Fields to update with new values',
                  additionalProperties: true,
                },
                expectedVersion: {
                  type: 'string',
                  description: 'Expected version for optimistic locking',
                },
              },
              required: ['id', 'changes'],
            },
            description: 'Array of updates to validate',
          },
          checkExistence: {
            type: 'boolean',
            description: 'Check if entities exist before validation',
            default: true,
          },
          validateFields: {
            type: 'boolean',
            description: 'Perform field-level validation',
            default: true,
          },
          instance: {
            type: 'string',
            description: 'ProductBoard instance name',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID',
          },
        },
        required: ['entityType', 'updates'],
      },
    },
  ];
}
