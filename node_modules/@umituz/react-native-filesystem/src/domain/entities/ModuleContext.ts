/**
 * Module Context Entity
 *
 * Type definitions for Metro bundler's require.context feature
 * Used for automatic file discovery and module loading
 */

/**
 * Metro bundler require.context return type
 */
export interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}

/**
 * Module collection type
 * Key: module name (without extension)
 * Value: module content
 */
export type ModuleCollection = Record<string, any>;

/**
 * File extension type for filtering
 */
export type FileExtension = '.json' | '.js' | '.ts' | '.tsx';
