/**
 * Universal search tool for all Productboard entities
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import {
  SearchParams,
  SearchResponse,
  SearchContext,
} from '../types/search-types.js';
import { SearchEngine } from '../utils/search-engine.js';
import { SearchMessageGenerator } from '../utils/search-messaging.js';
import { ValidationError, ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Setup search tool definition
 */
export function setupSearchTools() {
  return [
    {
      name: 'search',
      description:
        'Universal search across all Productboard entities with flexible filtering and output control',
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
              'releases',
              'release_groups',
              'objectives',
              'initiatives',
              'key_results',
              'custom_fields',
              'webhooks',
              'plugin_integrations',
              'jira_integrations',
            ],
            description: 'Type of entity to search',
          },
          filters: {
            type: 'object',
            description:
              'Field filters as key-value pairs. Use empty string "" to find missing/empty fields',
            additionalProperties: true,
          },
          operators: {
            type: 'object',
            description:
              'Operators for each filter field: equals, contains, isEmpty, startsWith, endsWith',
            additionalProperties: {
              type: 'string',
              enum: [
                'equals',
                'contains',
                'isEmpty',
                'startsWith',
                'endsWith',
                'before',
                'after',
              ],
            },
          },
          output: {
            oneOf: [
              {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Array of specific fields to return (supports dot notation like "owner.email")',
              },
              {
                type: 'string',
                enum: ['ids-only', 'summary', 'full'],
                description:
                  'Preset output modes: ids-only returns simple array, summary returns key fields, full returns complete objects',
              },
            ],
            description:
              'Controls which fields are returned. Overrides detail parameter when specified.',
          },
          limit: {
            type: 'number',
            minimum: 1,
            maximum: 100,
            description: 'Maximum number of results to return (default: 50)',
            default: 50,
          },
          startWith: {
            type: 'number',
            minimum: 0,
            description: 'Offset for pagination (default: 0)',
            default: 0,
          },
          detail: {
            type: 'string',
            enum: ['basic', 'standard', 'full'],
            description:
              'Detail level when output parameter not specified (default: standard)',
            default: 'standard',
          },
          includeSubData: {
            type: 'boolean',
            description: 'Include nested relationship data (default: false)',
            default: false,
          },
          instance: {
            type: 'string',
            description: 'Productboard instance name (optional)',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID (optional)',
          },
        },
        required: ['entityType'],
      },
    },
  ];
}

/**
 * Handle search tool execution
 */
export async function handleSearchTool(name: string, args: SearchParams) {
  if (name !== 'search') {
    throw new Error(`Unknown search tool: ${name}`);
  }

  console.error(
    '[DEBUG handleSearchTool] Received args.output:',
    args.output,
    'type:',
    typeof args.output,
    'isArray:',
    Array.isArray(args.output)
  );

  // Fix stringified array output parameter (MCP protocol issue workaround)
  const fixedArgs = { ...args };

  if (fixedArgs.output && typeof fixedArgs.output === 'string') {
    console.error(
      '[DEBUG handleSearchTool] Attempting to parse stringified output:',
      fixedArgs.output
    );
    // Try to parse as JSON if it looks like an array
    if (fixedArgs.output.startsWith('[') && fixedArgs.output.endsWith(']')) {
      try {
        const parsed = JSON.parse(fixedArgs.output);
        if (Array.isArray(parsed)) {
          fixedArgs.output = parsed;
          console.error(
            '[DEBUG handleSearchTool] Successfully parsed output to array:',
            parsed
          );
        }
      } catch (e) {
        console.error(
          '[DEBUG handleSearchTool] Failed to parse output:',
          (e as Error).message
        );
      }
    }
  }

  console.error(
    '[DEBUG handleSearchTool] Final args.output:',
    fixedArgs.output,
    'type:',
    typeof fixedArgs.output,
    'isArray:',
    Array.isArray(fixedArgs.output)
  );

  try {
    return await performSearch(fixedArgs);
  } catch (error: any) {
    console.error('Search error:', error);

    if (
      error instanceof ValidationError ||
      error instanceof ProductboardError
    ) {
      throw error;
    }

    throw new ProductboardError(
      ErrorCode.InternalError,
      `Search failed: ${error.message}`,
      error
    );
  }
}

/**
 * Main search execution function
 */
async function performSearch(params: SearchParams) {
  console.error(
    '[DEBUG performSearch] Received params.output:',
    params.output,
    'type:',
    typeof params.output,
    'isArray:',
    Array.isArray(params.output)
  );

  return await withContext(
    async context => {
      const searchEngine = new SearchEngine();
      const messageGenerator = new SearchMessageGenerator();

      // Validate and normalize parameters
      const normalizedParams =
        await searchEngine.validateAndNormalizeParams(params);

      console.error(
        '[DEBUG performSearch] After normalization, output:',
        normalizedParams.output,
        'type:',
        typeof normalizedParams.output,
        'isArray:',
        Array.isArray(normalizedParams.output)
      );

      // Execute search against appropriate entity endpoint
      const rawResults = await searchEngine.executeEntitySearch(
        context,
        normalizedParams
      );

      // Apply filtering and output formatting
      console.error(
        '[DEBUG performSearch] Before processResults, normalizedParams.output:',
        normalizedParams.output,
        'type:',
        typeof normalizedParams.output,
        'isArray:',
        Array.isArray(normalizedParams.output)
      );

      const processedResults = await searchEngine.processResults(
        rawResults,
        normalizedParams
      );

      // Build search context for messaging
      const searchContext: SearchContext = {
        entityType: normalizedParams.entityType,
        totalRecords: processedResults.totalRecords,
        returnedRecords: processedResults.data.length,
        filters: normalizedParams.filters,
        output: normalizedParams.output,
        detail: normalizedParams.detail,
        warnings: processedResults.warnings,
        hasMore: processedResults.hasMore,
        queryTimeMs: processedResults.queryTimeMs,
      };

      // Generate intelligent response message
      const message = messageGenerator.generateMessage(searchContext);
      const hints = messageGenerator.generateContextualHints(searchContext);

      // Build final response
      const response: SearchResponse = {
        success: true,
        data: processedResults.data,
        metadata: {
          totalRecords: processedResults.totalRecords,
          returnedRecords: processedResults.data.length,
          searchCriteria: {
            entityType: normalizedParams.entityType,
            filters: normalizedParams.filters,
            output: normalizedParams.output,
            detail: normalizedParams.detail,
          },
          message,
          ...(processedResults.warnings.length > 0 && {
            warnings: processedResults.warnings,
          }),
          ...(hints.length > 0 && { hints }),
          performance: {
            queryTimeMs: processedResults.queryTimeMs,
            cacheHit: processedResults.cacheHit || false,
          },
        },
        ...(processedResults.hasMore && {
          pagination: {
            hasNext: true,
            nextOffset:
              (normalizedParams.startWith || 0) +
              (normalizedParams.limit || 50),
            totalPages: Math.ceil(
              processedResults.totalRecords / (normalizedParams.limit || 50)
            ),
          },
        }),
      };

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response),
          },
        ],
      };
    },
    params.instance,
    params.workspaceId
  );
}
