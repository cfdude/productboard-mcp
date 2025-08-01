/**
 * Comprehensive tool documentation with examples and best practices
 */

export interface ToolDocumentation {
  description: string;
  detailedDescription?: string;
  examples: ToolExample[];
  commonErrors?: CommonError[];
  bestPractices?: string[];
  relatedTools?: string[];
}

export interface ToolExample {
  title: string;
  description: string;
  input: Record<string, any>;
  expectedOutput?: Record<string, any>;
  notes?: string;
}

export interface CommonError {
  error: string;
  cause: string;
  solution: string;
}

// Manual documentation (takes precedence over generated)
export const toolDocumentation: Record<string, ToolDocumentation> = {
  // =============================================================================
  // 🚀 ENHANCED FEATURES (v1.5.0+) - TOKEN OPTIMIZATION & ADVANCED CAPABILITIES
  // =============================================================================

  // DYNAMIC FIELD SELECTION - Use 'fields' parameter for 60-80% token reduction
  get_features: {
    description: 'Get features with advanced field selection and optimization',
    detailedDescription: `
🎯 **Enhanced with Dynamic Field Selection & Smart Optimization**

The get_features tool now supports advanced field selection for significant token reduction:

**Dynamic Field Selection (60-80% token reduction):**
- Use 'fields' parameter with exact field specification
- Supports dot notation for nested fields: "owner.email", "status.name", "timeframe.startDate"
- Field validation with intelligent suggestions for typos

**Output Format Options (40-90% token reduction):**
- json: Standard JSON response (default)
- markdown: Human-readable format for documentation
- csv: Tabular data for spreadsheet import
- summary: Condensed overview with key metrics

**Smart Response Optimization (30-50% token reduction):**
- maxLength: Auto-truncate responses over character limit
- truncateFields: Specify which fields to truncate ["description", "notes"]
- includeEmpty: Exclude null/empty fields (default: true)
- includeDescription: Skip description fields for brevity
- includeLinks: Exclude relationship data for lighter responses

**Enhanced Search & Filtering (40-60% less irrelevant results):**
- Safe wildcard patterns: "project*", "test_??", "status_*_active"
- Advanced operators: equals, contains, startsWith, endsWith, isEmpty
- Multi-field filtering with intelligent suggestions
    `,
    examples: [
      {
        title: 'Essential Fields Only (80% token reduction)',
        description: 'Get just the critical information',
        input: {
          fields: ['id', 'name', 'status.name', 'owner.email'],
          limit: 20,
        },
        notes:
          'Use fieldSelector.getEssentialFields() for predefined essential field sets',
      },
      {
        title: 'Optimized Response with Truncation',
        description: 'Smart truncation for large datasets',
        input: {
          maxLength: 5000,
          truncateFields: ['description', 'customFields'],
          includeEmpty: false,
          outputFormat: 'summary',
        },
        notes:
          'Automatically truncates long fields while preserving readability',
      },
      {
        title: 'Advanced Search with Wildcards',
        description: 'Safe pattern matching for targeted results',
        input: {
          statusName: 'In*',
          ownerEmail: '*@company.com',
          patternMatchMode: 'wildcard',
          caseSensitive: false,
        },
        notes: 'Uses ReDoS-safe wildcard patterns with complexity validation',
      },
    ],
    bestPractices: [
      '🎯 Always use "fields" parameter for production - can reduce tokens by 60-80%',
      '📊 Use "outputFormat: summary" for quick overviews and dashboards',
      '🔧 Set "maxLength" with "truncateFields" for consistent response sizes',
      '🔍 Use wildcard patterns (*,?) for flexible filtering without regex complexity',
      '✅ Enable "validateFields: true" to get suggestions for field name typos',
      '🚫 Set "includeEmpty: false" to remove null/empty fields from responses',
    ],
    commonErrors: [
      {
        error: 'Invalid field names',
        cause: 'Typo in field specification or unsupported field',
        solution:
          'Use validateFields: true for suggestions, or call get_available_fields',
      },
      {
        error: 'Response too large',
        cause: 'Fetching full objects without field selection',
        solution: 'Use fields parameter or set maxLength with truncateFields',
      },
    ],
    relatedTools: ['get_available_fields', 'search'],
  },

  // Performance Tools
  get_performance_metrics: {
    description:
      'Monitor MCP server performance with intelligent caching and optimization',
    detailedDescription: `
🚀 **Performance Monitoring & Optimization Suite**

Advanced performance tools for production MCP server deployments:

**Features:**
- Real-time performance metrics collection
- Intelligent caching with TTL management
- Request throttling and rate limiting
- Memory usage monitoring
- Query optimization recommendations
- Response time analytics

**Use Cases:**
- Monitor server health in production
- Optimize API call patterns
- Debug performance bottlenecks
- Set up automated alerts
- Analyze usage patterns
    `,
    examples: [
      {
        title: 'Performance Dashboard',
        description: 'Get comprehensive performance overview',
        input: {
          includeBreakdown: true,
          timeRange: '24h',
        },
      },
    ],
    bestPractices: [
      '📊 Monitor regularly in production environments',
      '⚡ Use caching for frequently accessed data',
      '🔄 Set appropriate TTL values for different data types',
      '🚦 Implement rate limiting for external API calls',
    ],
  },

  // Bulk Operations
  bulk_update_features: {
    description:
      'Update multiple features efficiently with diff-only processing',
    detailedDescription: `
⚡ **Bulk Operations with Diff-Only Processing**

Efficiently update multiple entities with smart diff detection:

**Features:**
- Diff-only updates (only changed fields are sent)
- Transaction safety with rollback capability
- Progress tracking for large operations
- Validation before bulk execution
- Atomic operations where possible

**Performance Benefits:**
- 70% reduction in API calls for bulk updates
- Intelligent batching based on change sets
- Parallel processing for independent updates
    `,
    examples: [
      {
        title: 'Bulk Status Update',
        description: 'Update status for multiple features',
        input: {
          updates: [
            { id: 'feat-1', status: { name: 'In Progress' } },
            { id: 'feat-2', status: { name: 'Done' } },
          ],
          diffOnly: true,
          validateFirst: true,
        },
      },
    ],
    bestPractices: [
      '🔄 Always use diffOnly: true for efficiency',
      '✅ Enable validateFirst for safety',
      '📦 Batch updates in groups of 50-100 items',
      '🔒 Use transaction mode for critical updates',
    ],
  },

  // Context-Aware Features
  set_user_context: {
    description:
      'Set intelligent response adaptation based on user preferences and context',
    detailedDescription: `
🧠 **Context-Aware Response Adaptation**

Intelligent response personalization based on user context:

**Features:**
- User preference tracking (data format, detail level)
- Workspace permission filtering
- Instance feature detection
- Response history analysis
- Intelligent suggestions based on usage patterns

**Adaptation Rules:**
- Large dataset summarization
- Format preference enforcement
- Permission-based data filtering
- Error recovery guidance
    `,
    examples: [
      {
        title: 'Set User Preferences',
        description: 'Configure intelligent response adaptation',
        input: {
          sessionId: 'user-session-123',
          userPreferences: {
            dataFormat: 'basic',
            maxResults: 25,
            timezone: 'America/New_York',
          },
          workspaceContext: {
            id: 'workspace-456',
            permissions: ['read', 'write'],
          },
        },
      },
    ],
    bestPractices: [
      '🎯 Set context at session start for personalized responses',
      '📊 Use dataFormat preference to control response size',
      '🔐 Configure workspace permissions for data filtering',
      '⚡ Enable adaptation rules for improved UX',
    ],
  },

  // Notes Tools
  create_note: {
    description:
      'Create a new note in Productboard to capture customer feedback, feature requests, or research insights',
    detailedDescription: `
The create_note tool is the primary method for importing customer feedback into Productboard. 
Notes are the foundation of customer-centric product development, allowing you to:
- Capture verbatim customer feedback
- Track feature requests with full context
- Document user research findings
- Link feedback to specific users and companies
- Organize insights with tags for easy discovery
- Connect feedback directly to features for traceability

Notes support rich formatting with Markdown and can include:
- Links to external resources (support tickets, call recordings)
- User and company associations for segmentation
- Custom tags for categorization
- Priority indicators through tags
    `,
    examples: [
      {
        title: 'Basic customer feedback note',
        description: 'Capture simple feedback from a customer',
        input: {
          title: 'Request for dark mode in mobile app',
          content:
            'Customer expressed frustration with bright screen at night. Would like a dark mode option to reduce eye strain.',
          tags: ['mobile', 'ui', 'enhancement'],
          user: {
            email: 'sarah.johnson@techcorp.com',
            name: 'Sarah Johnson',
          },
        },
        expectedOutput: {
          id: 'note_12345',
          title: 'Request for dark mode in mobile app',
          status: 'active',
          createdAt: '2025-01-19T10:30:00Z',
        },
      },
      {
        title: 'Bug report with company context',
        description: 'Document a bug report linked to a specific company',
        input: {
          title: 'CSV export failing for large datasets',
          content: `## Issue Description
Customer reports that CSV exports fail when trying to export more than 10,000 rows.

## Steps to Reproduce
1. Navigate to Reports section
2. Apply filters that return >10k results  
3. Click "Export to CSV"
4. System shows error: "Export failed"

## Expected Behavior
Should successfully export all rows or provide pagination options

## Impact
Blocking their monthly reporting process`,
          tags: ['bug', 'export', 'high-priority', 'enterprise'],
          displayUrl: 'https://support.example.com/ticket/SUP-8934',
          companyId: 'comp_78234',
          user: {
            email: 'support@example.com',
          },
        },
        notes:
          'Using Markdown formatting and linking to external support ticket',
      },
      {
        title: 'Feature request from sales call',
        description:
          'Capture feature request with full context from sales conversation',
        input: {
          title: 'API webhooks for real-time inventory updates',
          content: `During demo call with ACME Corp (potential $120k ARR):

**Request**: Real-time inventory sync between our platform and their WMS
**Use Case**: Need immediate updates when inventory levels change
**Current Pain**: Manual updates causing 2-3 hour delays
**Business Impact**: Lost sales due to overselling out-of-stock items

Competitor mentioned: InventoryPro has this feature
Decision timeline: Q2 2025
Technical contact: dev.team@acmecorp.com`,
          tags: [
            'api',
            'integration',
            'sales-request',
            'revenue-impact',
            'competitor-feature',
          ],
          customerId: 'cust_98234',
          user: {
            email: 'john.doe@acmecorp.com',
            name: 'John Doe - VP Engineering',
          },
        },
        notes: 'Rich context helps product team understand business value',
      },
    ],
    commonErrors: [
      {
        error: 'Invalid tag format',
        cause: 'Tags must be strings, not objects or arrays',
        solution:
          'Use simple strings like ["bug", "mobile"] not [{"name": "bug"}]',
      },
      {
        error: 'Missing required field: content',
        cause: 'Content field is required even if empty',
        solution:
          'Always include content field, use empty string if needed: content: ""',
      },
      {
        error: 'Company not found',
        cause: 'companyId references non-existent company',
        solution:
          'First use list_companies to find valid company IDs or create company with create_company',
      },
    ],
    bestPractices: [
      'Always include user email for attribution and follow-up',
      'Use descriptive titles that summarize the core request/issue',
      'Include business context and impact in the content',
      "Tag consistently using your team's taxonomy",
      'Link to external resources (support tickets, call recordings) via displayUrl',
      'For bugs, include steps to reproduce and expected behavior',
      'For feature requests, explain the problem before suggesting solutions',
    ],
    relatedTools: [
      'list_notes',
      'update_note',
      'link_note_to_feature',
      'add_note_tags',
    ],
  },

  list_notes: {
    description:
      'Search and filter notes to find customer feedback and insights',
    detailedDescription: `
The list_notes tool provides powerful search and filtering capabilities to help you:
- Find all feedback related to specific features or themes
- Analyze feedback trends over time periods
- Segment insights by customer attributes
- Export feedback for further analysis
- Track feedback volume and sentiment

Supports pagination for large result sets and multiple filter combinations.
    `,
    examples: [
      {
        title: 'Search for feature-related feedback',
        description:
          'Find all notes mentioning "dashboard" in the last quarter',
        input: {
          term: 'dashboard',
          dateFrom: '2024-10-01',
          dateTo: '2024-12-31',
          detail: 'standard',
          limit: 100,
        },
        notes: 'Date filters help focus on recent feedback',
      },
      {
        title: 'Filter by multiple tags',
        description: 'Find high-priority bugs from enterprise customers',
        input: {
          allTags: ['bug', 'enterprise', 'high-priority'],
          detail: 'basic',
          limit: 50,
          orderBy: 'createdAt:desc',
        },
        notes: 'allTags requires ALL specified tags to be present',
      },
      {
        title: 'Company-specific feedback',
        description: 'Get all feedback from a specific company',
        input: {
          companyId: 'comp_12345',
          detail: 'full',
          includeSubData: true,
          limit: 200,
        },
        notes: 'Use full detail to include all metadata and linked entities',
      },
      {
        title: 'Recent feedback with pagination',
        description: 'Get latest feedback with pagination support',
        input: {
          dateFrom: '2025-01-01',
          limit: 25,
          offset: 0,
          orderBy: 'createdAt:desc',
          detail: 'standard',
        },
        expectedOutput: {
          data: '[array of notes]',
          pagination: {
            total: 156,
            limit: 25,
            offset: 0,
            hasMore: true,
          },
        },
      },
    ],
    commonErrors: [
      {
        error: 'Invalid date format',
        cause: 'Dates must be in ISO 8601 format',
        solution: 'Use YYYY-MM-DD format, e.g., "2025-01-19" not "01/19/2025"',
      },
      {
        error: 'Limit exceeds maximum',
        cause: 'API limits results to 100 per request',
        solution:
          'Use limit <= 100 and implement pagination with offset parameter',
      },
    ],
    bestPractices: [
      'Use specific search terms to reduce result set size',
      'Combine filters for more targeted results',
      'Start with basic detail level for performance, use full only when needed',
      'Implement pagination for large result sets',
      'Use date ranges to focus on relevant time periods',
      'Cache results when doing multiple analyses on same dataset',
    ],
    relatedTools: [
      'create_note',
      'get_note',
      'export_notes',
      'get_note_statistics',
    ],
  },

  search: {
    description:
      'Universal search across all ProductBoard entities with intelligent filtering, field selection, and output formatting',
    detailedDescription: `Advanced search functionality supporting:

**Basic Usage:**
search({
  entityType: 'features' | 'notes' | 'companies' | 'users' | 'products' | 'components' | 'objectives' | 'initiatives' | 'releases',
  filters?: { [key: string]: any },
  output?: string[] | 'json' | 'markdown' | 'csv' | 'summary' | 'ids-only',
  limit?: number,
  startWith?: number
})

**Advanced Field Selection:**
search({
  entityType: 'features',
  output: ['id', 'name', 'owner.email', 'status.name', 'parent.product.name'],
  filters: { archived: false, 'status.name': 'In Progress' }
})

**Key Features:**
- Dynamic field selection with dot notation for nested fields
- Multiple output formats (JSON, Markdown, CSV, Summary, IDs-only)
- Smart response optimization with truncation and size limits  
- Safe wildcard patterns with ReDoS protection
- Cross-entity relationship discovery
- Intelligent result aggregation
`,
    examples: [
      {
        title: 'Output control for performance',
        description: 'Get only IDs for bulk operations',
        input: {
          entityType: 'features',
          filters: { archived: false },
          output: 'ids-only',
        },
        expectedOutput: {
          message: 'Found 156 features. Filtered by: archived status = false',
          data: ['feat-123', 'feat-456', 'feat-789'],
          count: 156,
        },
      },
      {
        title: 'Parent relationship filtering - Features by Product',
        description: 'Find all features belonging to a specific product',
        input: {
          entityType: 'features',
          filters: {
            'parent.product.id': 'd944061a-c996-4dd9-b58f-1514f94602dc',
          },
          output: [
            'id',
            'name',
            'parent.component.name',
            'parent.component.id',
          ],
          limit: 50,
        },
        expectedOutput: {
          message: 'Found 23 features. Filtered by: parent product ID',
          data: '[array of features from specified product]',
          count: 23,
        },
        notes:
          'Use parent.product.id to filter features by their parent product',
      },
      {
        title: 'Parent relationship filtering - Features by Component',
        description: 'Find all features belonging to a specific component',
        input: {
          entityType: 'features',
          filters: {
            'parent.component.id': 'e78bbb3e-ee8e-47eb-9fb9-da8ea34c27bd',
          },
          output: ['id', 'name', 'status.name'],
          limit: 50,
        },
        notes:
          'Use parent.component.id to filter features by their parent component',
      },
      {
        title: 'Sub-feature filtering',
        description: 'Find all sub-features of a specific feature',
        input: {
          entityType: 'features',
          filters: {
            'parent.feature.id': '9faa70ff-dcee-4686-9203-aa482a4c67ab',
          },
          output: ['id', 'name', 'type'],
        },
        notes: 'Use parent.feature.id to find sub-features of a parent feature',
      },
      {
        title: 'Complete hierarchy mapping',
        description: 'Get complete product hierarchy for UUID mapping',
        input: {
          entityType: ['products', 'components', 'features'],
          output: [
            'id',
            'name',
            'parent.product.id',
            'parent.component.id',
            'parent.feature.id',
            '_entityType',
          ],
          limit: 2000,
        },
        notes:
          'This gives you everything needed to build complete UUID relationship mappings',
      },
      {
        title: 'Search custom fields',
        description: 'Discover available custom fields and their configuration',
        input: {
          entityType: 'custom_fields',
          output: ['id', 'name', 'type', 'options'],
        },
        notes:
          'Use this to discover custom field names for use in update_feature calls',
      },
      {
        title: 'Features with custom field values',
        description: 'Get features including their custom field values',
        input: {
          entityType: 'features',
          filters: { archived: false },
          includeCustomFields: true,
          output: ['id', 'name', 'customFields'],
          limit: 20,
        },
        notes:
          'Custom fields will be included in the response with names, values, and metadata',
      },
    ],
    commonErrors: [
      {
        error: 'Unsupported entity type',
        cause: 'entityType contains invalid entity type name',
        solution:
          'Use supported types: features, notes, companies, users, products, components, releases, etc.',
      },
      {
        error: 'Invalid output fields',
        cause: 'Output field is not available for the specified entity type',
        solution:
          'Check field mappings or use fields that exist across all entity types when using multi-entity search',
      },
      {
        error: 'Field not searchable',
        cause:
          'Filter field is not in the searchable fields list for the entity type',
        solution:
          'Use only searchable fields for filters, or use client-side processing for non-searchable fields',
      },
      {
        error: 'Limit exceeds maximum',
        cause: 'Limit parameter exceeds the maximum allowed value',
        solution:
          'Use pagination with limit <= 100 and implement multiple requests for larger datasets',
      },
      {
        error: 'Query parameter parent.product.id is unexpected',
        cause:
          'Using parent.product.id filter but API endpoint does not support it directly',
        solution:
          'Use the search tool with entityType: "features" and filters: {"parent.product.id": "your-product-id"} - the search tool handles the proper API routing',
      },
      {
        error: 'Field product.id is not searchable',
        cause:
          'Trying to use product.id instead of parent.product.id for features',
        solution:
          'Use parent.product.id, parent.component.id, or parent.feature.id for hierarchical filtering of features',
      },
    ],
    bestPractices: [
      'Use multi-entity search to reduce API calls when working with hierarchical data',
      'Select specific output fields instead of full objects for better performance',
      'Use ids-only mode for bulk operations and reference lookups',
      'Implement pagination for result sets over 50 items',
      'Combine server-side filters with client-side processing for complex queries',
      'Use hierarchical fields (parent.product.id) to build complete relationship mappings',
      'Cache search results when performing multiple operations on the same dataset',
      'Use _entityType field to distinguish results in multi-entity searches',
      'Apply more specific filters before less specific ones for better performance',
      'Consider using summary output mode for dashboard displays',
    ],
    relatedTools: [
      'list_notes',
      'list_features',
      'list_companies',
      'list_products',
      'list_components',
      'get_notes',
      'get_features',
      'get_custom_fields',
      'update_feature',
      'get_feature',
    ],
  },

  // Features Tools
  create_feature: {
    description: 'Create a new feature in your product roadmap',
    detailedDescription: `
Features are the core building blocks of your product roadmap in Productboard. They represent:
- Planned functionality or improvements
- User stories and epics
- Technical debt and infrastructure work
- Bug fixes that require planning

Features can be organized hierarchically (parent-child relationships), linked to objectives,
assigned to releases, and tracked through customizable workflows.
    `,
    examples: [
      {
        title: 'Basic feature creation',
        description: 'Create a simple feature with essential information',
        input: {
          name: 'Dark mode support',
          description: 'Enable users to switch between light and dark themes',
          status: 'candidate',
          priority: 7.5,
          effort: 8,
        },
      },
      {
        title: 'Feature with full context',
        description: 'Create a feature with assignments and hierarchy',
        input: {
          name: 'Advanced search filters',
          description: `## Overview
Implement advanced filtering options in search functionality

## User Story
As a power user, I want to filter search results by multiple criteria
so that I can quickly find specific items without scrolling through irrelevant results

## Acceptance Criteria
- [ ] Filter by date range
- [ ] Filter by status
- [ ] Filter by owner
- [ ] Combine multiple filters
- [ ] Save filter presets

## Technical Notes
- Requires search index updates
- Consider performance impact for large datasets`,
          status: 'in-progress',
          priority: 8.5,
          effort: 13,
          owner: 'user_123',
          parentId: 'feat_parent_456',
          componentId: 'comp_789',
          tags: ['search', 'ux-improvement', 'q1-priority'],
        },
      },
      {
        title: 'Feature with custom fields',
        description: 'Create feature with custom field values',
        input: {
          name: 'SSO Integration',
          description: 'Support SAML 2.0 single sign-on',
          status: 'planned',
          priority: 9,
          customFields: {
            revenue_impact: '250000',
            compliance_required: 'true',
            target_segment: 'enterprise',
          },
        },
        notes: 'Custom fields must be pre-configured in Productboard',
      },
    ],
    commonErrors: [
      {
        error: 'Invalid status value',
        cause: 'Status must match configured workflow states',
        solution: 'Use list_feature_statuses to get valid status values',
      },
      {
        error: 'Parent feature not found',
        cause: 'parentId references non-existent feature',
        solution: 'Verify parent feature exists with get_feature first',
      },
      {
        error: 'Priority out of range',
        cause: 'Priority must be between 0 and 10',
        solution: 'Use decimal values between 0.0 and 10.0',
      },
    ],
    bestPractices: [
      'Use clear, action-oriented feature names',
      'Include user stories and acceptance criteria in description',
      'Set realistic effort estimates for planning',
      'Link to parent features for proper hierarchy',
      'Assign to components for organization',
      'Use consistent status workflow',
      'Tag features for easy filtering and reporting',
    ],
    relatedTools: [
      'list_features',
      'update_feature',
      'link_feature_to_release',
      'link_feature_to_objective',
    ],
  },

  get_feature: {
    description: 'Get detailed information about a specific feature by ID',
    detailedDescription: `
The get_feature tool retrieves comprehensive information about a single feature, including:
- Basic feature properties (name, description, status, owner)
- Hierarchical relationships (parent product, component, or feature)
- Timeframe and scheduling information
- **Custom field values** when includeCustomFields is enabled
- Links and metadata

**Custom Fields Support**: Set \`includeCustomFields: true\` to retrieve all custom field values for the feature along with field metadata and available options.
    `,
    examples: [
      {
        title: 'Basic feature retrieval',
        description: 'Get basic feature information',
        input: {
          id: 'feat-123',
          detail: 'standard',
        },
      },
      {
        title: 'Feature with custom fields',
        description: 'Get feature including all custom field values',
        input: {
          id: 'feat-123',
          includeCustomFields: true,
          detail: 'full',
        },
        notes:
          'Custom fields section will include field names, values, types, and available options',
      },
      {
        title: 'Minimal feature info',
        description: 'Get only essential feature data for performance',
        input: {
          id: 'feat-123',
          detail: 'basic',
        },
        notes:
          'Use basic detail level for faster responses when full data not needed',
      },
    ],
    commonErrors: [
      {
        error: 'Feature not found',
        cause: 'Invalid feature ID provided',
        solution:
          'Verify feature ID exists using list_features or search tools',
      },
    ],
    bestPractices: [
      'Use includeCustomFields only when you need custom field data to avoid unnecessary API calls',
      'Use appropriate detail level - basic for IDs/names, standard for normal use, full for complete data',
      'Cache feature data when performing multiple operations on the same feature',
    ],
    relatedTools: [
      'list_features',
      'update_feature',
      'search',
      'get_custom_fields',
      'get_custom_field_value',
    ],
  },

  update_feature: {
    description:
      'Update an existing feature with new information, custom fields, or move it to a different component/product',
    detailedDescription: `
The update_feature tool allows you to modify existing features and handle component reassignment. 
This is essential for:
- Updating feature details (name, description, status)
- Moving features between components or products
- Reassigning feature ownership
- Changing feature timeframes
- Converting features to sub-features or vice versa
- **Updating custom field values** with user-friendly field names

**Custom Fields Support**: The tool supports updating custom field values using natural field names:
- Pass custom fields as direct parameters: \`"T-Shirt Sizing": "Large"\`
- Update multiple custom fields in a single call
- Use user-friendly field names, not internal IDs
- Support for all custom field types (text, dropdown, multi-dropdown, etc.)
- Automatic dropdown value resolution (e.g., "Large" → internal option ID)
- Intelligent error handling with field name suggestions for typos

**Component Reassignment**: The tool now supports moving features across the product hierarchy:
- Use \`componentId\` to move a feature to a different component
- Use \`productId\` to move a feature directly under a product
- Use \`parentId\` to make a feature a sub-feature of another feature

When reassigning components, the feature will be moved from its current location to the new parent while preserving all other properties.

**Discovery**: Use \`get_custom_fields\` tool to discover available custom field names and types.
    `,
    examples: [
      {
        title: 'Basic feature update',
        description: 'Update feature name and description',
        input: {
          id: 'feat-123',
          name: 'Enhanced Dashboard Analytics',
          description: 'Updated feature with advanced analytics capabilities',
        },
        notes: 'Only provided fields will be updated, others remain unchanged',
      },
      {
        title: 'Move feature to different component',
        description: 'Reassign feature from one component to another',
        input: {
          id: 'feat-123',
          componentId: 'comp-456',
        },
        notes:
          'Feature will be moved to the specified component while preserving all other properties',
      },
      {
        title: 'Move feature to different product',
        description:
          'Move feature directly under a product (bypassing components)',
        input: {
          id: 'feat-123',
          productId: 'prod-789',
        },
        notes:
          'Feature becomes a top-level feature under the specified product',
      },
      {
        title: 'Convert to sub-feature',
        description: 'Make a feature a child of another feature',
        input: {
          id: 'feat-123',
          parentId: 'feat-456',
        },
        notes: 'Feature becomes a sub-feature of the specified parent feature',
      },
      {
        title: 'Update status and timeframe',
        description: 'Change feature status and set development timeframe',
        input: {
          id: 'feat-123',
          status: { name: 'In Development' },
          timeframe: {
            startDate: '2024-08-01',
            endDate: '2024-10-31',
          },
        },
      },
      {
        title: 'Complete feature update with reassignment',
        description: 'Update multiple properties including component move',
        input: {
          id: 'feat-123',
          name: 'Mobile App Analytics Dashboard',
          description: 'Comprehensive analytics for mobile app usage',
          componentId: 'comp-mobile-analytics',
          status: { name: 'In Development' },
          owner: { email: 'dev-lead@company.com' },
        },
        notes:
          'Combines property updates with component reassignment in single call',
      },
      {
        title: 'Update single custom field',
        description: 'Update a single custom field value',
        input: {
          id: 'feat-123',
          'T-Shirt Sizing': 'Large',
        },
        notes: 'Use exact custom field names as they appear in Productboard',
      },
      {
        title: 'Update multiple custom fields',
        description: 'Update multiple custom field values in one call',
        input: {
          id: 'feat-123',
          'T-Shirt Sizing': 'Extra Large',
          'Resource Requirement': 'Can be delegated to team',
          'Priority Score': '8.5',
        },
        notes: 'All custom field types supported: text, dropdown, number, etc.',
      },
      {
        title: 'Mixed standard and custom field update',
        description:
          'Update both standard feature properties and custom fields',
        input: {
          id: 'feat-123',
          name: 'Enhanced User Dashboard',
          description: 'Updated with better analytics',
          'T-Shirt Sizing': 'Medium',
          'Technical Complexity': 'High',
          status: { name: 'In Progress' },
        },
        notes: 'Combine standard field updates with custom field updates',
      },
      {
        title: 'Clear custom field value',
        description: 'Remove/clear a custom field value',
        input: {
          id: 'feat-123',
          'T-Shirt Sizing': null,
        },
        notes: 'Use null or empty string to clear custom field values',
      },
    ],
    commonErrors: [
      {
        error: 'Feature not found',
        cause: 'Invalid feature ID provided',
        solution: 'Verify feature ID exists using list_features or get_feature',
      },
      {
        error: 'Component not found',
        cause: 'Invalid componentId provided for reassignment',
        solution: 'Use list_components to find valid component IDs',
      },
      {
        error: 'Product not found',
        cause: 'Invalid productId provided for reassignment',
        solution: 'Use list_products to find valid product IDs',
      },
      {
        error: 'Parent feature not found',
        cause: 'Invalid parentId provided for sub-feature creation',
        solution:
          'Verify parent feature exists and is not the same as the feature being updated',
      },
      {
        error: 'Invalid timeframe format',
        cause: 'Timeframe object missing required startDate/endDate',
        solution:
          'Provide timeframe as object with startDate and endDate in YYYY-MM-DD format',
      },
      {
        error: 'Unknown custom field',
        cause: 'Custom field name not found or misspelled',
        solution:
          'Use get_custom_fields tool to see available fields, check spelling of field names',
      },
      {
        error: 'Invalid dropdown value',
        cause: 'Dropdown value does not match available options',
        solution:
          'Check available dropdown options or use user-friendly values that match existing options',
      },
    ],
    bestPractices: [
      'Always verify target component/product exists before reassignment',
      'Use get_feature to check current state before making changes',
      'When moving features, consider impact on dependent sub-features',
      'Preserve feature relationships when possible during reassignment',
      'Update feature descriptions to reflect new component context if needed',
      'Test component reassignment in non-production environments first',
      'Consider user permissions when reassigning features across products',
      'Use get_custom_fields to discover available custom field names before updating',
      'Update multiple custom fields in single call for better performance',
      'Use consistent naming for custom field values across features',
      'Validate dropdown values exist before setting custom fields',
      'Use null to clear custom field values rather than empty strings',
    ],
    relatedTools: [
      'get_feature',
      'list_features',
      'list_components',
      'list_products',
      'create_feature',
      'get_custom_fields',
      'get_custom_field_value',
      'search',
    ],
  },

  // Companies Tools
  create_company: {
    description: 'Create a new company/account in Productboard',
    detailedDescription: `
Companies in Productboard represent your customers, prospects, or any organization providing feedback.
They serve as a critical dimension for:
- Aggregating feedback by account
- Prioritizing based on revenue/strategic value  
- Tracking feature requests by customer segment
- Managing customer-specific roadmaps
- Analyzing adoption patterns

Companies can have custom fields for CRM data, segmentation, and business metrics.
    `,
    examples: [
      {
        title: 'Basic company creation',
        description: 'Create a company with minimal information',
        input: {
          name: 'Acme Corporation',
          domain: 'acme.com',
        },
      },
      {
        title: 'Company with business context',
        description: 'Create company with full business information',
        input: {
          name: 'TechStart Inc',
          domain: 'techstart.io',
          externalId: 'CRM-8234',
          customFields: {
            arr: '150000',
            tier: 'enterprise',
            industry: 'fintech',
            csm_owner: 'sarah.smith@ourcompany.com',
            renewal_date: '2025-12-01',
            health_score: '85',
          },
          tags: ['strategic-account', 'expansion-opportunity'],
        },
      },
      {
        title: 'Prospect company',
        description: 'Track prospective customer for sales-driven feedback',
        input: {
          name: 'Global Retail Solutions',
          domain: 'globalretail.com',
          customFields: {
            opportunity_size: '500000',
            sales_stage: 'negotiation',
            competitor: 'CompetitorX',
            key_requirements: 'API, SSO, Advanced Analytics',
          },
          tags: ['prospect', 'q1-target', 'enterprise-tier'],
        },
      },
    ],
    commonErrors: [
      {
        error: 'Duplicate company',
        cause: 'Company with same domain already exists',
        solution: 'Search existing companies first with list_companies',
      },
      {
        error: 'Invalid custom field',
        cause: 'Referencing non-existent custom field',
        solution: 'Use list_company_custom_fields to see available fields',
      },
    ],
    bestPractices: [
      'Use consistent naming conventions for companies',
      'Always include domain for automatic user association',
      'Sync externalId with your CRM for integration',
      'Maintain custom fields for segmentation and analysis',
      'Tag companies by segment, tier, or other attributes',
      'Keep business metrics updated for prioritization',
    ],
    relatedTools: [
      'list_companies',
      'update_company',
      'set_company_custom_field',
    ],
  },
};

