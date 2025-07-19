// Check what loader is registered
import { ToolRegistry } from './build/tools/registry.js';
import { join } from 'path';

async function checkLoader() {
  console.log('Checking registry loader registration...\n');
  
  const registry = new ToolRegistry(['webhooks']);
  const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
  
  registry.loadManifest(manifestPath);
  
  // Log the manifest tool info
  const toolInfo = registry.manifest.tools.post_webhook;
  console.log('Tool info from manifest:', toolInfo);
  
  // Register and check what's registered
  await registry.registerFromManifest();
  
  // Check if loader is registered
  console.log('\nTool loaders registered:', Array.from(registry.toolLoaders.keys()));
  
  // Try to get the loader
  const loader = registry.toolLoaders.get('post_webhook');
  if (loader) {
    console.log('\nLoader found for post_webhook');
    
    // Execute the loader to see what handler it returns
    const handler = await loader();
    console.log('Handler loaded:', typeof handler);
    
    // Check if it's the source or generated handler
    console.log('Handler toString preview:', handler.toString().substring(0, 200));
  }
}

checkLoader();
