/**
 * Tests for Companies tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  handleCompaniesTool,
  setupCompaniesTools,
} from '../../tools/companies.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Companies Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all companies tools with correct schemas', () => {
      const tools = setupCompaniesTools();

      expect(tools).toHaveLength(5);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);
      expect(toolNames).toContain('create_company');
      expect(toolNames).toContain('get_companies');
      expect(toolNames).toContain('get_company');
      expect(toolNames).toContain('update_company');
      expect(toolNames).toContain('delete_company');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupCompaniesTools();
      const getCompanies = tools.find(
        (t: ToolDefinition) => t.name === 'get_companies'
      );

      expect(getCompanies?.inputSchema.properties).toHaveProperty('limit');
      expect(getCompanies?.inputSchema.properties).toHaveProperty('startWith');
      expect(getCompanies?.inputSchema.properties).toHaveProperty('detail');
      expect(getCompanies?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupCompaniesTools();
      const getCompany = tools.find(
        (t: ToolDefinition) => t.name === 'get_company'
      );

      expect(getCompany?.inputSchema.properties).toHaveProperty('detail');
      expect(getCompany?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });
  });

  describe('Parameter Validation', () => {
    it('should validate limit parameter', async () => {
      await expect(
        handleCompaniesTool('get_companies', { limit: 101 })
      ).rejects.toThrow('Limit must be between 1 and 100');

      await expect(
        handleCompaniesTool('get_companies', { limit: 0 })
      ).rejects.toThrow('Limit must be between 1 and 100');
    });

    it('should validate startWith parameter', async () => {
      await expect(
        handleCompaniesTool('get_companies', { startWith: -1 })
      ).rejects.toThrow('startWith must be non-negative');
    });
  });

  // Note: Integration tests with mocked API calls would require more complex setup
  // For now, we're focusing on unit tests for tool definitions and parameter validation
});
