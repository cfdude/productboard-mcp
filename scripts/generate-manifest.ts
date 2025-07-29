#!/usr/bin/env node
/**
 * Generate tool manifest from actual MCP server tools
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(PROJECT_ROOT, 'generated');
const MANIFEST_PATH = join(OUTPUT_DIR, 'manifest.json');

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface ToolInfo {
  category: string;
  operation: string;
  description: string;
  requiredParams: string[];
  optionalParams: string[];
  implementation: string;
}

interface CategoryInfo {
  displayName: string;
  description: string;
  tools: string[];
}

interface ToolManifest {
  version: string;
  generated: string;
  categories: Record<string, CategoryInfo>;
  tools: Record<string, ToolInfo>;
}

/**
 * Load tools from actual MCP server implementations
 */
async function loadMcpTools(): Promise<{
  tools: Record<string, ToolInfo>;
  categories: Record<string, CategoryInfo>;
}> {
  const tools: Record<string, ToolInfo> = {};
  const categories: Record<string, CategoryInfo> = {};

  // Helper to register a category
  const registerCategory = (
    key: string,
    displayName: string,
    description: string
  ) => {
    if (!categories[key]) {
      categories[key] = {
        displayName,
        description,
        tools: [],
      };
    }
  };

  // Helper to register a tool
  const registerTool = (
    name: string,
    category: string,
    description: string,
    requiredParams: string[],
    optionalParams: string[]
  ) => {
    tools[name] = {
      category,
      operation: name.toUpperCase(),
      description,
      requiredParams,
      optionalParams,
      implementation: 'mcp',
    };

    if (categories[category]) {
      categories[category].tools.push(name);
    }
  };

  // Notes tools
  registerCategory('notes', 'Notes', 'Customer feedback and notes management');
  registerTool(
    'create_note',
    'notes',
    'Create a new note in Productboard',
    ['title', 'content'],
    [
      'ownerEmail',
      'userEmail',
      'userName',
      'userExternalId',
      'companyDomain',
      'sourceOrigin',
      'sourceRecordId',
      'displayUrl',
      'tags',
    ]
  );
  registerTool(
    'get_notes',
    'notes',
    'List all notes with filtering and pagination',
    [],
    [
      'limit',
      'startWith',
      'detail',
      'includeSubData',
      'allTags',
      'anyTag',
      'companyId',
      'createdFrom',
      'createdTo',
      'dateFrom',
      'dateTo',
      'featureId',
      'ownerEmail',
      'source',
      'term',
      'updatedFrom',
      'updatedTo',
    ]
  );
  registerTool(
    'get_note',
    'notes',
    'Get a specific note by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_note',
    'notes',
    'Update an existing note',
    ['id'],
    ['title', 'content', 'tags']
  );
  registerTool('delete_note', 'notes', 'Delete a note', ['id'], []);
  registerTool(
    'bulk_add_note_followers',
    'notes',
    'Add followers to a note',
    ['noteId'],
    ['body']
  );
  registerTool(
    'remove_note_follower',
    'notes',
    'Remove a follower from a note',
    ['noteId', 'email'],
    []
  );
  registerTool('list_tags', 'notes', 'List tags', ['noteId'], []);
  registerTool(
    'create_note_tag',
    'notes',
    'Create a tag',
    ['noteId', 'tagName'],
    []
  );
  registerTool(
    'delete_note_tag',
    'notes',
    'Remove a tag from a note',
    ['noteId', 'tagName'],
    []
  );
  registerTool('list_links', 'notes', 'List links', ['noteId'], []);
  registerTool(
    'create_link',
    'notes',
    'Create a link',
    ['noteId', 'entityId'],
    []
  );
  registerTool(
    'list_feedback_form_configurations',
    'notes',
    'List all feedback form configurations',
    [],
    []
  );
  registerTool(
    'get_feedback_form_configuration',
    'notes',
    'Retrieve a feedback form configuration',
    ['id'],
    []
  );
  registerTool(
    'submit_feedback_form',
    'notes',
    'Submit a feedback form',
    [],
    ['body']
  );

  // Features tools (includes components and products)
  registerCategory(
    'features',
    'Features',
    'Product features, components, and products management'
  );
  registerTool(
    'create_feature',
    'features',
    'Create a new feature in Productboard',
    ['name'],
    ['description', 'status', 'owner', 'parent']
  );
  registerTool(
    'get_features',
    'features',
    'List all features in Productboard',
    [],
    [
      'limit',
      'startWith',
      'detail',
      'includeSubData',
      'archived',
      'noteId',
      'ownerEmail',
      'parentId',
      'statusId',
      'statusName',
    ]
  );
  registerTool(
    'get_feature',
    'features',
    'Get a specific feature by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_feature',
    'features',
    'Update a feature. Supports both standard fields and custom fields - pass custom field names as additional parameters (e.g., "T-Shirt Sizing": "large").',
    ['id'],
    [
      'name',
      'description',
      'status',
      'owner',
      'archived',
      'timeframe',
      'parentId',
      'componentId',
      'productId',
      '...customFields',
    ]
  );
  registerTool('delete_feature', 'features', 'Delete a feature', ['id'], []);
  registerTool(
    'create_component',
    'features',
    'Create a new component in Productboard',
    ['name'],
    ['description', 'productId']
  );
  registerTool(
    'get_components',
    'features',
    'List all components in Productboard',
    [],
    ['limit', 'startWith', 'detail', 'includeSubData', 'productId']
  );
  registerTool(
    'get_component',
    'features',
    'Get a specific component by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_component',
    'features',
    'Update a component',
    ['id'],
    ['name', 'description']
  );
  registerTool(
    'get_products',
    'features',
    'List all products in Productboard',
    [],
    ['limit', 'startWith', 'detail', 'includeSubData']
  );
  registerTool(
    'get_product',
    'features',
    'Get a specific product by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_product',
    'features',
    'Update a product',
    ['id'],
    ['name', 'description']
  );

  // Companies tools (includes users)
  registerCategory('companies', 'Companies', 'Company and user management');
  registerTool(
    'create_company',
    'companies',
    'Create a new company',
    ['name'],
    ['description', 'domain', 'externalId']
  );
  registerTool(
    'get_companies',
    'companies',
    'List all companies',
    [],
    [
      'detail',
      'featureId',
      'hasNotes',
      'includeSubData',
      'limit',
      'startWith',
      'term',
    ]
  );
  registerTool(
    'get_company',
    'companies',
    'Retrieve a specific company',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_company',
    'companies',
    'Update a company',
    ['id', 'body'],
    []
  );
  registerTool('delete_company', 'companies', 'Delete a company', ['id'], []);
  registerTool(
    'create_company_field',
    'companies',
    'Create a company field',
    ['body'],
    []
  );
  registerTool(
    'list_company_fields',
    'companies',
    'Retrieve company fields',
    [],
    []
  );
  registerTool(
    'get_company_field',
    'companies',
    'Retrieve a company field',
    ['id'],
    []
  );
  registerTool(
    'update_company_field',
    'companies',
    'Update a company field',
    ['id', 'body'],
    []
  );
  registerTool(
    'delete_company_field',
    'companies',
    'Delete a company field',
    ['id'],
    []
  );
  registerTool(
    'get_company_field_value',
    'companies',
    'Retrieve company field value',
    ['companyId', 'companyCustomFieldId'],
    []
  );
  registerTool(
    'set_company_field_value',
    'companies',
    'Sets company field value',
    ['companyId', 'companyCustomFieldId', 'body'],
    []
  );
  registerTool(
    'delete_company_field_value',
    'companies',
    'Delete company field value',
    ['companyId', 'companyCustomFieldId'],
    []
  );
  registerTool(
    'get_users',
    'companies',
    'List all users in Productboard',
    [],
    ['detail', 'includeSubData', 'limit', 'startWith']
  );
  registerTool(
    'create_user',
    'companies',
    'Create a new user in Productboard',
    ['email'],
    ['name', 'role', 'companyId', 'externalId']
  );
  registerTool(
    'get_user',
    'companies',
    'Get a specific user by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_user',
    'companies',
    'Update an existing user',
    ['id'],
    ['name', 'role', 'companyId', 'externalId']
  );
  registerTool('delete_user', 'companies', 'Delete a user', ['id'], []);

  // Webhooks tools
  registerCategory('webhooks', 'Webhooks', 'Webhook subscription management');
  registerTool(
    'post_webhook',
    'webhooks',
    'Create a new subscription',
    ['body'],
    []
  );
  registerTool('get_webhooks', 'webhooks', 'List all subscriptions', [], []);
  registerTool(
    'get_webhook',
    'webhooks',
    'Get a specific webhook subscription by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'delete_webhook',
    'webhooks',
    'Delete a webhook subscription',
    ['id'],
    []
  );

  // Objectives tools (includes initiatives and key results)
  registerCategory(
    'objectives',
    'Objectives',
    'Strategic objectives, initiatives, and key results management'
  );
  registerTool(
    'get_objectives',
    'objectives',
    'List all objectives',
    [],
    ['detail', 'includeSubData', 'limit', 'startWith']
  );
  registerTool(
    'create_objective',
    'objectives',
    'Create a new objective',
    ['name'],
    ['description', 'startDate', 'endDate', 'ownerId']
  );
  registerTool(
    'get_objective',
    'objectives',
    'Get a specific objective by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_objective',
    'objectives',
    'Update an existing objective',
    ['id'],
    ['name', 'description', 'startDate', 'endDate', 'ownerId']
  );
  registerTool(
    'delete_objective',
    'objectives',
    'Delete an objective',
    ['id'],
    []
  );
  registerTool(
    'list_links_objective_to_features',
    'objectives',
    'List features linked to a specific objective',
    ['id'],
    []
  );
  registerTool(
    'list_links_objective_to_initiatives',
    'objectives',
    'List initiatives linked to a specific objective',
    ['id'],
    []
  );
  registerTool(
    'create_objective_to_initiative_link',
    'objectives',
    'Create a new link between an objective and an initiative',
    ['id', 'initiativeId'],
    []
  );
  registerTool(
    'delete_objective_to_initiative_link',
    'objectives',
    'Delete a link between an objective and an initiative',
    ['id', 'initiativeId'],
    []
  );
  registerTool(
    'create_objective_to_feature_link',
    'objectives',
    'Create a new link between an objective and a feature',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'delete_objective_to_feature_link',
    'objectives',
    'Delete a link between an objective and a feature',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'get_initiatives',
    'objectives',
    'List all initiatives',
    [],
    ['detail', 'includeSubData', 'limit', 'startWith']
  );
  registerTool(
    'create_initiative',
    'objectives',
    'Create a new initiative',
    ['name'],
    ['description', 'ownerId', 'status']
  );
  registerTool(
    'get_initiative',
    'objectives',
    'Get a specific initiative by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_initiative',
    'objectives',
    'Update an existing initiative',
    ['id'],
    ['name', 'description', 'ownerId', 'status']
  );
  registerTool(
    'delete_initiative',
    'objectives',
    'Delete an initiative',
    ['id'],
    []
  );
  registerTool(
    'list_links_initiative_to_objectives',
    'objectives',
    'List objectives linked to a specific initiative',
    ['id'],
    []
  );
  registerTool(
    'list_links_initiative_to_features',
    'objectives',
    'List features linked to a specific initiative',
    ['id'],
    []
  );
  registerTool(
    'create_initiative_to_objective_link',
    'objectives',
    'Create a new link between an initiative and an objective',
    ['id', 'objectiveId'],
    []
  );
  registerTool(
    'delete_initiative_to_objective_link',
    'objectives',
    'Delete a link between an initiative and an objective',
    ['id', 'objectiveId'],
    []
  );
  registerTool(
    'create_initiative_to_feature_link',
    'objectives',
    'Create a new link between an initiative and a feature',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'delete_initiative_to_feature_link',
    'objectives',
    'Delete a link between an initiative and a feature',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'get_key_results',
    'objectives',
    'List all key results',
    [],
    ['detail', 'includeSubData', 'limit', 'startWith']
  );
  registerTool(
    'create_key_result',
    'objectives',
    'Create a new key result',
    ['name', 'objectiveId', 'type', 'targetValue'],
    ['currentValue', 'startValue']
  );
  registerTool(
    'get_key_result',
    'objectives',
    'Get a specific key result by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_key_result',
    'objectives',
    'Update an existing key result',
    ['id'],
    ['name', 'targetValue', 'currentValue']
  );
  registerTool(
    'delete_key_result',
    'objectives',
    'Delete a key result',
    ['id'],
    []
  );

  // Custom fields tools
  registerCategory(
    'custom-fields',
    'Custom Fields',
    'Custom field management for hierarchy entities'
  );
  registerTool(
    'get_custom_fields',
    'custom-fields',
    'List all custom fields for hierarchy entities',
    ['type'],
    []
  );
  registerTool(
    'get_custom_fields_values',
    'custom-fields',
    'List all custom field values',
    [],
    ['customField.id', 'hierarchyEntity.id', 'type']
  );
  registerTool(
    'get_custom_field',
    'custom-fields',
    'Retrieve a specific custom field',
    ['id'],
    []
  );
  registerTool(
    'get_custom_field_value',
    'custom-fields',
    'Retrieve a custom field value for a hierarchy entity',
    ['customField.id', 'hierarchyEntity.id'],
    []
  );
  registerTool(
    'set_custom_field_value',
    'custom-fields',
    'Set value of a custom field for a hierarchy entity',
    ['customField.id', 'hierarchyEntity.id', 'body'],
    []
  );
  registerTool(
    'delete_custom_field_value',
    'custom-fields',
    'Delete value of a custom field for a hierarchy entity',
    ['customField.id', 'hierarchyEntity.id'],
    []
  );
  registerTool(
    'get_feature_statuses',
    'custom-fields',
    'List all feature statuses',
    [],
    []
  );

  // Releases tools
  registerCategory(
    'releases',
    'Releases',
    'Release and release group management'
  );
  registerTool(
    'create_release_group',
    'releases',
    'Create a new release group',
    ['name'],
    ['description', 'isDefault']
  );
  registerTool(
    'list_release_groups',
    'releases',
    'List all release groups',
    [],
    []
  );
  registerTool(
    'get_release_group',
    'releases',
    'Get a specific release group by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_release_group',
    'releases',
    'Update an existing release group',
    ['id'],
    ['name', 'description', 'isDefault']
  );
  registerTool(
    'delete_release_group',
    'releases',
    'Delete a release group',
    ['id'],
    []
  );
  registerTool(
    'create_release',
    'releases',
    'Create a new release',
    ['name', 'releaseGroupId'],
    ['description', 'startDate', 'releaseDate', 'state']
  );
  registerTool(
    'list_releases',
    'releases',
    'List all releases',
    [],
    ['releaseGroup.id']
  );
  registerTool(
    'get_release',
    'releases',
    'Get a specific release by ID',
    ['id'],
    ['detail', 'includeSubData']
  );
  registerTool(
    'update_release',
    'releases',
    'Update an existing release',
    ['id'],
    ['name', 'description', 'startDate', 'releaseDate', 'state']
  );
  registerTool('delete_release', 'releases', 'Delete a release', ['id'], []);
  registerTool(
    'list_feature_release_assignments',
    'releases',
    'List all feature release assignments',
    [],
    [
      'feature.id',
      'release.id',
      'release.state',
      'release.timeframe.endDate.from',
      'release.timeframe.endDate.to',
    ]
  );
  registerTool(
    'get_feature_release_assignment',
    'releases',
    'Retrieve a feature release assignment',
    ['release.id', 'feature.id'],
    []
  );
  registerTool(
    'update_feature_release_assignment',
    'releases',
    'Update a feature release assignment',
    ['release.id', 'feature.id', 'body'],
    []
  );

  // Plugin integrations tools
  registerCategory(
    'plugin-integrations',
    'Plugin Integrations',
    'Plugin integration management'
  );
  registerTool(
    'post_plugin_integration',
    'plugin-integrations',
    'Create a plugin integration',
    ['body'],
    []
  );
  registerTool(
    'get_plugin_integrations',
    'plugin-integrations',
    'List all plugin integrations',
    [],
    []
  );
  registerTool(
    'get_plugin_integration',
    'plugin-integrations',
    'Retrieve a plugin integration',
    ['id'],
    []
  );
  registerTool(
    'patch_plugin_integration',
    'plugin-integrations',
    'Update a plugin integration',
    ['id', 'body'],
    []
  );
  registerTool(
    'put_plugin_integration',
    'plugin-integrations',
    'Update a plugin integration',
    ['id', 'body'],
    []
  );
  registerTool(
    'delete_plugin_integration',
    'plugin-integrations',
    'Delete a plugin integration',
    ['id'],
    []
  );
  registerTool(
    'get_plugin_integration_connections',
    'plugin-integrations',
    'List all plugin integration connections',
    ['id'],
    []
  );
  registerTool(
    'get_plugin_integration_connection',
    'plugin-integrations',
    'Retrieve a plugin integration connection',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'put_plugin_integration_connection',
    'plugin-integrations',
    'Set a plugin integration connection',
    ['id', 'featureId', 'body'],
    []
  );
  registerTool(
    'delete_plugin_integration_connection',
    'plugin-integrations',
    'Delete a plugin integration connection',
    ['id', 'featureId'],
    []
  );

  // Jira integrations tools
  registerCategory(
    'jira-integrations',
    'Jira Integrations',
    'Jira integration management'
  );
  registerTool(
    'get_jira_integration',
    'jira-integrations',
    'Retrieve a Jira integration',
    ['id'],
    []
  );
  registerTool(
    'get_jira_integrations',
    'jira-integrations',
    'List all Jira integrations',
    [],
    []
  );
  registerTool(
    'get_jira_integration_connection',
    'jira-integrations',
    'Retrieve a Jira integration connection',
    ['id', 'featureId'],
    []
  );
  registerTool(
    'get_jira_integration_connections',
    'jira-integrations',
    'List all Jira integration connections',
    ['id'],
    ['connection.issueId', 'connection.issueKey']
  );

  // Search tool (custom)
  registerCategory(
    'search',
    'Universal Search',
    'Universal search across all Productboard entities'
  );
  registerTool(
    'search',
    'search',
    'Universal search across all Productboard entities with flexible filtering and output control',
    ['entityType'],
    [
      'filters',
      'operators',
      'output',
      'limit',
      'startWith',
      'detail',
      'includeSubData',
    ]
  );

  return { tools, categories };
}

/**
 * Main function to generate manifest
 */
async function main(): Promise<void> {
  console.log('🚀 Starting tool manifest generation...');

  try {
    console.log('📖 Loading MCP server tools...');
    const { tools, categories } = await loadMcpTools();

    const manifest: ToolManifest = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      categories,
      tools,
    };

    // Convert arrays to single-line format for CI compatibility
    let manifestJson = JSON.stringify(manifest, null, 2);

    // Convert multiline arrays to single-line arrays using regex
    manifestJson = manifestJson.replace(
      /\[\s*\n\s*([^\]]+)\n\s*\]/g,
      (match, content) => {
        const items = content
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
        return `[${items.join(', ')}]`;
      }
    );

    writeFileSync(MANIFEST_PATH, manifestJson);

    console.log(
      `✅ Generated manifest with ${Object.keys(tools).length} tools across ${Object.keys(categories).length} categories`
    );
    console.log(`📁 Output: ${MANIFEST_PATH}`);

    // Summary
    console.log('\n📊 Category Summary:');
    Object.entries(categories).forEach(([key, category]) => {
      console.log(
        `  - ${category.displayName}: ${category.tools.length} tools`
      );
    });
  } catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1);
  }
}

// Run the script
main();
