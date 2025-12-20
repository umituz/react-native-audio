/**
 * Encoding Service
 * Single Responsibility: Handle file encoding/decoding operations
 */

import type { FileEncoding } from "../../domain/entities/File";

/**
 * Convert FileEncoding to Expo FileSystem encoding type
 * Legacy API uses EncodingType enum
 */
export function getEncodingType(encoding: FileEncoding): any {
  // Legacy API uses EncodingType enum
  // Return as string for compatibility
  return encoding;
}

/**
 * Validate encoding type
 */
export function isValidEncoding(encoding: string): encoding is FileEncoding {
  return encoding === "utf8" || encoding === "base64";
}

