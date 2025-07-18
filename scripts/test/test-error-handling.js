#!/usr/bin/env node

// Test error handling with deliberate validation error
import { handleNotesTool } from './build/tools/notes.js';

async function testErrorHandling() {
  try {
    console.log('Testing error handling with validation error (user.email + company.domain)...');
    
    // This should trigger a 422 error
    const args = {
      title: "Error Test Note",
      content: "Testing validation error",
      userEmail: "test@example.com",
      companyDomain: "example.com",  // This conflicts with userEmail
    };

    const result = await handleNotesTool('create_note', args);
    console.log('Unexpected success:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('Expected error caught:');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error code:', error.code);
  }
}

testErrorHandling();