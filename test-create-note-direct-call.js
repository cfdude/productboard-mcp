#!/usr/bin/env node

// Test create_note directly by calling the function
import { handleNotesTool } from './build/tools/notes.js';

async function testCreateNote() {
  try {
    console.log('Testing create_note with exact HTTP example structure...');
    
    // Test with all fields including user info (but not company)
    const timestamp = Date.now();
    const args = {
      title: "Complete Test Note - " + timestamp,
      content: "<p>Testing create_note with <b>all available fields</b> including:</p><ul><li>HTML formatting</li><li>User information</li><li>Source tracking</li><li>Tags</li></ul>",
      displayUrl: "https://developer.productboard.com/reference/create_note-1",
      userEmail: "test-user-" + timestamp + "@example.com",  // Unique email to avoid conflicts
      userName: "Test User " + timestamp,
      userExternalId: "TEST_USER_" + timestamp,
      // companyDomain: "highway.ai",  // Skip this - causes 422 error
      sourceOrigin: "api_test",
      sourceRecordId: "TEST-RECORD-" + timestamp,
      ownerEmail: "rob.sherman@highway.ai",
      tags: ["Test", "API", "MCP", "Full-Fields"]
    };

    const result = await handleNotesTool('create_note', args);
    console.log('SUCCESS! Note created:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Error details:', error);
  }
}

testCreateNote();