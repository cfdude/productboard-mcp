#!/usr/bin/env node

import { ToolRegistry } from './build/tools/registry.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugSchemas() {
  console.log('🔍 Starting schema debug analysis...\n');

  // Create registry and load manifest
  const registry = new ToolRegistry();
  const manifestPath = path.join(__dirname, 'generated', 'manifest.json');
  
  console.log('📄 Loading manifest from:', manifestPath);
  registry.loadManifest(manifestPath);
  
  console.log('📝 Registering tools from manifest...');
  await registry.registerFromManifest();
  
  console.log('🛠️  Getting tool definitions...');
  const definitions = await registry.getToolDefinitions();
  
  // Find our target tools
  const createFeature = definitions.find(def => def.name === 'create_feature');
  const createComponent = definitions.find(def => def.name === 'create_component');
  
  console.log('\n🎯 SCHEMA COMPARISON:');
  console.log('═'.repeat(80));
  
  if (createFeature) {
    console.log('\n✅ create_feature schema:');
    console.log(JSON.stringify(createFeature.inputSchema, null, 2));
  } else {
    console.log('\n❌ create_feature schema NOT FOUND');
  }
  
  console.log('\n' + '-'.repeat(40));
  
  if (createComponent) {
    console.log('\n🔧 create_component schema:');
    console.log(JSON.stringify(createComponent.inputSchema, null, 2));
  } else {
    console.log('\n❌ create_component schema NOT FOUND');
  }
  
  console.log('\n' + '═'.repeat(80));
  
  // Check if they're identical
  if (createFeature && createComponent) {
    const featureSchema = JSON.stringify(createFeature.inputSchema, null, 2);
    const componentSchema = JSON.stringify(createComponent.inputSchema, null, 2);
    
    console.log('\n🔍 SCHEMA IDENTITY CHECK:');
    if (featureSchema === componentSchema) {
      console.log('✅ Schemas are IDENTICAL');
    } else {
      console.log('❌ Schemas are DIFFERENT');
      console.log('\nDifferences:');
      
      // Simple diff approach
      const featureLines = featureSchema.split('\n');
      const componentLines = componentSchema.split('\n');
      
      for (let i = 0; i < Math.max(featureLines.length, componentLines.length); i++) {
        const fLine = featureLines[i] || '';
        const cLine = componentLines[i] || '';
        
        if (fLine !== cLine) {
          console.log(`Line ${i + 1}:`);
          console.log(`  Feature:   ${fLine}`);
          console.log(`  Component: ${cLine}`);
        }
      }
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Total definitions loaded: ${definitions.length}`);
  console.log(`create_feature found: ${createFeature ? '✅' : '❌'}`);
  console.log(`create_component found: ${createComponent ? '✅' : '❌'}`);
}

debugSchemas().catch(console.error);