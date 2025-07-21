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
  "create_feature",
  "get_features", 
  "get_feature",
  "update_feature",
  "update_feature_deprecated",
  "delete_feature",
  "list_links_to_initiatives",
  "create_initiative_link",
  "delete_initiative_link",
  "list_links_to_objectives",
  "create_objective_link",
  "delete_objective_link",
  "create_component",
  "get_components",
  "get_component",
  "update_component",
  "update_component_deprecated",
  "get_products",
  "get_product",
  "update_product",
  "update_product_deprecated",
  "get_feature_statuses"
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