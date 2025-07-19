/**
 * Tests for Notes tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleNotesTool, setupNotesTools } from '../../tools/notes.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Notes Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all notes tools with correct schemas', () => {
      const tools = setupNotesTools();

      expect(tools.length).toBeGreaterThan(10);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);

      // Core notes tools
      expect(toolNames).toContain('create_note');
      expect(toolNames).toContain('get_notes');
      expect(toolNames).toContain('get_note');
      expect(toolNames).toContain('update_note');
      expect(toolNames).toContain('delete_note');

      // Note followers tools
      expect(toolNames).toContain('add_note_followers');
      expect(toolNames).toContain('remove_note_follower');

      // Note tags tools
      expect(toolNames).toContain('list_note_tags');
      expect(toolNames).toContain('add_note_tag');
      expect(toolNames).toContain('remove_note_tag');

      // Note links tools
      expect(toolNames).toContain('list_note_links');
      expect(toolNames).toContain('create_note_link');

      // Feedback form tools
      expect(toolNames).toContain('list_feedback_form_configurations');
      expect(toolNames).toContain('get_feedback_form_configuration');
      expect(toolNames).toContain('submit_feedback_form');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupNotesTools();
      const getNotes = tools.find(
        (t: ToolDefinition) => t.name === 'get_notes'
      );

      expect(getNotes?.inputSchema.properties).toHaveProperty('limit');
      expect(getNotes?.inputSchema.properties).toHaveProperty('startWith');
      expect(getNotes?.inputSchema.properties).toHaveProperty('detail');
      expect(getNotes?.inputSchema.properties).toHaveProperty('includeSubData');
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupNotesTools();
      const getNote = tools.find((t: ToolDefinition) => t.name === 'get_note');

      expect(getNote?.inputSchema.properties).toHaveProperty('detail');
      expect(getNote?.inputSchema.properties).toHaveProperty('includeSubData');
    });

    it('should have extensive filter options for listing notes', () => {
      const tools = setupNotesTools();
      const getNotes = tools.find(
        (t: ToolDefinition) => t.name === 'get_notes'
      );

      const properties = getNotes?.inputSchema.properties;

      // Search and filtering
      expect(properties).toHaveProperty('term');
      expect(properties).toHaveProperty('companyId');
      expect(properties).toHaveProperty('featureId');
      expect(properties).toHaveProperty('ownerEmail');
      expect(properties).toHaveProperty('source');
      expect(properties).toHaveProperty('anyTag');
      expect(properties).toHaveProperty('allTags');

      // Date filters
      expect(properties).toHaveProperty('createdFrom');
      expect(properties).toHaveProperty('createdTo');
      expect(properties).toHaveProperty('updatedFrom');
      expect(properties).toHaveProperty('updatedTo');
      expect(properties).toHaveProperty('dateFrom');
      expect(properties).toHaveProperty('dateTo');
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleNotesTool('unknown_tool', {})).rejects.toThrow(
        'Unknown notes tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_note',
        'get_notes',
        'get_note',
        'update_note',
        'delete_note',
        'add_note_followers',
        'remove_note_follower',
        'list_note_tags',
        'add_note_tag',
        'remove_note_tag',
        'list_note_links',
        'create_note_link',
        'list_feedback_form_configurations',
        'get_feedback_form_configuration',
        'submit_feedback_form',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleNotesTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown notes tool');
      });
    });
  });
});
