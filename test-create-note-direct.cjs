// Test create_note with the exact structure from the CURL example
const { ProductboardMCPServer } = require('./build/productboard-server.js');
const { TextEncoder, TextDecoder } = require('util');

// Mock TextEncoder/TextDecoder for Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

async function testCreateNote() {
  const server = new ProductboardMCPServer();
  
  try {
    console.log('Testing create_note with the exact CURL structure...');
    
    // Test the exact structure from the CURL example
    const result = await server.handleRequest({
      method: 'tools/call',
      params: {
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
      }
    });

    console.log('SUCCESS! Note created:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testCreateNote();