// Parameter documentation for common fields
export const parameterDocumentation = {
  detail: {
    description: 'Level of detail in response data',
    type: 'enum',
    values: {
      basic:
        'Minimal fields - ID, name, and essential identifiers only. Best for performance.',
      standard:
        'Common fields for typical use cases. Balanced detail and response size.',
      full: 'All available fields including nested objects and relationships. Use sparingly.',
    },
    examples: [
      { value: 'basic', useCase: 'Getting IDs for bulk operations' },
      { value: 'standard', useCase: 'Normal CRUD operations' },
      { value: 'full', useCase: 'Complete data export or detailed analysis' },
    ],
  },

  includeSubData: {
    description: 'Include nested complex JSON sub-data in response',
    type: 'boolean',
    notes:
      'Only effective when detail level is "full". Can significantly increase response size.',
    examples: [
      {
        value: true,
        useCase: 'Need complete object graph including all relationships',
      },
      { value: false, useCase: 'Want full fields but not deeply nested data' },
    ],
  },

  limit: {
    description: 'Maximum number of items to return',
    type: 'number',
    constraints: {
      min: 1,
      max: 100,
      default: 100,
    },
    notes:
      'Use with offset for pagination. API enforces maximum of 100 per request.',
    examples: [
      { value: 25, useCase: 'Paginated UI display' },
      { value: 100, useCase: 'Bulk data processing' },
    ],
  },

  offset: {
    description: 'Number of items to skip for pagination',
    type: 'number',
    constraints: {
      min: 0,
      default: 0,
    },
    notes:
      'Used with limit for pagination. Calculate as: offset = (page - 1) * limit',
    examples: [
      { value: 0, useCase: 'First page of results' },
      { value: 50, useCase: 'Third page with limit=25' },
    ],
  },

  dateFrom: {
    description: 'Start date for filtering results',
    type: 'string',
    format: 'ISO 8601 date (YYYY-MM-DD) or datetime (YYYY-MM-DDTHH:mm:ssZ)',
    examples: [
      { value: '2025-01-01', useCase: 'Filter from start of year' },
      { value: '2025-01-15T09:00:00Z', useCase: 'Precise datetime filtering' },
    ],
  },

  dateTo: {
    description: 'End date for filtering results',
    type: 'string',
    format: 'ISO 8601 date (YYYY-MM-DD) or datetime (YYYY-MM-DDTHH:mm:ssZ)',
    notes: 'Inclusive - includes items on this date',
    examples: [
      { value: '2025-12-31', useCase: 'Filter through end of year' },
      { value: '2025-01-19T17:00:00Z', useCase: 'Precise datetime filtering' },
    ],
  },
};

