/**
 * File Path Service
 * Single Responsibility: Generate and manage file paths
 */

import type { DirectoryType } from "../../domain/entities/File";
import { getDirectoryPath } from "./directory.service";
import { FileUtils } from "../../domain/entities/File";

/**
 * Generate unique file path in specified directory
 */
export function generateFilePath(
  filename: string,
  directory: DirectoryType = "documentDirectory",
): string {
  const dirPath = getDirectoryPath(directory);
  const uniqueFilename = FileUtils.generateUniqueFilename(filename);
  return FileUtils.joinPaths(dirPath, uniqueFilename);
}


