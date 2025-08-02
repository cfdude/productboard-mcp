/**
 * Standard parameter types for all Productboard tools
 */
// Constants are referenced in JSDoc comments
// import { RESPONSE_LIMITS, API_LIMITS } from '../constants.js';

export type DetailLevel = 'basic' | 'standard' | 'full';

export type OutputFormat = 'json' | 'markdown' | 'csv' | 'summary';

export type CustomFieldInclusion = 'all' | 'onlyWithValues' | 'none';

export interface UpdateFeatureParams extends StandardGetParams {
  /**
   * Feature ID to update
   */
  id: string;

  /**
   * Updated feature name
   */
  name?: string;

  /**
   * Updated feature description
   */
  description?: string;

  /**
   * Archive status
   */
  archived?: boolean;

  /**
   * Component ID (to move feature to a different component)
   */
  componentId?: string;

  /**
   * Product ID (to move feature to a different product)
   */
  productId?: string;

  /**
   * Parent feature ID (for sub-features)
   */
  parentId?: string;

  /**
   * Feature status update
   */
  status?: {
    id?: string;
    name?: string;
  };

  /**
   * Feature owner update
   */
  owner?: {
    email?: string;
  };

  /**
   * Feature timeframe with start and end dates
   */
  timeframe?: {
    startDate?: string;
    endDate?: string;
    granularity?: string;
  };

  /**
   * Custom fields - pass custom field names as additional parameters
   * @example { "T-Shirt Sizing": "Large", "Business Value": "High" }
   */
  [customField: string]: unknown;

  /**
   * Productboard instance name (optional)
   */
  instance?: string;

  /**
   * Workspace ID (optional)
   */
  workspaceId?: string;
}

export interface ResponseOptimizationParams {
  /**
   * Maximum character length for entire response (truncates long fields)
   * @minimum ${RESPONSE_LIMITS.MIN_RESPONSE_LENGTH}
   * @maximum ${RESPONSE_LIMITS.MAX_RESPONSE_LENGTH}
   */
  maxLength?: number;

  /**
   * Fields to truncate if they exceed length limits
   * @example ["description", "notes", "content"]
   */
  truncateFields?: string[];

  /**
   * Indicator to show when fields are truncated
   * @default "..."
   */
  truncateIndicator?: string;

  /**
   * Include description field (can be large)
   * @default true
   */
  includeDescription?: boolean;

  /**
   * Custom field inclusion strategy
   * - all: Include all custom fields
   * - onlyWithValues: Only include custom fields with non-empty values
   * - none: Exclude all custom fields
   * @default 'all'
   */
  includeCustomFieldsStrategy?: CustomFieldInclusion;

  /**
   * Include relationship/link data (can be extensive)
   * @default true
   */
  includeLinks?: boolean;

  /**
   * Include fields with null or empty values
   * @default true
   */
  includeEmpty?: boolean;

  /**
   * Include metadata fields (timestamps, versions, etc.)
   * @default true
   */
  includeMetadata?: boolean;
}

export interface StandardListParams extends ResponseOptimizationParams {
  /**
   * Maximum number of records to return
   * @default ${API_LIMITS.DEFAULT_PAGE_SIZE}
   * @minimum ${API_LIMITS.MIN_PAGE_SIZE}
   * @maximum ${API_LIMITS.MAX_PAGE_SIZE}
   */
  limit?: number;

  /**
   * Number of records to skip before returning results
   * @default ${API_LIMITS.DEFAULT_OFFSET}
   * @minimum ${API_LIMITS.MIN_OFFSET}
   */
  startWith?: number;

  /**
   * Level of detail to return in response
   * - basic: Essential fields only (id, name, etc.)
   * - standard: Common fields including relationships
   * - full: All available fields
   * @default 'basic'
   * @deprecated Use 'fields' parameter for precise field selection
   */
  detail?: DetailLevel;

  /**
   * Include nested sub-data like related entities
   * @default false
   */
  includeSubData?: boolean;

  /**
   * Specific fields to include in response (overrides detail level)
   * Supports dot notation for nested fields (e.g., "timeframe.startDate")
   * @example ["id", "name", "status.name", "owner.email"]
   */
  fields?: string[];

  /**
   * Fields to exclude from response
   * @example ["description", "links", "createdAt"]
   */
  exclude?: string[];

  /**
   * Validate field names and return suggestions for invalid fields
   * @default true
   */
  validateFields?: boolean;

  /**
   * Output format for response data
   * - json: Standard JSON response (default)
   * - markdown: Human-readable markdown format
   * - csv: Comma-separated values for tabular data
   * - summary: Condensed overview format
   * @default 'json'
   */
  outputFormat?: OutputFormat;
}

export interface StandardGetParams extends ResponseOptimizationParams {
  /**
   * Level of detail to return in response
   * - basic: Essential fields only (id, name, etc.)
   * - standard: Common fields including relationships
   * - full: All available fields
   * @default 'standard'
   * @deprecated Use 'fields' parameter for precise field selection
   */
  detail?: DetailLevel;

