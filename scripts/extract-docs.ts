#!/usr/bin/env node
/**
 * Extracts compressed documentation during build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractDocs() {
  const docsArchive = path.join(__dirname, '..', 'tool-docs.tar.gz');
  const outputDir = path.join(__dirname, '..', 'generated');

  // Check if archive exists
  if (!fs.existsSync(docsArchive)) {
    console.log(
      '⚠️  No tool-docs.tar.gz found. Run npm run generate-docs first.'
    );
    return;
  }

  // Create generated directory (clean it first if it exists)
  if (fs.existsSync(outputDir)) {
    // Remove only the documentation directories, preserve manifest.json and other files
    const items = fs.readdirSync(outputDir);
    items.forEach(item => {
      const itemPath = path.join(outputDir, item);
      if (fs.statSync(itemPath).isDirectory() && item !== 'tools') {
        fs.rmSync(itemPath, { recursive: true });
      } else if (item === 'README.md') {
        fs.unlinkSync(itemPath);
      }
    });
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('📦 Extracting documentation...');

  try {
    // Extract archive
    await tar.extract({
      file: docsArchive,
      cwd: outputDir,
    });

    // Move contents up one level (from generated/tool-docs to generated/)
    const extractedDir = path.join(outputDir, 'tool-docs');
    if (fs.existsSync(extractedDir)) {
      const items = fs.readdirSync(extractedDir);
      items.forEach(item => {
        const src = path.join(extractedDir, item);
        const dest = path.join(outputDir, item);
        fs.renameSync(src, dest);
      });
      fs.rmdirSync(extractedDir);
    }

    console.log('✅ Documentation extracted to generated/');
  } catch (error) {
    console.error('❌ Failed to extract documentation:', error);
    process.exit(1);
  }
}

extractDocs().catch(console.error);
