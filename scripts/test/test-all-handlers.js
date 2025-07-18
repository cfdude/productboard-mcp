// Final test of all webhook handlers
import { handleWebhooksTool } from './build/tools/webhooks.js';
import { handleWebhooksTool as handleGenerated, postWebhook, getWebhooks, getWebhook, deleteWebhook } from './generated/tools/webhooks.js';

async function testAllHandlers() {
  console.log('=== FINAL WEBHOOK HANDLER TEST ===\n');
  
  const testData = {
    events: [
      {eventType: "key-result.created"},
      {eventType: "key-result.updated"},
      {eventType: "key-result.deleted"}
    ],
    name: "Final comprehensive test",
    url: "https://webhook.site/final-test",
    headers: {
      authorization: "Bearer final-test-token"
    }
  };
  
  let webhookId;
  
  console.log('1. Testing SOURCE handlers...');
  try {
    // Create via source
    const createResult = await handleWebhooksTool('create_webhook', testData);
    const response = JSON.parse(createResult.content[0].text);
    webhookId = response.webhook.data.id;
    console.log('✓ Source create_webhook:', webhookId);
    
    // List via source
    await handleWebhooksTool('list_webhooks', {});
    console.log('✓ Source list_webhooks');
    
    // Get via source
    await handleWebhooksTool('get_webhook', { id: webhookId });
    console.log('✓ Source get_webhook');
    
    // Support for alternate names
    await handleWebhooksTool('post_webhook', testData);
    console.log('✓ Source post_webhook (alias)');
    
    await handleWebhooksTool('get_webhooks', {});
    console.log('✓ Source get_webhooks (alias)');
    
  } catch (error) {
    console.error('✗ Source handler error:', error.message);
  }
  
  console.log('\n2. Testing GENERATED handlers...');
  try {
    // Create via generated
    const createResult = await postWebhook({
      body: JSON.stringify(testData)
    });
    const response = JSON.parse(createResult.content[0].text);
    const generatedId = response.data.id;
    console.log('✓ Generated postWebhook:', generatedId);
    
    // List via generated
    await getWebhooks({});
    console.log('✓ Generated getWebhooks');
    
    // Get via generated
    await getWebhook({ id: generatedId });
    console.log('✓ Generated getWebhook');
    
    // Delete via generated
    await deleteWebhook({ id: generatedId });
    console.log('✓ Generated deleteWebhook');
    
    // Test handler routing
    await handleGenerated('post_webhook', { body: JSON.stringify(testData) });
    console.log('✓ Generated handler routing');
    
  } catch (error) {
    console.error('✗ Generated handler error:', error.message);
  }
  
  // Cleanup
  if (webhookId) {
    try {
      await handleWebhooksTool('delete_webhook', { id: webhookId });
      console.log('\n✓ Cleanup completed');
    } catch (error) {
      console.error('✗ Cleanup failed:', error.message);
    }
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

testAllHandlers();
