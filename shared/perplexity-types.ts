/**
 * Type definitions for Perplexity API responses and related data structures
 */

/**
 * Response structure from Perplexity API
 */
export interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations?: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Structured search result returned from Perplexity
 */
export interface PerplexitySearchResult {
  title: string;
  summary: string;
  results: PerplexitySearchResultItem[];
  citations?: string[];
  featuredInfo?: PerplexityFeaturedInfo;
}

/**
 * Individual search result item
 */
export interface PerplexitySearchResultItem {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
}

/**
 * Featured information block that may be included in search results
 */
export interface PerplexityFeaturedInfo {
  title: string;
  content: string[];
  source: string;
}

/**
 * Options for Perplexity API requests
 */
export interface PerplexityRequestOptions {
  model: string;
  temperature?: number;
  max_tokens?: number;
  search_domain_filter?: string[];
  search_recency_filter?: 'hour' | 'day' | 'week' | 'month' | 'year';
  return_related_questions?: boolean;
  frequency_penalty?: number;
}

/**
 * Default models available in Perplexity
 */
export enum PerplexityModel {
  SMALL = 'llama-3.1-sonar-small-128k-online',
  LARGE = 'llama-3.1-sonar-large-128k-online',
  HUGE = 'llama-3.1-sonar-huge-128k-online'
}