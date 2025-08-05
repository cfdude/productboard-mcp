/**
 * Basic context-aware features (simplified approach)
 * Provides intelligent response adaptation and user context awareness
 */

import { performanceCollector } from './performance-monitor.js';

export interface ContextData {
  userId?: string;
  sessionId?: string;
  userPreferences?: {
    dataFormat?: 'detailed' | 'standard' | 'basic';
    includeMetadata?: boolean;
    maxResults?: number;
    timezone?: string;
    language?: string;
  };
  recentQueries?: string[];
  workspaceContext?: {
    id?: string;
    name?: string;
    permissions?: string[];
  };
  instanceContext?: {
    name?: string;
    features?: string[];
    limits?: Record<string, number>;
  };
}

export interface ContextualResponse {
  data: unknown;
  metadata?: {
    responseFormat?: string;
    adaptations?: string[];
    suggestions?: string[];
    relatedActions?: string[];
  };
  userGuidance?: {
    nextSteps?: string[];
    tips?: string[];
    warnings?: string[];
  };
}

export interface AdaptationRule {
  condition: (
    context: ContextData,
    query: string,
    response: unknown
  ) => boolean;
  adaptation: (
    context: ContextData,
    query: string,
    response: unknown
  ) => ContextualResponse;
  priority: number;
  description: string;
}

/**
 * Basic context-aware response adapter
 */
export class ContextAwareAdapter {
  private adaptationRules: AdaptationRule[] = [];
  private contextCache = new Map<string, ContextData>();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Set user context for session
   */
  setContext(sessionId: string, context: ContextData): void {
    this.contextCache.set(sessionId, {
      ...this.contextCache.get(sessionId),
      ...context,
    });
  }

  /**
   * Get user context for session
   */
  getContext(sessionId: string): ContextData {
    return this.contextCache.get(sessionId) || {};
  }

  /**
   * Clear context for session
   */
  clearContext(sessionId: string): void {
    this.contextCache.delete(sessionId);
  }

  /**
   * Adapt response based on context
   */
  adaptResponse(
    sessionId: string,
    query: string,
    originalResponse: unknown
  ): ContextualResponse {
    const metric = performanceCollector.start('context_adaptation');

    try {
      const context = this.getContext(sessionId);

      // Update context with recent query
      this.updateRecentQueries(sessionId, query);

      // Find applicable adaptation rules
      const applicableRules = this.adaptationRules
        .filter(rule => rule.condition(context, query, originalResponse))
        .sort((a, b) => b.priority - a.priority);

      // Apply the highest priority rule
      if (applicableRules.length > 0) {
        const adaptedResponse = applicableRules[0].adaptation(
          context,
          query,
          originalResponse
        );
        performanceCollector.end(metric, true);
        return adaptedResponse;
      }

      // No adaptation rules applied, return basic contextual response
      const basicResponse: ContextualResponse = {
        data: originalResponse,
        metadata: {
          responseFormat: context.userPreferences?.dataFormat || 'standard',
          adaptations: [],
          suggestions: this.generateBasicSuggestions(context, query),
          relatedActions: this.generateRelatedActions(context, query),
        },
        userGuidance: {
          nextSteps: this.generateNextSteps(context, query),
          tips: this.generateTips(context, query),
        },
      };

      performanceCollector.end(metric, true);
      return basicResponse;
    } catch {
      performanceCollector.end(metric, false);
      // Fallback to original response
      return {
        data: originalResponse,
        metadata: {
          responseFormat: 'standard',
          adaptations: ['Error in context adaptation - fallback applied'],
        },
      };
    }
  }