  /**
   * Include nested sub-data like related entities
   * @default false
   */
  includeSubData?: boolean;

  /**
   * Specific fields to include in response (overrides detail level)
   * Supports dot notation for nested fields (e.g., "timeframe.startDate")
   * @example ["id", "name", "status.name", "owner.email"]
   */
  fields?: string[];

  /**
   * Fields to exclude from response
   * @example ["description", "links", "createdAt"]
   */
  exclude?: string[];

  /**
   * Validate field names and return suggestions for invalid fields
   * @default true
   */
  validateFields?: boolean;

  /**
   * Output format for response data
   * - json: Standard JSON response (default)
   * - markdown: Human-readable markdown format
   * - csv: Comma-separated values for tabular data
   * - summary: Condensed overview format
   * @default 'json'
   */
  outputFormat?: OutputFormat;
}

export interface EnterpriseErrorInfo {
  isEnterpriseFeature: boolean;
  message: string;
  originalError?: unknown;
}

// Field mapping for detail levels by entity type
export const DetailFieldMappings = {
  company: {
    basic: ['id', 'name', 'domain'],
    standard: ['id', 'name', 'domain', 'description'],
    full: [
      'id',
      'name',
      'domain',
      'description',
      'sourceOrigin',
      'sourceRecordId',
    ],
  },
  component: {
    basic: ['id', 'name', 'description'],
    standard: ['id', 'name', 'description', 'owner', 'createdAt'],
    full: [
      'id',
      'name',
      'description',
      'owner',
      'parent',
      'links',
      'createdAt',
      'updatedAt',
    ],
  },
  feature: {
    basic: ['id', 'name', 'type', 'status.name'],
    standard: [
      'id',
      'name',
      'type',
      'status',
      'archived',
      'owner.email',
      'timeframe.startDate',
      'timeframe.endDate',
    ],
    full: [
      'id',
      'name',
      'type',
      'status',
      'archived',
      'owner',
      'timeframe',
      'links',
    ],
  },
  user: {
    basic: ['id', 'email', 'name'],
    standard: ['id', 'email', 'name', 'role'],
    full: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt'],
  },
  note: {
    basic: ['id', 'title', 'createdAt'],
    standard: ['id', 'title', 'content', 'user', 'tags', 'createdAt'],
    full: [
      'id',
      'title',
      'content',
      'user',
      'company',
      'tags',
      'followers',
      'links',
      'createdAt',
      'updatedAt',
    ],
  },
  product: {
    basic: ['id', 'name'],
    standard: ['id', 'name', 'description', 'createdAt'],
    full: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
  },
  releaseGroup: {
    basic: ['id', 'name'],
    standard: ['id', 'name', 'description', 'isDefault'],
    full: ['id', 'name', 'description', 'isDefault', 'createdAt', 'updatedAt'],
  },
  release: {
    basic: ['id', 'name', 'state'],
    standard: [
      'id',
      'name',
      'state',
      'description',
      'releaseGroup',
      'timeframe',
    ],
    full: [
      'id',
      'name',
      'state',
      'description',
      'releaseGroup',
      'timeframe',
      'createdAt',
      'updatedAt',
    ],
  },
  featureReleaseAssignment: {
    basic: ['feature.id', 'release.id', 'isAssigned'],
    standard: ['feature', 'release', 'isAssigned'],
    full: ['feature', 'release', 'isAssigned', 'createdAt', 'updatedAt'],
  },
  webhook: {
    basic: ['id', 'eventType', 'url', 'active'],
    standard: ['id', 'eventType', 'url', 'active', 'secret', 'createdAt'],
    full: [
      'id',
      'eventType',
      'url',
      'active',
      'secret',
      'createdAt',
      'updatedAt',
      'lastDelivery',
    ],
  },
  objective: {
    basic: ['id', 'name', 'owner'],
    standard: ['id', 'name', 'description', 'owner', 'timeframe'],
    full: [
      'id',
      'name',
      'description',
      'owner',
      'timeframe',
      'keyResults',
      'createdAt',
      'updatedAt',
    ],
  },
  initiative: {
    basic: ['id', 'name', 'status'],
    standard: ['id', 'name', 'description', 'status', 'owner'],
    full: [
      'id',
      'name',
      'description',
      'status',
      'owner',
      'objectives',
      'features',
      'createdAt',
      'updatedAt',
    ],
  },
  keyResult: {
    basic: ['id', 'name', 'type', 'currentValue', 'targetValue'],
    standard: [
      'id',
      'name',
      'type',
      'objective',
      'startValue',
      'currentValue',
      'targetValue',
    ],
    full: [
      'id',
      'name',
      'type',
      'objective',
      'startValue',
      'currentValue',
      'targetValue',
      'createdAt',
      'updatedAt',
    ],
  },
} as const;
