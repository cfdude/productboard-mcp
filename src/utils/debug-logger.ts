/**
 * Simple file-based debug logger for MCP server
 */
import { appendFileSync } from 'fs';
import { join } from 'path';

const DEBUG_LOG_PATH = join(process.cwd(), 'mcp-debug.log');

export function debugLog(component: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    component,
    message,
    ...(data && { data }),
  };

  try {
    appendFileSync(DEBUG_LOG_PATH, JSON.stringify(logEntry) + '\n', 'utf-8');
  } catch {
    // Silently fail if we can't write to log
  }
}

export function clearDebugLog() {
  try {
    appendFileSync(DEBUG_LOG_PATH, '\n--- LOG CLEARED ---\n', 'utf-8');
  } catch {
    // Silently fail
  }
}
