/**
 * Context-aware tools with simplified approach
 * Provides intelligent response adaptation and user context management
 */

import {
  contextAwareAdapter,
  ContextData,
  AdaptationRule,
} from '../utils/context-aware.js';
import { ValidationError } from '../errors/index.js';
import { ToolDefinition } from '../types/tool-types.js';

/**
 * Set user context for intelligent response adaptation
 */
export async function setUserContext(args: {
  sessionId: string;
  userPreferences?: {
    dataFormat?: 'detailed' | 'standard' | 'basic';
    includeMetadata?: boolean;
    maxResults?: number;
    timezone?: string;
    language?: string;
  };
  workspaceContext?: {
    id?: string;
    name?: string;
    permissions?: string[];
  };
  instanceContext?: {
    name?: string;
    features?: string[];
    limits?: Record<string, number>;
  };
}): Promise<unknown> {
  const { sessionId, userPreferences, workspaceContext, instanceContext } =
    args;

  // Validate session ID
  if (!sessionId || typeof sessionId !== 'string') {
    throw new ValidationError(
      'sessionId is required and must be a string',
      'sessionId'
    );
  }

  try {
    const contextData: ContextData = {
      sessionId,
      ...(userPreferences && { userPreferences }),
      ...(workspaceContext && { workspaceContext }),
      ...(instanceContext && { instanceContext }),
    };

    contextAwareAdapter.setContext(sessionId, contextData);

    return {
      success: true,
      sessionId,
      message: 'User context set successfully',
      context: {
        dataFormat: userPreferences?.dataFormat || 'standard',
        workspace: workspaceContext?.name || 'default',
        permissions: workspaceContext?.permissions?.length || 0,
        features: instanceContext?.features?.length || 0,
      },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to set user context: ${errorMessage}`);
  }
}

/**
 * Get current user context
 */
export async function getUserContext(args: {
  sessionId: string;
}): Promise<unknown> {
  const { sessionId } = args;

  // Validate session ID
  if (!sessionId || typeof sessionId !== 'string') {
    throw new ValidationError(
      'sessionId is required and must be a string',
      'sessionId'
    );
  }

  try {
    const context = contextAwareAdapter.getContext(sessionId);

    return {
      sessionId,
      context: {
        userPreferences: context.userPreferences || null,
        workspaceContext: context.workspaceContext || null,
        instanceContext: context.instanceContext || null,
        recentQueries: context.recentQueries || [],
        hasContext: Object.keys(context).length > 0,
      },
      stats: contextAwareAdapter.getContextStats(),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get user context: ${errorMessage}`);
  }
}

/**
 * Adapt response based on user context
 */
export async function adaptResponse(args: {
  sessionId: string;
  query: string;
  originalResponse: unknown;
  includeGuidance?: boolean;
  includeSuggestions?: boolean;
}): Promise<unknown> {
  const {
    sessionId,
    query,
    originalResponse,
    includeGuidance = true,
    includeSuggestions = true,
  } = args;

  // Validate inputs
  if (!sessionId || typeof sessionId !== 'string') {
    throw new ValidationError(
      'sessionId is required and must be a string',
      'sessionId'
    );
  }

  if (!query || typeof query !== 'string') {
    throw new ValidationError(
      'query is required and must be a string',
      'query'
    );
  }

  try {
    const adaptedResponse = contextAwareAdapter.adaptResponse(
      sessionId,
      query,
      originalResponse
    );

    // Optionally filter response content
    const response: Record<string, unknown> = {
      adapted: true,
      sessionId,
      query,
      data: adaptedResponse.data,
    };

    if (adaptedResponse.metadata) {
      response.metadata = adaptedResponse.metadata;
    }

    if (includeGuidance && adaptedResponse.userGuidance) {
      response.userGuidance = adaptedResponse.userGuidance;
    }

    if (includeSuggestions && adaptedResponse.metadata?.suggestions) {
      response.suggestions = adaptedResponse.metadata.suggestions;
    }

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to adapt response: ${errorMessage}`);
  }
}

/**
 * Add custom adaptation rule
 */
export async function addAdaptationRule(args: {
  sessionId?: string;
  name: string;
  description: string;
  priority: number;
  condition: {
    type: 'query_contains' | 'response_size' | 'context_field' | 'custom';
    value?: string;
    threshold?: number;
    field?: string;
  };
  adaptation: {
    type: 'summarize' | 'simplify' | 'enhance' | 'filter' | 'custom';
    parameters?: Record<string, unknown>;
  };
}): Promise<unknown> {
  const { sessionId, name, description, priority, condition, adaptation } =
    args;

  // Validate inputs
  if (!name || typeof name !== 'string') {
    throw new ValidationError('name is required and must be a string', 'name');
  }

  if (!description || typeof description !== 'string') {
    throw new ValidationError(
      'description is required and must be a string',
      'description'
    );
  }

  if (typeof priority !== 'number' || priority < 1 || priority > 10) {
    throw new ValidationError(
      'priority must be a number between 1 and 10',
      'priority'
    );
  }

  try {
    // Create adaptation rule based on simplified configuration
    const rule: AdaptationRule = {
      condition: createConditionFunction(condition),
      adaptation: createAdaptationFunction(adaptation),
      priority,
      description: `${name}: ${description}`,
    };

    contextAwareAdapter.addAdaptationRule(rule);

    return {
      success: true,
      rule: {
        name,
        description,
        priority,
        condition: condition.type,
        adaptation: adaptation.type,
      },
      message: 'Adaptation rule added successfully',
      ...(sessionId && { sessionId }),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to add adaptation rule: ${errorMessage}`);
  }
}

