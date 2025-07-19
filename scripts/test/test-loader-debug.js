// Debug the loader path
import { ToolRegistry } from './build/tools/registry.js';
import { join } from 'path';
import { pathToFileURL } from 'url';

async function debugLoader() {
  console.log('Debugging tool loader...\n');
  
  const registry = new ToolRegistry(['webhooks']);
  const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
  
  // Load manifest
  registry.loadManifest(manifestPath);
  console.log('Manifest loaded');
  
  // Check what's in the manifest
  const manifest = registry.manifest;
  const webhookTool = manifest.tools.post_webhook;
  console.log('Webhook tool from manifest:', webhookTool);
  
  // Try to load the handler directly
  const [handlerFile, handlerName] = webhookTool.implementation.split('#');
  const handlerPath = join(process.cwd(), 'generated', handlerFile);
  const handlerUrl = pathToFileURL(handlerPath).href;
  
  console.log('\nLoading handler from:', handlerPath);
  console.log('Handler URL:', handlerUrl);
  console.log('Handler name:', handlerName);
  
  try {
    const module = await import(handlerUrl);
    console.log('\nModule loaded, exports:', Object.keys(module));
    
    if (module[handlerName]) {
      console.log(`Found ${handlerName} function`);
      
      // Test the function
      const result = await module[handlerName]({
        body: JSON.stringify({
          events: [{eventType: "feature.created"}],
          name: "Direct loader test",
          notification: {
            version: 1,
            url: "https://webhook.site/loader-test"
          }
        })
      });
      
      console.log('\nDirect call success:', result.content[0].text);
    }
  } catch (error) {
    console.error('Direct load error:', error.message);
  }
}

debugLoader();
