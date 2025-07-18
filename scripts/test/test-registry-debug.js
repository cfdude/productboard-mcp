// Test registry execution with debugging
import { ToolRegistry } from './build/tools/registry.js';
import { join } from 'path';

// Patch the registry to log args
const originalExecute = ToolRegistry.prototype.executeTool;
ToolRegistry.prototype.executeTool = async function(name, args) {
  console.log(`\n[REGISTRY] executeTool called with:`);
  console.log(`  name: ${name}`);
  console.log(`  args:`, JSON.stringify(args, null, 2));
  
  try {
    const result = await originalExecute.call(this, name, args);
    console.log(`[REGISTRY] executeTool success`);
    return result;
  } catch (error) {
    console.log(`[REGISTRY] executeTool error:`, error.message);
    throw error;
  }
};

async function testRegistry() {
  console.log('Testing registry execution...\n');
  
  const registry = new ToolRegistry(['webhooks']);
  const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
  
  registry.loadManifest(manifestPath);
  await registry.registerFromManifest();
  
  // Test as MCP would call it
  const mcpArgs = {
    body: JSON.stringify({
      events: [{eventType: "objective.created"}],
      name: "Registry debug test",
      notification: {
        version: 1,
        url: "https://webhook.site/registry-test"
      }
    })
  };
  
  try {
    const result = await registry.executeTool('post_webhook', mcpArgs);
    console.log('\nFinal result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\nFinal error:', error.message);
  }
}

testRegistry();
