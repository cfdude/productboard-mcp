/**
 * Auto-generated tool documentation
 * Generated: 2025-08-05T00:50:53.126Z
 */
import type { ToolDocumentation } from '../src/documentation/tool-documentation.js';

export const generatedToolDocumentation: Record<string, ToolDocumentation> = {};

// Merge with manually maintained documentation
export function mergeDocumentation(
  manual: Record<string, ToolDocumentation>,
  generated: Record<string, ToolDocumentation>
): Record<string, ToolDocumentation> {
  const merged = { ...generated };
  
  // Manual documentation takes precedence
  Object.entries(manual).forEach(([tool, doc]) => {
    merged[tool] = doc;
  });
  
  return merged;
}
