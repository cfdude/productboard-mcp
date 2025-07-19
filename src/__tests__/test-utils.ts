/**
 * Test utility types and helpers
 */
import type {
  MultiInstanceProductboardConfig,
  ProductboardInstanceConfig,
} from '../types.js';

export interface MockAxiosInstance {
  get: any;
  post: any;
  patch: any;
  put: any;
  delete: any;
}

export interface MockContext {
  config: MultiInstanceProductboardConfig;
  instance: ProductboardInstanceConfig;
  workspaceId?: string;
  axios: MockAxiosInstance;
}

export type ContextFunction<T = any> = (context: MockContext) => Promise<T>;
