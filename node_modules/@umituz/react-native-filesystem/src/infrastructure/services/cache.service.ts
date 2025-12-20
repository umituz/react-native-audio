/**
 * Cache Service
 * Single Responsibility: Manage cache directory operations
 */

import { getCacheDirectory, listDirectory } from "./directory.service";
import { deleteFile } from "./file-manager.service";
import { getFileInfo } from "./file-info.service";
import { FileUtils } from "../../domain/entities/File";

/**
 * Clear cache directory
 */
export async function clearCache(): Promise<boolean> {
  try {
    const cacheDir = getCacheDirectory();
    if (!cacheDir) return false;

    const files = await listDirectory(cacheDir);
    await Promise.all(
      files.map((file) => deleteFile(FileUtils.joinPaths(cacheDir, file))),
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get total size of directory
 */
export async function getDirectorySize(uri: string): Promise<number> {
  try {
    const files = await listDirectory(uri);
    const sizes = await Promise.all(
      files.map(async (file) => {
        const filePath = FileUtils.joinPaths(uri, file);
        const info = await getFileInfo(filePath);
        return info?.size || 0;
      }),
    );
    return sizes.reduce((total, size) => total + size, 0);
  } catch (error) {
    return 0;
  }
}


