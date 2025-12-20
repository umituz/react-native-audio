/**
 * File Writer Service
 * Single Responsibility: Write files to device storage
 */

import { File } from "expo-file-system";
import type { FileEncoding, FileOperationResult } from "../../domain/entities/File";
import { getEncodingType } from "./encoding.service";

/**
 * Write string to file
 */
export async function writeFile(
  uri: string,
  content: string,
  encoding: FileEncoding = "utf8",
): Promise<FileOperationResult> {
  try {
    const encodingType = getEncodingType(encoding);
    const file = new File(uri);
    file.write(content, {
      encoding: encodingType as any,
    });
    return { success: true, uri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

