#!/usr/bin/env node

/**
 * Shutdown script for ProductBoard MCP Server
 * Cleanly stops all running instances and clears caches
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

console.log('🛑 Shutting down ProductBoard MCP Server...\n');

// 1. Find and kill all productboard-mcp processes
try {
  const processes = execSync(
    'ps aux | grep "productboard-mcp/build/index.js" | grep -v grep || true',
    { encoding: 'utf8' }
  ).trim();

  if (processes) {
    console.log('📋 Found running ProductBoard MCP instances:');
    const lines = processes.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const parts = line.split(/\s+/);
      const pid = parts[1];
      const startTime = parts[8];
      console.log(`  - PID ${pid} (started ${startTime})`);
      
      try {
        process.kill(parseInt(pid), 'SIGTERM');
        console.log(`    ✅ Sent SIGTERM to PID ${pid}`);
      } catch (error) {
        console.log(`    ⚠️  Failed to kill PID ${pid}: ${error.message}`);
      }
    });
    
    // Wait a moment for graceful shutdown
    console.log('\n⏳ Waiting for graceful shutdown...');
    execSync('sleep 2');
    
    // Force kill any remaining processes
    lines.forEach(line => {
      const parts = line.split(/\s+/);
      const pid = parts[1];
      
      try {
        process.kill(parseInt(pid), 'SIGKILL');
        console.log(`  ✅ Force killed PID ${pid}`);
      } catch (error) {
        // Process already dead, that's fine
      }
    });
  } else {
    console.log('✅ No running ProductBoard MCP instances found');
  }
} catch (error) {
  console.error('❌ Error finding ProductBoard MCP processes:', error.message);
}

// 2. Find and kill any MCP inspector processes
try {
  const inspectors = execSync(
    'ps aux | grep "@modelcontextprotocol/inspector" | grep -v grep || true',
    { encoding: 'utf8' }
  ).trim();

  if (inspectors) {
    console.log('\n📋 Found running MCP inspector instances:');
    const lines = inspectors.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const parts = line.split(/\s+/);
      const pid = parts[1];
      console.log(`  - Inspector PID ${pid}`);
      
      try {
        process.kill(parseInt(pid), 'SIGTERM');
        console.log(`    ✅ Killed inspector PID ${pid}`);
      } catch (error) {
        console.log(`    ⚠️  Failed to kill inspector PID ${pid}: ${error.message}`);
      }
    });
  } else {
    console.log('\n✅ No running MCP inspector instances found');
  }
} catch (error) {
  console.error('❌ Error finding MCP inspector processes:', error.message);
}

// 2. Clear debug logs if they exist
const debugLogPath = join(process.cwd(), 'mcp-debug.log');
if (existsSync(debugLogPath)) {
  try {
    unlinkSync(debugLogPath);
    console.log('\n🗑️  Cleared debug log file');
  } catch (error) {
    console.error('⚠️  Failed to clear debug log:', error.message);
  }
}

// 3. Clear any other temporary files
const tempFiles = [
  'test-search-debug.js',
  'test-clear-cache.js',
  'test-direct-api.js',
  'test-products-handler.js',
  'test-search-engine.js'
];

tempFiles.forEach(file => {
  const filePath = join(process.cwd(), file);
  if (existsSync(filePath)) {
    try {
      unlinkSync(filePath);
      console.log(`🗑️  Removed temporary file: ${file}`);
    } catch (error) {
      console.error(`⚠️  Failed to remove ${file}:`, error.message);
    }
  }
});

console.log('\n✅ Shutdown complete!\n');