/**
 * Clear user context
 */
export async function clearUserContext(args: {
  sessionId: string;
}): Promise<unknown> {
  const { sessionId } = args;

  // Validate session ID
  if (!sessionId || typeof sessionId !== 'string') {
    throw new ValidationError(
      'sessionId is required and must be a string',
      'sessionId'
    );
  }

  try {
    contextAwareAdapter.clearContext(sessionId);

    return {
      success: true,
      sessionId,
      message: 'User context cleared successfully',
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to clear user context: ${errorMessage}`);
  }
}

/**
 * Get context-aware system statistics
 */
export async function getContextStats(
  _args: Record<string, unknown> = {}
): Promise<unknown> {
  try {
    const stats = contextAwareAdapter.getContextStats();

    // Clean up old contexts as part of stats gathering
    const cleanedCount = contextAwareAdapter.cleanOldContexts();

    return {
      system: 'context-aware',
      stats: {
        totalSessions: stats.totalSessions,
        activeRules: stats.activeRules,
        averageAdaptations: stats.averageAdaptations,
        cleanedSessions: cleanedCount,
      },
      status: 'operational',
      timestamp: new Date().toISOString(),
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get context stats: ${errorMessage}`);
  }
}

/**
 * Create condition function from simplified configuration
 */
function createConditionFunction(condition: {
  type: 'query_contains' | 'response_size' | 'context_field' | 'custom';
  value?: string;
  threshold?: number;
  field?: string;
}): (context: ContextData, query: string, response: unknown) => boolean {
  switch (condition.type) {
    case 'query_contains':
      return (_context, query, _response) => {
        return condition.value
          ? query.toLowerCase().includes(condition.value.toLowerCase())
          : false;
      };

    case 'response_size':
      return (_context, _query, response) => {
        const threshold = condition.threshold || 1000;
        const responseSize = JSON.stringify(response).length;
        return responseSize > threshold;
      };

    case 'context_field':
      return (context, _query, _response) => {
        if (!condition.field) return false;
        const fieldPath = condition.field.split('.');
        let current: unknown = context;
        for (const field of fieldPath) {
          if (typeof current === 'object' && current !== null) {
            current = (current as Record<string, unknown>)[field];
          } else {
            return false;
          }
        }
        return condition.value
          ? current === condition.value
          : current !== undefined;
      };

    case 'custom':
    default:
      return () => false; // Default to false for custom conditions
  }
}

/**
 * Create adaptation function from simplified configuration
 */
function createAdaptationFunction(adaptation: {
  type: 'summarize' | 'simplify' | 'enhance' | 'filter' | 'custom';
  parameters?: Record<string, unknown>;
}): (context: ContextData, query: string, response: unknown) => any {
  switch (adaptation.type) {
    case 'summarize':
      return (context, query, response) => ({
        data: Array.isArray(response) ? response.slice(0, 10) : response,
        metadata: {
          responseFormat: 'summarized',
          adaptations: ['Response summarized due to custom rule'],
        },
      });

    case 'simplify':
      return (context, query, response) => ({
        data:
          typeof response === 'object' && response !== null
            ? { id: (response as any).id, name: (response as any).name }
            : response,
        metadata: {
          responseFormat: 'simplified',
          adaptations: ['Response simplified due to custom rule'],
        },
      });

    case 'enhance':
      return (context, query, response) => ({
        data: response,
        metadata: {
          responseFormat: 'enhanced',
          adaptations: ['Response enhanced due to custom rule'],
        },
        userGuidance: {
          tips: ['This response was enhanced with additional context'],
        },
      });

    case 'filter':
      return (context, query, response) => ({
        data: response,
        metadata: {
          responseFormat: 'filtered',
          adaptations: ['Response filtered due to custom rule'],
        },
      });

    case 'custom':
    default:
      return (context, query, response) => ({
        data: response,
        metadata: {
          responseFormat: 'custom',
          adaptations: ['Custom adaptation applied'],
        },
      });
  }
}

/**
 * Tool handler function
 */
