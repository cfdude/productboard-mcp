#!/usr/bin/env node
/**
 * Remove 'productboard_' prefix from tool names in manifest and generated files
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'generated', 'manifest.json');
const TOOLS_DIR = path.join(PROJECT_ROOT, 'generated', 'tools');

// Read and modify manifest
function updateManifest() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  
  // Update tool names in categories
  for (const [categoryKey, category] of Object.entries(manifest.categories)) {
    if (category.tools) {
      category.tools = category.tools.map(toolName => 
        toolName.replace(/^productboard_/, '')
      );
    }
  }
  
  // Update tool names in tools object
  const newTools = {};
  for (const [toolName, toolInfo] of Object.entries(manifest.tools)) {
    const newName = toolName.replace(/^productboard_/, '');
    newTools[newName] = toolInfo;
  }
  manifest.tools = newTools;
  
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('Updated manifest.json');
}

// Update tool names in JavaScript files
function updateToolFiles() {
  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const filePath = path.join(TOOLS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace productboard_ prefix in tool names
    content = content.replace(/name: "productboard_([^"]+)"/g, 'name: "$1"');
    content = content.replace(/case "productboard_([^"]+)":/g, 'case "$1":');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

// Run updates
updateManifest();
updateToolFiles();
console.log('All files updated successfully!');