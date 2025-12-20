/**
 * Directory Service
 * Single Responsibility: Manage directory operations
 */

import { Directory, Paths } from "expo-file-system";
import type { DirectoryType } from "../../domain/entities/File";

/**
 * Create directory
 */
export async function createDirectory(uri: string): Promise<boolean> {
  try {
    const dir = new Directory(uri);
    dir.create({ intermediates: true, idempotent: true });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * List directory contents
 */
export async function listDirectory(uri: string): Promise<string[]> {
  try {
    const dir = new Directory(uri);
    const items = dir.list();
    return items.map((item) => item.uri);
  } catch (error) {
    return [];
  }
}

/**
 * Get directory path by type
 */
export function getDirectoryPath(type: DirectoryType): string {
  try {
    switch (type) {
      case "documentDirectory":
        return Paths.document.uri;
      case "cacheDirectory":
        return Paths.cache.uri;
      default:
        return "";
    }
  } catch (error) {
    return "";
  }
}

/**
 * Get document directory path
 */
export function getDocumentDirectory(): string {
  return getDirectoryPath("documentDirectory");
}

/**
 * Get cache directory path
 */
export function getCacheDirectory(): string {
  return getDirectoryPath("cacheDirectory");
}

