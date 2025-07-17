#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the manifest
const manifestPath = join(__dirname, '..', 'generated', 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

// Tools that should be moved to products category
const productAndComponentTools = [
  'productboard_create_feature',
  'productboard_get_features', 
  'productboard_get_feature',
  'productboard_update_feature',
  'productboard_update_feature_deprecated',
  'productboard_delete_feature',
  'productboard_list_links_to_initiatives',
  'productboard_create_initiative_link',
  'productboard_delete_initiative_link',
  'productboard_list_links_to_objectives',
  'productboard_create_objective_link',
  'productboard_delete_objective_link',
  'productboard_create_component',
  'productboard_get_components',
  'productboard_get_component',
  'productboard_update_component',
  'productboard_update_component_deprecated',
  'productboard_get_products',
  'productboard_get_product',
  'productboard_update_product',
  'productboard_update_product_deprecated',
  'productboard_get_feature_statuses'
];

// Clear tools from old categories
manifest.categories['product hierarchy'].tools = [];
manifest.categories.components.tools = [];
manifest.categories.features.tools = [];

// Move all tools to products category
manifest.categories.products.tools = productAndComponentTools;
manifest.categories.products.displayName = "Products & Components";
manifest.categories.products.description = "Manage products, components, and features in Productboard";

// Update tool categories
productAndComponentTools.forEach(toolName => {
  if (manifest.tools[toolName]) {
    manifest.tools[toolName].category = 'products';
  }
});

// Write the updated manifest
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('✅ Manifest reorganized successfully!');
console.log(`   - Moved ${productAndComponentTools.length} tools to "products" category`);
console.log('   - Updated category display name to "Products & Components"');