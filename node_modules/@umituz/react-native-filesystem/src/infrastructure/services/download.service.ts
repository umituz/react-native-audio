/**
 * Download Service
 * Single Responsibility: Download files from URLs
 */

import { File, Paths } from "expo-file-system";
import type { FileOperationResult } from "../../domain/entities/File";
import { FileUtils } from "../../domain/entities/File";

/**
 * Download file from URL
 */
export async function downloadFile(
  url: string,
  destinationUri?: string,
): Promise<FileOperationResult> {
  try {
    let destination: File | typeof Paths.document;

    if (destinationUri) {
      destination = new File(destinationUri);
    } else {
      const filename = FileUtils.generateUniqueFilename("download");
      destination = new File(Paths.document, filename);
    }

    const result = await File.downloadFileAsync(url, destination, {
      idempotent: true,
    });
    return { success: true, uri: result.uri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Download failed",
    };
  }
}

