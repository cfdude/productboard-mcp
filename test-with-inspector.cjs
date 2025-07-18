// Test create_note via MCP inspector proxy
const axios = require('axios');

async function testCreateNote() {
  const inspectorUrl = 'http://127.0.0.1:6277';
  const token = '6d245029ed624fc4ed5ab25ac68932e667a7041e53346a87bfe68ac86feea589';
  
  try {
    console.log('Testing create_note via MCP inspector...');
    
    const response = await axios.post(`${inspectorUrl}/mcp/tools/call`, {
      name: 'create_note',
      arguments: {
        title: 'Test_testing notes about testing',
        content: 'Test_<b>bold</b> testing notes',
        displayUrl: 'https://developer.productboard.com',
        userEmail: 'rob.sherman@highway.ai',
        userExternalId: 'TEST_1234',
        companyDomain: 'example.com',
        ownerEmail: 'rob.sherman@highway.ai',
        sourceOrigin: 'productboard',
        sourceRecordId: '123',
        tags: ['Test_testing']
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('SUCCESS! Note created:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('ERROR:', error.response?.data || error.message);
  }
}

testCreateNote();