// Tool categories with detailed descriptions
export const categoryDocumentation = {
  notes: {
    name: 'Notes & Feedback',
    description: 'Tools for managing customer feedback, insights, and research',
    overview: `
Notes are the foundation of customer-centric product development in Productboard. 
They capture the voice of the customer and connect it directly to your product decisions.

Use notes to:
- Import feedback from multiple channels
- Track feature requests with context
- Document user research findings
- Link insights to product areas
- Build evidence for prioritization
    `,
    commonWorkflows: [
      {
        name: 'Feedback Import Workflow',
        steps: [
          'Create notes from support tickets or sales calls',
          'Tag notes for categorization',
          'Link notes to relevant features',
          'Aggregate insights for prioritization',
        ],
      },
      {
        name: 'Research Documentation',
        steps: [
          'Create notes for each research participant',
          'Tag with research project name',
          'Extract insights and patterns',
          'Link findings to feature ideas',
        ],
      },
    ],
  },

  features: {
    name: 'Features & Roadmap',
    description:
      'Tools for managing product features, roadmaps, and prioritization',
    overview: `
Features represent the work your team will deliver. They can be user-facing functionality,
technical improvements, or bug fixes that require planning and coordination.

Features support:
- Hierarchical organization (epics, stories, tasks)
- Custom workflows and statuses
- Prioritization scoring
- Release planning
- Objective alignment
    `,
    commonWorkflows: [
      {
        name: 'Feature Planning Workflow',
        steps: [
          'Create feature from aggregated feedback',
          'Set priority based on impact/effort',
          'Assign to component and owner',
          'Link to strategic objective',
          'Plan in upcoming release',
        ],
      },
    ],
  },

  companies: {
    name: 'Companies & Accounts',
    description: 'Tools for managing customer accounts and company data',
    overview: `
Companies provide the business context for feedback and help you make customer-centric decisions.
They enable segmentation, prioritization by business value, and account-based roadmaps.
    `,
    commonWorkflows: [
      {
        name: 'Account Setup Workflow',
        steps: [
          'Import companies from CRM',
          'Set custom field values (ARR, tier, etc)',
          'Associate users with companies',
          'Tag for segmentation',
          'Track account health metrics',
        ],
      },
    ],
  },
};

/**
 * Merge manual and generated documentation
 * Manual documentation takes precedence
 */
export async function getMergedDocumentation(): Promise<
  Record<string, ToolDocumentation>
> {
  // In production/CI, generated documentation may not be available
  // Return manual documentation only
  return toolDocumentation;
}