export async function handleContextAwareTool(
  operation: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (operation) {
    case 'set_user_context':
      return setUserContext(args as Parameters<typeof setUserContext>[0]);

    case 'get_user_context':
      return getUserContext(args as Parameters<typeof getUserContext>[0]);

    case 'adapt_response':
      return adaptResponse(args as Parameters<typeof adaptResponse>[0]);

    case 'add_adaptation_rule':
      return addAdaptationRule(args as Parameters<typeof addAdaptationRule>[0]);

    case 'clear_user_context':
      return clearUserContext(args as Parameters<typeof clearUserContext>[0]);

    case 'get_context_stats':
      return getContextStats(args);

    default:
      throw new ValidationError(
        `Unknown context-aware operation: ${operation}`,
        'operation'
      );
  }
}

/**
 * Setup context-aware tools definitions
 */
export function setupContextAwareTools(): ToolDefinition[] {
  return [
    {
      name: 'set_user_context',
      description:
        'Set user context for intelligent response adaptation and personalization.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Unique session identifier for context tracking',
          },
          userPreferences: {
            type: 'object',
            properties: {
              dataFormat: {
                type: 'string',
                enum: ['detailed', 'standard', 'basic'],
                description: 'Preferred response detail level',
                default: 'standard',
              },
              includeMetadata: {
                type: 'boolean',
                description: 'Include metadata in responses',
                default: true,
              },
              maxResults: {
                type: 'number',
                description: 'Maximum number of results to return',
                minimum: 1,
                maximum: 1000,
                default: 50,
              },
              timezone: {
                type: 'string',
                description: 'User timezone (e.g., "America/New_York")',
              },
              language: {
                type: 'string',
                description: 'Preferred language code (e.g., "en", "es")',
              },
            },
            description: 'User preferences for response formatting',
          },
          workspaceContext: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Workspace identifier',
              },
              name: {
                type: 'string',
                description: 'Workspace name',
              },
              permissions: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of user permissions in workspace',
              },
            },
            description: 'Current workspace context',
          },
          instanceContext: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'ProductBoard instance name',
              },
              features: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Available instance features',
              },
              limits: {
                type: 'object',
                description: 'Instance-specific limits',
                additionalProperties: {
                  type: 'number',
                },
              },
            },
            description: 'ProductBoard instance context',
          },
        },
        required: ['sessionId'],
      },
    },
    {
      name: 'get_user_context',
      description: 'Retrieve current user context and preferences.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Session identifier to get context for',
          },
        },
        required: ['sessionId'],
      },
    },
    {
      name: 'adapt_response',
      description:
        'Adapt a response based on user context and preferences. Provides intelligent formatting and guidance.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Session identifier for context lookup',
          },
          query: {
            type: 'string',
            description: 'Original query that generated the response',
          },
          originalResponse: {
            description: 'Original response data to adapt',
            additionalProperties: true,
          },
          includeGuidance: {
            type: 'boolean',
            description: 'Include user guidance in adapted response',
            default: true,
          },
          includeSuggestions: {
            type: 'boolean',
            description: 'Include suggestions in adapted response',
            default: true,
          },
        },
        required: ['sessionId', 'query', 'originalResponse'],
      },
    },
    {
      name: 'add_adaptation_rule',
      description:
        'Add custom adaptation rule for response processing. Allows personalized response handling.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Optional session identifier for rule context',
          },
          name: {
            type: 'string',
            description: 'Rule name for identification',
          },
          description: {
            type: 'string',
            description: 'Rule description explaining its purpose',
          },
          priority: {
            type: 'number',
            description:
              'Rule priority (1-10, higher numbers = higher priority)',
            minimum: 1,
            maximum: 10,
          },
          condition: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: [
                  'query_contains',
                  'response_size',
                  'context_field',
                  'custom',
                ],
                description: 'Type of condition to check',
              },
              value: {
                type: 'string',
                description:
                  'Value to match (for query_contains, context_field)',
              },
              threshold: {
                type: 'number',
                description: 'Threshold value (for response_size)',
              },
              field: {
                type: 'string',
                description: 'Context field path (for context_field)',
              },
            },
            required: ['type'],
            description: 'Condition that triggers this rule',
          },
          adaptation: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['summarize', 'simplify', 'enhance', 'filter', 'custom'],
                description: 'Type of adaptation to apply',
              },
              parameters: {
                type: 'object',
                description: 'Additional parameters for adaptation',
                additionalProperties: true,
              },
            },
            required: ['type'],
            description: 'Adaptation to apply when condition matches',
          },
        },
        required: [
          'name',
          'description',
          'priority',
          'condition',
          'adaptation',
        ],
      },
    },
    {
      name: 'clear_user_context',
      description:
        'Clear all context data for a session. Useful for privacy or starting fresh.',
      inputSchema: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string',
            description: 'Session identifier to clear context for',
          },
        },
        required: ['sessionId'],
      },
    },
    {
      name: 'get_context_stats',
      description:
        'Get system statistics about context-aware features usage and performance.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];
}
