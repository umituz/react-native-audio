/**
 * File Manager Service
 * Single Responsibility: Manage file operations (delete, copy, move)
 */

import { File, Directory } from "expo-file-system";
import type { FileOperationResult } from "../../domain/entities/File";

/**
 * Delete file or directory
 */
export async function deleteFile(uri: string): Promise<boolean> {
  try {
    // Try as file first
    try {
      const file = new File(uri);
      if (file.exists) {
        file.delete();
        return true;
      }
    } catch {
      // Not a file, try as directory
    }

    // Try as directory
    try {
      const dir = new Directory(uri);
      if (dir.exists) {
        dir.delete();
        return true;
      }
    } catch {
      // Not a directory either
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Copy file
 */
export async function copyFile(
  sourceUri: string,
  destinationUri: string,
): Promise<FileOperationResult> {
  try {
    const sourceFile = new File(sourceUri);
    const destination = new File(destinationUri);
    sourceFile.copy(destination);
    return { success: true, uri: destinationUri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Move file
 */
export async function moveFile(
  sourceUri: string,
  destinationUri: string,
): Promise<FileOperationResult> {
  try {
    const sourceFile = new File(sourceUri);
    const destination = new File(destinationUri);
    sourceFile.move(destination);
    return { success: true, uri: destinationUri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

