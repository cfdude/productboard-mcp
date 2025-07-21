/**
 * Comprehensive tool documentation with examples and best practices
 */
// Manual documentation (takes precedence over generated)
export const toolDocumentation = {
    // Notes Tools
    create_note: {
        description: 'Create a new note in Productboard to capture customer feedback, feature requests, or research insights',
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
                    content: 'Customer expressed frustration with bright screen at night. Would like a dark mode option to reduce eye strain.',
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
                notes: 'Using Markdown formatting and linking to external support ticket',
            },
            {
                title: 'Feature request from sales call',
                description: 'Capture feature request with full context from sales conversation',
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
                solution: 'Use simple strings like ["bug", "mobile"] not [{"name": "bug"}]',
            },
            {
                error: 'Missing required field: content',
                cause: 'Content field is required even if empty',
                solution: 'Always include content field, use empty string if needed: content: ""',
            },
            {
                error: 'Company not found',
                cause: 'companyId references non-existent company',
                solution: 'First use list_companies to find valid company IDs or create company with create_company',
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
        description: 'Search and filter notes to find customer feedback and insights',
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
                description: 'Find all notes mentioning "dashboard" in the last quarter',
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
                solution: 'Use limit <= 100 and implement pagination with offset parameter',
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
            basic: 'Minimal fields - ID, name, and essential identifiers only. Best for performance.',
            standard: 'Common fields for typical use cases. Balanced detail and response size.',
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
        notes: 'Only effective when detail level is "full". Can significantly increase response size.',
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
        notes: 'Use with offset for pagination. API enforces maximum of 100 per request.',
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
        notes: 'Used with limit for pagination. Calculate as: offset = (page - 1) * limit',
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
        description: 'Tools for managing product features, roadmaps, and prioritization',
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
export async function getMergedDocumentation() {
    try {
        // Try to import generated documentation
        const { generatedToolDocumentation } = await import('../../generated/tool-documentation.js');
        // Fix tool names (remove productboard_ prefix from generated names)
        const fixedGeneratedDocs = {};
        for (const [key, value] of Object.entries(generatedToolDocumentation)) {
            const fixedKey = key.replace('productboard_', '');
            fixedGeneratedDocs[fixedKey] = value;
        }
        // Merge with manual taking precedence
        return {
            ...fixedGeneratedDocs,
            ...toolDocumentation,
        };
    }
    catch {
        // If generated docs not available, return manual only
        return toolDocumentation;
    }
}
