import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { setupToolHandlers } from './build/tools/index.js';

// Create server instance
const server = new Server(
  {
    name: 'productboard-mcp-test',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Setup tools  
setupToolHandlers(server);

// Test create_component directly
console.log('Testing create_component tool...');

try {
  const toolResponse = await server.request(
    {
      method: 'tools/call',
      params: {
        name: 'create_component',
        arguments: {
          name: 'Test Component Direct',
          description: 'Testing create_component directly via server'
        }
      }
    },
    CallToolRequestSchema
  );
  
  console.log('✅ create_component succeeded:', JSON.stringify(toolResponse, null, 2));
} catch (error) {
  console.log('❌ create_component failed:', error.message);
  if (error.code) {
    console.log('Error code:', error.code);
  }
  if (error.data) {
    console.log('Error data:', JSON.stringify(error.data, null, 2));
  }
}

process.exit(0);