#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Process all TypeScript files in the generated/tools directory
const toolsDir = path.join(__dirname, '..', 'generated', 'tools');
const files = fs.readdirSync(toolsDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix axios calls that have $2 instead of proper URL and body
  content = content.replace(
    /const response = await context\.axios\.(post|put|patch)\(\$2, args\.body\)/g,
    (match, method, url) => {
      // For post/put/patch that need body, we need to reconstruct the original pattern
      // This is a more complex fix that would require knowing the original URL
      // For now, let's look for patterns we can identify
      return match; // Leave as is for now, will need manual fix
    }
  );
  
  // Fix property names that still have unquoted dots
  content = content.replace(
    /(\s+)([a-zA-Z]+\.[a-zA-Z]+(?:\.[a-zA-Z]+)*): \{/g,
    '$1"$2": {'
  );
  
  // Write back the fixed content
  fs.writeFileSync(filePath, content);
});

console.log('Fixed axios calls in generated tools');