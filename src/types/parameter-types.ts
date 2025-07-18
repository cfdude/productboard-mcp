/**
 * Standard parameter types for all Productboard tools
 */

export type DetailLevel = 'basic' | 'standard' | 'full';

export interface StandardListParams {
  /**
   * Maximum number of records to return
   * @default 100
   * @minimum 1
   * @maximum 100
   */
  limit?: number;

  /**
   * Number of records to skip before returning results
   * @default 0
   * @minimum 0
   */
  startWith?: number;

  /**
   * Level of detail to return in response
   * - basic: Essential fields only (id, name, etc.)
   * - standard: Common fields including relationships
   * - full: All available fields
   * @default 'basic'
   */
  detail?: DetailLevel;

  /**
   * Include nested sub-data like related entities
   * @default false
   */
  includeSubData?: boolean;
}

export interface StandardGetParams {
  /**
   * Level of detail to return in response
   * - basic: Essential fields only (id, name, etc.)
   * - standard: Common fields including relationships
   * - full: All available fields
   * @default 'standard'
   */
  detail?: DetailLevel;

  /**
   * Include nested sub-data like related entities
   * @default false
   */
  includeSubData?: boolean;
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
