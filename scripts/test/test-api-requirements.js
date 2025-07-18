// Test API requirements for various create endpoints
import { withContext } from './build/utils/tool-wrapper.js';

async function testAPIRequirements() {
  console.log('Testing API requirements for create endpoints...\n');

  // Test create_feature with minimal fields
  await testEndpoint('POST /features - minimal', async (context) => {
    return await context.axios.post('/features', {
      data: {
        name: "Test Feature Minimal"
      }
    });
  });

  // Test create_feature with all fields from working example
  await testEndpoint('POST /features - full', async (context) => {
    return await context.axios.post('/features', {
      data: {
        type: "feature",
        name: "Test Feature Full",
        status: { name: "In progress" },
        parent: { product: { id: "348543ba-a139-4d9e-b4f7-77e6c219de18" } },
        timeframe: { startDate: "2025-08-01", endDate: "none" },
        owner: { email: "rob.sherman@highway.ai" },
        description: "Test description"
      }
    });
  });

  // Test create_component with minimal fields
  await testEndpoint('POST /components - minimal', async (context) => {
    return await context.axios.post('/components', {
      data: {
        name: "Test Component Minimal"
      }
    });
  });

  // Test create_initiative with minimal fields
  await testEndpoint('POST /initiatives - minimal', async (context) => {
    return await context.axios.post('/initiatives', {
      data: {
        name: "Test Initiative Minimal"
      }
    });
  });

  // Test create_key_result with minimal fields
  await testEndpoint('POST /key-results - minimal', async (context) => {
    return await context.axios.post('/key-results', {
      data: {
        name: "Test Key Result Minimal",
        objective: { id: "f202731e-078e-41ba-90d4-40492a89ae24" }
      }
    });
  });
}

async function testEndpoint(name, apiCall) {
  try {
    console.log(`\nTesting ${name}...`);
    const result = await withContext(apiCall);
    console.log(`✅ SUCCESS:`, JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.log(`❌ FAILED:`, error.response?.data || error.message);
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => {
        console.log(`  - ${err.title}: ${err.detail}`);
      });
    }
  }
}

testAPIRequirements();