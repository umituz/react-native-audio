/**
 * File Info Service
 * Single Responsibility: Get file information and metadata
 */

import { File } from "expo-file-system";
import type { FileInfo } from "../../domain/entities/File";

/**
 * Get file information
 */
export async function getFileInfo(uri: string): Promise<FileInfo | null> {
  try {
    const file = new File(uri);

    if (!file.exists) {
      return null;
    }

    const info = file.info();

    return {
      uri,
      name: file.name,
      size: file.size || 0,
      exists: file.exists,
      isDirectory: false,
      modificationTime: file.modificationTime || 0,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if file exists
 */
export async function fileExists(uri: string): Promise<boolean> {
  try {
    const file = new File(uri);
    return file.exists;
  } catch (error) {
    return false;
  }
}

/**
 * Get file size
 */
export async function getFileSize(uri: string): Promise<number> {
  const info = await getFileInfo(uri);
  return info?.size || 0;
}

