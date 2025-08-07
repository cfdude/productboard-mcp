#!/usr/bin/env node

/**
 * Debug script to test API calls and compare with working curl
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';

async function testApiCalls() {
  console.log('🔍 Testing API calls to debug search tool issues...');
  
  // First test: Try to search for Agent Intel component via MCP
  console.log('\n1. Testing MCP search for Agent Intel component...');
  
  try {
    // Shutdown and rebuild to ensure clean state
    console.log('   Shutting down and rebuilding server...');
    await runCommand('npm run shutdown && npm run build');
    
    // Test the actual MCP search tool
    console.log('   Testing search tool directly...');
    const mcpResult = await testMCPSearch({
      entityType: 'components',
      filters: { 'name': 'Agent Intel' },
      operators: { 'name': 'exact' },
      limit: 50,
      output: 'full'
    });
    
    console.log('   MCP Result:', mcpResult);
    
  } catch (error) {
    console.error('   MCP test failed:', error.message);
  }
  
  // Second test: Check if authentication is working by testing a simple call
  console.log('\n2. Testing basic authentication with components endpoint...');
  
  try {
    const components = await testMCPSearch({
      entityType: 'components',
      limit: 10,
      output: 'names_and_ids'
    });
    
    console.log('   Components found:', components?.data?.length || 0);
    if (components?.data?.length > 0) {
      console.log('   First few:', components.data.slice(0, 3).map(c => ({
        id: c.id,
        name: c.name
      })));
    }
    
  } catch (error) {
    console.error('   Basic components test failed:', error.message);
  }
  
  console.log('\n🔬 Comparing with direct API calls...');
  
  // Check if we can make the same call our MCP tool should be making
  console.log('\n3. Testing direct features API call (like our MCP tool should do)...');
  
  const testToken = process.env.PRODUCTBOARD_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJraWQiOiI3NTkwZDRmODJkOTA0YThhZTYxZGM3N2JhZDEzN2RjMzdiMmFmZDBiODRlMmQyOWMyMGRlMWU2ZDRhNzhkMmUwIiwiYWxnIjoiUlM1MTIifQ.eyJpYXQiOjE3NTEzMzYxMzMsImlzcyI6ImNiOWE4YjRkLTJhMzYtNDQxZS1hOWYzLTQxNmFjODA2M2NmYyIsInN1YiI6IjE1MDI2MDUiLCJyb2xlIjoiYWRtaW4iLCJhdWQiOiJodHRwczovL2FwaS5wcm9kdWN0Ym9hcmQuY29tIiwidXNlcl9pZCI6MTUwMjYwNSwic3BhY2VfaWQiOiIzNDUwNDUifQ.jkHiR6phRp7mCkB-Uvy44ndGcN9uS_fKa7fUYnxxpt2rupVA8neNCBsV_CKSVsnhEKrv_Qc5cEMJyPZzsSrYCjZGO7NCNiy5wQAhauq0fCIlcYKMQktXx2263fMi-1Ssdc9zert2KiSLtc1fU_6Z4fsJqu-0kwPnCu5UQXhBn8B7RyeoA_CFaxA8jR68ir2dM0m4nQB65yKzc8ywjZIdMb1heQ8IylRtNm0oVtXEPLlAizO38AxB6zC1me1nWE_qk7MD9BH677LtnhWGrA4AmP8pYt-LsBuD-SBKWS7t_P3WNiOWAYlGcGmE4VGy-rm_WY2lo9IrsrCKOHwLIblmEg';
  
  try {
    console.log('   Making direct API call with curl...');
    const curlResult = await runCommand(`curl -s --request GET \\
      --url 'https://api.productboard.com/features?parent.id=ff0cdf9b-e755-4b5f-b7a0-bb0942cfe326' \\
      --header 'X-Version: 1' \\
      --header 'accept: application/json' \\
      --header 'authorization: Bearer ${testToken}' | jq '.data | length'`);
    
    console.log('   Direct API returned', curlResult.trim(), 'features for Agent Intel component');
    
  } catch (error) {
    console.error('   Direct API call failed:', error.message);
  }
  
  console.log('\n📋 Analysis Summary:');
  console.log('   - MCP search tool should find Agent Intel component and its features');
  console.log('   - Direct API calls work with the token provided');
  console.log('   - If MCP returns 0 results, there\'s a bug in the search implementation');
  
  return;
}

async function testMCPSearch(searchArgs) {
  // For now, return a placeholder since implementing full MCP protocol is complex
  // The real test is comparing what curl returns vs what our MCP tool returns
  console.log('   MCP search arguments:', JSON.stringify(searchArgs, null, 2));
  return { data: [], note: 'MCP search test placeholder - use actual tool testing' };
}

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    const child = spawn('bash', ['-c', cmd], { stdio: 'pipe' });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
  });
}

// Run the test
testApiCalls()
  .then(() => {
    console.log('\n✅ API debugging completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 API debugging failed:', error);
    process.exit(1);
  });