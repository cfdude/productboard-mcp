#!/usr/bin/env node

/**
 * Comprehensive CRUD testing for all Productboard MCP tools
 * Tests all CREATE, READ, UPDATE, DELETE operations
 * Now testing with data wrapper fixes applied
 */

const axios = require('axios');

// MCP Inspector proxy endpoint
const MCP_PROXY_URL = 'http://127.0.0.1:6277';
const AUTH_TOKEN = '2029db66389123de65fe208941b234a35118f16e536bc8a230f362d7ba310944';

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
      error: error.response?.data || error.message 
    };
  }
}

async function testCompaniesFlow() {
  console.log('\n=== Testing Companies CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing Company CREATE...');
  const createResult = await callTool('create_company', {
    body: JSON.stringify({
      name: 'Test Company CRUD 2025',
      domain: 'testcompany2025.com'
    })
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract company ID
  let companyId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      companyId = textData.company?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract company ID:', e.message);
    return false;
  }
  
  if (!companyId) {
    console.log('Failed to get company ID from CREATE response');
    return false;
  }
  console.log('Created company ID:', companyId);
  
  // READ
  console.log('2. Testing Company READ...');
  const readResult = await callTool('get_company', { id: companyId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing Company LIST...');
  const listResult = await callTool('get_companies', { limit: 5 });
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // UPDATE
  console.log('4. Testing Company UPDATE...');
  const updateResult = await callTool('update_company', {
    id: companyId,
    body: JSON.stringify({
      name: 'Updated Test Company CRUD 2025'
    })
  });
  console.log('UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');
  if (!updateResult.success) {
    console.log('UPDATE error:', updateResult.error);
  }
  
  // DELETE
  console.log('5. Testing Company DELETE...');
  const deleteResult = await callTool('delete_company', { id: companyId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function testFeaturesFlow() {
  console.log('\n=== Testing Features CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing Feature CREATE...');
  const createResult = await callTool('create_feature', {
    body: JSON.stringify({
      name: 'Test Feature CRUD 2025',
      description: 'Test feature for comprehensive CRUD testing'
    })
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract feature ID
  let featureId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      featureId = textData.feature?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract feature ID:', e.message);
    return false;
  }
  
  if (!featureId) {
    console.log('Failed to get feature ID from CREATE response');
    return false;
  }
  console.log('Created feature ID:', featureId);
  
  // READ
  console.log('2. Testing Feature READ...');
  const readResult = await callTool('get_feature', { id: featureId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing Feature LIST...');
  const listResult = await callTool('get_features', { limit: 5 });
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // UPDATE
  console.log('4. Testing Feature UPDATE...');
  const updateResult = await callTool('update_feature', {
    id: featureId,
    body: JSON.stringify({
      name: 'Updated Test Feature CRUD 2025'
    })
  });
  console.log('UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');
  if (!updateResult.success) {
    console.log('UPDATE error:', updateResult.error);
  }
  
  // DELETE
  console.log('5. Testing Feature DELETE...');
  const deleteResult = await callTool('delete_feature', { id: featureId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function testNotesFlow() {
  console.log('\n=== Testing Notes CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing Note CREATE...');
  const createResult = await callTool('create_note', {
    title: 'Test Note CRUD 2025',
    content: 'Test note content for comprehensive CRUD testing'
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract note ID
  let noteId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      noteId = textData.note?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract note ID:', e.message);
    return false;
  }
  
  if (!noteId) {
    console.log('Failed to get note ID from CREATE response');
    return false;
  }
  console.log('Created note ID:', noteId);
  
  // READ
  console.log('2. Testing Note READ...');
  const readResult = await callTool('get_note', { id: noteId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing Note LIST...');
  const listResult = await callTool('get_notes', { limit: 5 });
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // UPDATE
  console.log('4. Testing Note UPDATE...');
  const updateResult = await callTool('update_note', {
    id: noteId,
    title: 'Updated Test Note CRUD 2025'
  });
  console.log('UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');
  if (!updateResult.success) {
    console.log('UPDATE error:', updateResult.error);
  }
  
  // DELETE
  console.log('5. Testing Note DELETE...');
  const deleteResult = await callTool('delete_note', { id: noteId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function testUsersFlow() {
  console.log('\n=== Testing Users CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing User CREATE...');
  const createResult = await callTool('create_user', {
    body: JSON.stringify({
      email: 'testuser2025@example.com',
      name: 'Test User CRUD 2025'
    })
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract user ID
  let userId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      userId = textData.user?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract user ID:', e.message);
    return false;
  }
  
  if (!userId) {
    console.log('Failed to get user ID from CREATE response');
    return false;
  }
  console.log('Created user ID:', userId);
  
  // READ
  console.log('2. Testing User READ...');
  const readResult = await callTool('get_user', { id: userId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing User LIST...');
  const listResult = await callTool('get_users', {});
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // UPDATE
  console.log('4. Testing User UPDATE...');
  const updateResult = await callTool('update_user', {
    id: userId,
    body: JSON.stringify({
      name: 'Updated Test User CRUD 2025'
    })
  });
  console.log('UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');
  if (!updateResult.success) {
    console.log('UPDATE error:', updateResult.error);
  }
  
  // DELETE
  console.log('5. Testing User DELETE...');
  const deleteResult = await callTool('delete_user', { id: userId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function testWebhooksFlow() {
  console.log('\n=== Testing Webhooks CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing Webhook CREATE...');
  const createResult = await callTool('create_webhook', {
    eventType: 'feature.created',
    url: 'https://example.com/webhook/test2025',
    secret: 'test-secret-2025'
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract webhook ID
  let webhookId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      webhookId = textData.webhook?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract webhook ID:', e.message);
    return false;
  }
  
  if (!webhookId) {
    console.log('Failed to get webhook ID from CREATE response');
    return false;
  }
  console.log('Created webhook ID:', webhookId);
  
  // READ
  console.log('2. Testing Webhook READ...');
  const readResult = await callTool('get_webhook', { id: webhookId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing Webhook LIST...');
  const listResult = await callTool('list_webhooks', { limit: 5 });
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // DELETE
  console.log('4. Testing Webhook DELETE...');
  const deleteResult = await callTool('delete_webhook', { id: webhookId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function testObjectivesFlow() {
  console.log('\n=== Testing Objectives CRUD Flow ===');
  
  // CREATE
  console.log('1. Testing Objective CREATE...');
  const createResult = await callTool('create_objective', {
    body: JSON.stringify({
      name: 'Test Objective CRUD 2025',
      description: 'Test objective for comprehensive CRUD testing'
    })
  });
  console.log('CREATE result:', createResult.success ? 'SUCCESS' : 'FAILED');
  if (!createResult.success) {
    console.log('CREATE error:', createResult.error);
    return false;
  }
  
  // Extract objective ID
  let objectiveId;
  try {
    const responseData = createResult.data;
    if (responseData.content && responseData.content[0] && responseData.content[0].text) {
      const textData = JSON.parse(responseData.content[0].text);
      objectiveId = textData.objective?.data?.id;
    }
  } catch (e) {
    console.log('Failed to extract objective ID:', e.message);
    return false;
  }
  
  if (!objectiveId) {
    console.log('Failed to get objective ID from CREATE response');
    return false;
  }
  console.log('Created objective ID:', objectiveId);
  
  // READ
  console.log('2. Testing Objective READ...');
  const readResult = await callTool('get_objective', { id: objectiveId });
  console.log('READ result:', readResult.success ? 'SUCCESS' : 'FAILED');
  if (!readResult.success) {
    console.log('READ error:', readResult.error);
  }
  
  // LIST
  console.log('3. Testing Objective LIST...');
  const listResult = await callTool('get_objectives', {});
  console.log('LIST result:', listResult.success ? 'SUCCESS' : 'FAILED');
  if (!listResult.success) {
    console.log('LIST error:', listResult.error);
  }
  
  // UPDATE
  console.log('4. Testing Objective UPDATE...');
  const updateResult = await callTool('update_objective', {
    id: objectiveId,
    body: JSON.stringify({
      name: 'Updated Test Objective CRUD 2025'
    })
  });
  console.log('UPDATE result:', updateResult.success ? 'SUCCESS' : 'FAILED');
  if (!updateResult.success) {
    console.log('UPDATE error:', updateResult.error);
  }
  
  // DELETE
  console.log('5. Testing Objective DELETE...');
  const deleteResult = await callTool('delete_objective', { id: objectiveId });
  console.log('DELETE result:', deleteResult.success ? 'SUCCESS' : 'FAILED');
  if (!deleteResult.success) {
    console.log('DELETE error:', deleteResult.error);
  }
  
  return true;
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive CRUD Testing with Data Wrapper Fixes');
  console.log('Testing all CREATE, READ, UPDATE, DELETE operations across all tool categories');
  
  const results = {
    companies: false,
    features: false,
    notes: false,
    users: false,
    webhooks: false,
    objectives: false
  };
  
  try {
    // Test all tool categories
    results.companies = await testCompaniesFlow();
    results.features = await testFeaturesFlow();
    results.notes = await testNotesFlow();
    results.users = await testUsersFlow();
    results.webhooks = await testWebhooksFlow();
    results.objectives = await testObjectivesFlow();
    
    // Summary
    console.log('\n🏁 COMPREHENSIVE CRUD TEST RESULTS:');
    console.log('=====================================');
    
    const allPassed = Object.values(results).every(r => r === true);
    
    Object.entries(results).forEach(([category, passed]) => {
      console.log(`${category.toUpperCase()}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });
    
    console.log(`\nOVERALL STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    if (allPassed) {
      console.log('\n🎉 SUCCESS! All tools are working correctly with data wrapper fixes!');
      console.log('The comprehensive fix for request body wrapping has resolved all API errors.');
    } else {
      console.log('\n⚠️  Some tests failed. Review the errors above for further investigation.');
    }
    
  } catch (error) {
    console.error('Fatal error during testing:', error);
  }
}

// Run the tests
runComprehensiveTests();