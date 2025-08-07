/**
 * ProductBoard API Pagination Handler
 *
 * Handles the correct pagination pattern for ProductBoard API:
 * - First call returns max 100 items by default
 * - No limit/pageLimit/pageOffset parameters accepted
 * - Must recursively follow links.next to get all items
 * - Uses cursor-based pagination via links.next URLs
 */

import { debugLog } from './debug-logger.js';

export interface PaginatedResponse {
  data: any[];
  links?: {
    next?: string;
    prev?: string;
    self?: string;
  };
  meta?: any;
}

export interface PaginationOptions {
  maxPages?: number; // Safety limit to prevent infinite loops (default: 50)
  maxItems?: number; // Maximum total items to fetch (optional)
  onPageFetched?: (
    pageData: any[],
    pageNum: number,
    totalSoFar: number
  ) => void;
}

/**
 * Fetch all pages from a ProductBoard API endpoint using proper cursor pagination
 *
 * @param apiClient - Axios instance configured for ProductBoard API
 * @param endpoint - API endpoint path (e.g., '/features', '/components')
 * @param initialParams - Initial query parameters (filters, etc.)
 * @param options - Pagination options
 * @returns Combined data from all pages
 */
export async function fetchAllPages(
  apiClient: any,
  endpoint: string,
  initialParams: any = {},
  options: PaginationOptions = {}
): Promise<PaginatedResponse> {
  const { maxPages = 50, maxItems, onPageFetched } = options;

  debugLog('pagination-handler', 'Starting paginated fetch', {
    endpoint,
    initialParams,
    maxPages,
    maxItems,
  });

  const allData: any[] = [];
  let currentUrl = endpoint;
  let currentParams = { ...initialParams };
  let pageCount = 0;
  let hasNextPage = true;

  // Remove any invalid pagination parameters that cause API errors
  const invalidParams = ['limit', 'pageLimit', 'pageOffset', 'startWith'];
  invalidParams.forEach(param => {
    if (param in currentParams) {
      debugLog('pagination-handler', `Removing invalid parameter: ${param}`, {
        value: currentParams[param],
      });
      delete currentParams[param];
    }
  });

  while (hasNextPage && pageCount < maxPages) {
    pageCount++;

    debugLog('pagination-handler', `Fetching page ${pageCount}`, {
      url: currentUrl,
      params: currentParams,
      totalItemsSoFar: allData.length,
    });

    try {
      const response = await apiClient.get(currentUrl, {
        params: pageCount === 1 ? currentParams : undefined, // Only use params on first call
      });

      const pageData = response.data?.data || response.data || [];
      const links = response.data?.links || {};

      debugLog('pagination-handler', `Page ${pageCount} fetched`, {
        itemsOnPage: pageData.length,
        totalItems: allData.length + pageData.length,
        hasNextLink: !!links.next,
      });

      // Add page data to results
      if (Array.isArray(pageData)) {
        allData.push(...pageData);
      } else if (pageData) {
        // Single item response
        allData.push(pageData);
      }

      // Call progress callback if provided
      if (onPageFetched) {
        onPageFetched(pageData, pageCount, allData.length);
      }

      // Check if we've hit the item limit
      if (maxItems && allData.length >= maxItems) {
        debugLog('pagination-handler', 'Reached maximum item limit', {
          maxItems,
          actualItems: allData.length,
        });
        break;
      }

      // Check for next page
      if (links.next) {
        // Extract the full URL or cursor from links.next
        if (links.next.startsWith('http')) {
          // Full URL provided - extract the path and params
          const nextUrl = new URL(links.next);
          currentUrl = nextUrl.pathname;
          currentParams = {};
          // Convert URL search params to object
          nextUrl.searchParams.forEach((value, key) => {
            currentParams[key] = value;
          });
        } else {
          // Relative path or cursor provided
          currentUrl = links.next;
          currentParams = {};
        }

        debugLog('pagination-handler', 'Next page available', {
          nextUrl: currentUrl,
          nextParams: currentParams,
        });
      } else {
        hasNextPage = false;
        debugLog('pagination-handler', 'No more pages available');
      }
    } catch (error: any) {
      debugLog('pagination-handler', 'Pagination error', {
        page: pageCount,
        error: error.message,
        status: error.response?.status,
        url: currentUrl,
      });

      // If we have partial results, return them instead of failing completely
      if (allData.length > 0) {
        debugLog(
          'pagination-handler',
          'Returning partial results due to error',
          {
            itemsCollected: allData.length,
          }
        );
        break;
      }

      throw error;
    }
  }

  if (pageCount >= maxPages) {
    debugLog('pagination-handler', 'Reached maximum page limit', {
      maxPages,
      itemsCollected: allData.length,
    });
  }

  debugLog('pagination-handler', 'Pagination completed', {
    totalPages: pageCount,
    totalItems: allData.length,
    endpoint,
  });

  // Trim to max items if specified
  const finalData = maxItems ? allData.slice(0, maxItems) : allData;

  return {
    data: finalData,
    links: {}, // Reset links since we've fetched everything
    meta: {
      totalPages: pageCount,
      totalItems: finalData.length,
      wasLimited: maxItems ? allData.length > maxItems : false,
    },
  };
}

/**
 * Simplified wrapper for common use cases
 */
export async function fetchAllItems(
  apiClient: any,
  endpoint: string,
  filters: any = {}
): Promise<any[]> {
  const result = await fetchAllPages(apiClient, endpoint, filters);
  return result.data;
}