  /**
   * Add custom adaptation rule
   */
  addAdaptationRule(rule: AdaptationRule): void {
    this.adaptationRules.push(rule);
    // Sort by priority to ensure correct order
    this.adaptationRules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Initialize default adaptation rules
   */
  private initializeDefaultRules(): void {
    // Large dataset adaptation
    this.addAdaptationRule({
      condition: (context, _query, response) => {
        return (
          this.isLargeDataset(response) &&
          context.userPreferences?.dataFormat !== 'detailed'
        );
      },
      adaptation: (_context, _query, response) => {
        return {
          data: this.summarizeResponse(response),
          metadata: {
            responseFormat: 'summarized',
            adaptations: ['Large dataset summarized for readability'],
            suggestions: [
              'Use "detail: detailed" for full data',
              'Consider filtering results with specific criteria',
            ],
          },
          userGuidance: {
            tips: [
              'Large datasets are automatically summarized for better readability',
            ],
          },
        };
      },
      priority: 8,
      description: 'Summarize large datasets for better readability',
    });

    // Error guidance adaptation
    this.addAdaptationRule({
      condition: (context, _query, response) => {
        return this.isErrorResponse(response);
      },
      adaptation: (_context, _query, response) => {
        const errorInfo = this.extractErrorInfo(response);
        return {
          data: response,
          metadata: {
            responseFormat: 'error_enhanced',
            adaptations: ['Error response enhanced with guidance'],
          },
          userGuidance: {
            nextSteps: this.generateErrorRecoverySteps(errorInfo),
            tips: this.generateErrorTips(errorInfo),
            warnings: [errorInfo.message || 'Operation failed'],
          },
        };
      },
      priority: 10,
      description: 'Enhance error responses with recovery guidance',
    });

    // Format preference adaptation
    this.addAdaptationRule({
      condition: (context, _query, response) => {
        return (
          context.userPreferences?.dataFormat === 'basic' &&
          this.isDetailedResponse(response)
        );
      },
      adaptation: (_context, _query, response) => {
        return {
          data: this.simplifyResponse(response),
          metadata: {
            responseFormat: 'basic',
            adaptations: ['Response simplified based on user preference'],
            suggestions: ['Use "detail: detailed" to see full information'],
          },
        };
      },
      priority: 6,
      description: 'Simplify responses for users preferring basic format',
    });

    // Workspace context adaptation
    this.addAdaptationRule({
      condition: (context, _query, response) => {
        return !!(
          context.workspaceContext?.permissions &&
          this.containsRestrictedData(
            response,
            context.workspaceContext.permissions
          )
        );
      },
      adaptation: (context, _query, response) => {
        return {
          data: this.filterByPermissions(
            response,
            context.workspaceContext?.permissions || []
          ),
          metadata: {
            responseFormat: 'permission_filtered',
            adaptations: ['Data filtered based on workspace permissions'],
          },
          userGuidance: {
            warnings: [
              'Some data may be hidden due to permission restrictions',
            ],
          },
        };
      },
      priority: 9,
      description: 'Filter data based on workspace permissions',
    });
  }

  /**
   * Update recent queries for context
   */
  private updateRecentQueries(sessionId: string, query: string): void {
    const context = this.getContext(sessionId);
    const recentQueries = context.recentQueries || [];

    // Add new query and keep only last 10
    recentQueries.unshift(query);
    context.recentQueries = recentQueries.slice(0, 10);

    this.setContext(sessionId, context);
  }

  /**
   * Check if response is a large dataset
   */
  private isLargeDataset(response: unknown): boolean {
    if (Array.isArray(response)) {
      return response.length > 50;
    }
    if (typeof response === 'object' && response !== null) {
      const obj = response as Record<string, unknown>;
      if (obj.content && Array.isArray(obj.content)) {
        return obj.content.length > 50;
      }
      // Check if response has large text content
      const text = JSON.stringify(response);
      return text.length > 10000;
    }
    return false;
  }

  /**
   * Check if response is an error
   */
  private isErrorResponse(response: unknown): boolean {
    if (typeof response === 'object' && response !== null) {
      const obj = response as Record<string, unknown>;
      return (
        obj.error !== undefined ||
        obj.code !== undefined ||
        (typeof obj.content === 'object' &&
          (obj.content as Record<string, unknown>)?.error !== undefined)
      );
    }
    return false;
  }

  /**
   * Check if response contains detailed information
   */
  private isDetailedResponse(response: unknown): boolean {
    if (typeof response === 'object' && response !== null) {
      const text = JSON.stringify(response);
      return (
        text.length > 5000 ||
        Object.keys(response as Record<string, unknown>).length > 20
      );
    }
    return false;
  }

  /**
   * Check if response contains restricted data
   */
  private containsRestrictedData(
    response: unknown,
    permissions: string[]
  ): boolean {
    // Simplified permission check - in real implementation would be more sophisticated
    const hasFullAccess =
      permissions.includes('admin') || permissions.includes('full_access');
    return !hasFullAccess && typeof response === 'object' && response !== null;
  }

  /**
   * Summarize large response
   */
  private summarizeResponse(response: unknown): unknown {
    if (Array.isArray(response)) {
      return {
        summary: `Showing first 10 of ${response.length} items`,
        items: response.slice(0, 10),
        totalCount: response.length,
      };
    }
    return response;
  }

  /**
   * Simplify detailed response
   */
  private simplifyResponse(response: unknown): unknown {
    if (typeof response === 'object' && response !== null) {
      const obj = response as Record<string, unknown>;
      // Keep only essential fields
      const essentialFields = [
        'id',
        'name',
        'title',
        'summary',
        'status',
        'type',
      ];
      const simplified: Record<string, unknown> = {};

      for (const field of essentialFields) {
        if (obj[field] !== undefined) {
          simplified[field] = obj[field];
        }
      }

      // If no essential fields found, return first few fields
      if (Object.keys(simplified).length === 0) {
        const allKeys = Object.keys(obj);
        for (let i = 0; i < Math.min(5, allKeys.length); i++) {
          simplified[allKeys[i]] = obj[allKeys[i]];
        }
      }

      return simplified;
    }
    return response;
  }

  /**
   * Filter response by permissions
   */
  private filterByPermissions(
    response: unknown,
    permissions: string[]
  ): unknown {
    // Simplified implementation - would be more sophisticated in real system
    if (permissions.includes('admin') || permissions.includes('full_access')) {
      return response;
    }

    // For demo purposes, just add a filtered marker
    if (typeof response === 'object' && response !== null) {
      return {
        ...(response as Record<string, unknown>),
        _filtered: true,
        _reason: 'Some fields may be hidden due to permissions',
      };
    }

    return response;
  }

  /**
   * Extract error information
   */
  private extractErrorInfo(response: unknown): {
    message?: string;
    code?: string;
    type?: string;
  } {
    if (typeof response === 'object' && response !== null) {
      const obj = response as Record<string, unknown>;
      return {
        message: (obj.error as string) || (obj.message as string),
        code: obj.code as string,
        type: (obj.type as string) || 'unknown',
      };
    }
    return {};
  }

  /**
   * Generate basic suggestions based on context and query
   */
  private generateBasicSuggestions(
    context: ContextData,
    query: string
  ): string[] {
    const suggestions: string[] = [];

    if (
      query.toLowerCase().includes('list') ||
      query.toLowerCase().includes('get')
    ) {
      suggestions.push('Try filtering results with specific criteria');
      if (!query.includes('limit')) {
        suggestions.push('Use limit parameter to reduce results');
      }
    }

    if (context.userPreferences?.dataFormat === 'basic') {
      suggestions.push(
        'Use "detail: detailed" for more comprehensive information'
      );
    }

    return suggestions;
  }

  /**
   * Generate related actions based on context and query
   */
  private generateRelatedActions(
    context: ContextData,
    query: string
  ): string[] {
    const actions: string[] = [];

    if (query.toLowerCase().includes('create')) {
      actions.push('Update the created item', 'List related items');
    } else if (query.toLowerCase().includes('update')) {
      actions.push('Get updated item details', 'Create related items');
    } else if (
      query.toLowerCase().includes('list') ||
      query.toLowerCase().includes('get')
    ) {
      actions.push('Update selected items', 'Create new item');
    }

    return actions;
  }

  /**
   * Generate next steps based on context and query
   */
  private generateNextSteps(context: ContextData, query: string): string[] {
    const steps: string[] = [];

    if (query.toLowerCase().includes('create')) {
      steps.push('Verify the created item details');
      steps.push('Consider setting up related items or workflows');
    } else if (query.toLowerCase().includes('list')) {
      steps.push('Review the results and identify items to work with');
      steps.push('Consider filtering or sorting for better focus');
    }

    return steps;
  }

  /**
   * Generate contextual tips
   */
  private generateTips(context: ContextData, _query: string): string[] {
    const tips: string[] = [];

    if (context.recentQueries && context.recentQueries.length > 5) {
      tips.push(
        'You seem to be doing similar queries - consider using filters to save time'
      );
    }

    if (!context.userPreferences?.dataFormat) {
      tips.push(
        'Set your preferred data format in user preferences for better experience'
      );
    }

    return tips;
  }

  /**
   * Generate error recovery steps
   */
  private generateErrorRecoverySteps(errorInfo: {
    message?: string;
    code?: string;
    type?: string;
  }): string[] {
    const steps: string[] = [];

    if (errorInfo.code === '404' || errorInfo.message?.includes('not found')) {
      steps.push('Verify the item ID is correct');
      steps.push('Check if the item exists in the current workspace');
    } else if (
      errorInfo.code === '403' ||
      errorInfo.message?.includes('permission')
    ) {
      steps.push('Check your permissions for this operation');
      steps.push('Contact your workspace admin if needed');
    } else if (
      errorInfo.code === '400' ||
      errorInfo.message?.includes('validation')
    ) {
      steps.push('Review the request parameters');
      steps.push('Check the API documentation for required fields');
    } else {
      steps.push('Try the operation again');
      steps.push('Check your network connection');
    }

    return steps;
  }

  /**
   * Generate error-specific tips
   */
  private generateErrorTips(errorInfo: {
    message?: string;
    code?: string;
    type?: string;
  }): string[] {
    const tips: string[] = [];

    if (errorInfo.message?.includes('rate limit')) {
      tips.push('Wait a moment before retrying to avoid rate limiting');
    } else if (errorInfo.message?.includes('timeout')) {
      tips.push('Consider reducing the scope of your request');
    }

    return tips;
  }

  /**
   * Get context statistics
   */
  getContextStats(): {
    totalSessions: number;
    activeRules: number;
    averageAdaptations: number;
  } {
    return {
      totalSessions: this.contextCache.size,
      activeRules: this.adaptationRules.length,
      averageAdaptations: 0, // Would calculate from metrics in real implementation
    };
  }

  /**
   * Clean old context data
   */
  cleanOldContexts(_maxAgeMs: number = 3600000): number {
    // Simplified cleanup - in real implementation would track timestamps
    const beforeSize = this.contextCache.size;

    // For demonstration, clear contexts older than maxAge
    // In real implementation, would check timestamps
    if (this.contextCache.size > 100) {
      const entries = Array.from(this.contextCache.entries());
      // Keep only the most recent 50 sessions
      this.contextCache.clear();
      entries.slice(-50).forEach(([key, value]) => {
        this.contextCache.set(key, value);
      });
    }

    return beforeSize - this.contextCache.size;
  }
}

// Export singleton instance
export const contextAwareAdapter = new ContextAwareAdapter();
