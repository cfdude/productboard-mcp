const axios = require('axios');

// MCP Inspector proxy endpoint
const MCP_PROXY_URL = 'http://localhost:6277';
const AUTH_TOKEN = 'ad395b0ac9a487d8141806249b1709ba1bc998388d472243d4a96ac0e91e25ff';

async function callTool(toolName, args) {
  try {
    const response = await axios.post(
      `${MCP_PROXY_URL}/call-tool`,
      {
        name: toolName,
        arguments: args
      },
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      fullError: error
    };
  }
}

async function testCreateNote() {
  console.log('Testing create_note with validation rule fix...');
  
  // Test 1: With user email only (no company)
  console.log('\n=== Test 1: User email only (no company) ===');
  const result1 = await callTool('create_note', {
    title: 'Test Note - User Only',
    content: 'Testing with just user information',
    userEmail: 'test@example.com',
    userExternalId: 'TEST_123'
  });
  console.log('Result:', result1.success ? 'SUCCESS' : 'FAILED');
  if (!result1.success) {
    console.log('Error:', result1.error);
    console.log('Full error:', JSON.stringify(result1.fullError.response?.data || result1.fullError.message, null, 2));
  }
  
  // Test 2: With company domain only (no user email)
  console.log('\n=== Test 2: Company domain only (no user email) ===');
  const result2 = await callTool('create_note', {
    title: 'Test Note - Company Only',
    content: 'Testing with just company information',
    companyDomain: 'example.com'
  });
  console.log('Result:', result2.success ? 'SUCCESS' : 'FAILED');
  if (!result2.success) {
    console.log('Error:', result2.error);
  }
  
  // Test 3: Full example matching your working script
  console.log('\n=== Test 3: Full example (no company due to validation rule) ===');
  const result3 = await callTool('create_note', {
    title: 'Test_testing notes about testing',
    content: 'Test_<b>bold</b> testing notes',
    displayUrl: 'https://developer.productboard.com',
    userEmail: 'rob.sherman@highway.ai',
    userExternalId: 'TEST_1234',
    ownerEmail: 'rob.sherman@highway.ai',
    sourceOrigin: 'productboard',
    sourceRecordId: '123',
    tags: ['Test_testing']
  });
  console.log('Result:', result3.success ? 'SUCCESS' : 'FAILED');
  if (!result3.success) {
    console.log('Error:', result3.error);
  } else {
    console.log('Success data:', result3.data);
  }
}

testCreateNote().catch(console.error);