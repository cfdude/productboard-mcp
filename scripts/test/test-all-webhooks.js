// Test all webhook operations
import { handleWebhooksTool } from './build/tools/webhooks.js';

async function testAllWebhooks() {
  console.log('=== TESTING ALL WEBHOOK OPERATIONS ===\n');
  
  let webhookId;
  
  // 1. Create webhook (MCP format with body)
  try {
    console.log('1. Creating webhook (MCP format)...');
    const createResult = await handleWebhooksTool('post_webhook', {
      body: JSON.stringify({
        events: [
          {eventType: "objective.created"},
          {eventType: "objective.updated"}
        ],
        name: "Complete MCP format test",
        notification: {
          version: 1,
          url: "https://webhook.site/complete-mcp-test",
          headers: {
            authorization: "Bearer test-token"
          }
        }
      })
    });
    
    const response = JSON.parse(createResult.content[0].text);
    webhookId = response.webhook.data.id;
    console.log('✓ Created webhook:', webhookId);
  } catch (error) {
    console.error('✗ Create failed:', error.message);
    return;
  }
  
  // 2. List webhooks
  try {
    console.log('\n2. Listing webhooks...');
    const listResult = await handleWebhooksTool('get_webhooks', {});
    const response = JSON.parse(listResult.content[0].text);
    console.log('✓ Found', response.data.length, 'webhooks');
  } catch (error) {
    console.error('✗ List failed:', error.message);
  }
  
  // 3. Get specific webhook
  try {
    console.log('\n3. Getting specific webhook...');
    const getResult = await handleWebhooksTool('get_webhook', { id: webhookId });
    console.log('✓ Retrieved webhook successfully');
  } catch (error) {
    console.error('✗ Get failed:', error.message);
  }
  
  // 4. Delete webhook
  try {
    console.log('\n4. Deleting webhook...');
    await handleWebhooksTool('delete_webhook', { id: webhookId });
    console.log('✓ Deleted webhook successfully');
  } catch (error) {
    console.error('✗ Delete failed:', error.message);
  }
  
  console.log('\n=== ALL TESTS COMPLETE ===');
}

testAllWebhooks();
