#!/usr/bin/env node
/**
 * Test dynamic tool loading system
 */
import { ToolRegistry } from '../build/tools/registry.js';
import { join } from 'path';
import { existsSync } from 'fs';

async function testDynamicLoading() {
  console.log('🧪 Testing dynamic tool loading system...\n');

  // Check manifest exists
  const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.error(
      "❌ Manifest not found. Run 'npm run generate-manifest' first."
    );
    process.exit(1);
  }

  // Test different category configurations
  const testConfigs = [
    {
      name: 'Default categories',
      categories: [
        'notes',
        'features',
        'companies',
        'users',
        'releases',
        'webhooks',
      ],
    },
    {
      name: 'Product manager profile',
      categories: [
        'features',
        'releases',
        'objectives',
        'keyresults',
        'initiatives',
      ],
    },
    {
      name: 'Customer success profile',
      categories: ['notes', 'companies', 'users', 'companies & users'],
    },
    {
      name: 'Developer profile',
      categories: ['webhooks', 'plugin integrations', 'jira integrations'],
    },
  ];

  for (const config of testConfigs) {
    console.log(`\n📋 Testing: ${config.name}`);
    console.log(`   Categories: ${config.categories.join(', ')}`);

    try {
      // Create registry with specific categories
      const registry = new ToolRegistry(config.categories);
      registry.loadManifest(manifestPath);
      await registry.registerFromManifest();

      // Get tool definitions
      const tools = registry.getToolDefinitions();
      console.log(`   ✅ Loaded ${tools.length} tools`);

      // Show category breakdown
      const categoryCount: Record<string, number> = {};
      for (const category of config.categories) {
        const categoryTools = registry.getToolsForCategory(category);
        if (categoryTools.length > 0) {
          categoryCount[category] = categoryTools.length;
        }
      }

      Object.entries(categoryCount).forEach(([cat, count]) => {
        console.log(`      - ${cat}: ${count} tools`);
      });

      // Test loading a specific tool
      if (tools.length > 0) {
        const testTool = tools[0];
        console.log(`   🔧 Testing tool execution: ${testTool.name}`);

        try {
          // This will trigger lazy loading
          const mockArgs = { instance: 'test', workspaceId: 'test' };
          // Note: This will fail without proper context, but we're testing the loading mechanism
          await registry.executeTool(testTool.name, mockArgs).catch(err => {
            if (
              err.message.includes('context') ||
              err.message.includes('config')
            ) {
              console.log(
                `   ✅ Tool loaded successfully (execution failed due to missing context - expected)`
              );
            } else {
              throw err;
            }
          });
        } catch (error) {
          console.log(`   ⚠️  Tool loading test failed:`, error.message);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error:`, error.message);
    }
  }

  console.log('\n✅ Dynamic loading test completed!');
}

// Run test
testDynamicLoading().catch(console.error);
