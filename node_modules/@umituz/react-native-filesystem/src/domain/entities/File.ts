/**
 * Filesystem Domain - File Entities
 *
 * This file defines core types and interfaces for runtime file operations.
 * Uses expo-file-system for reading, writing, and managing files on device.
 *
 * @domain filesystem
 * @layer domain/entities
 */

/**
 * File information interface
 */
export interface FileInfo {
  uri: string;
  name: string;
  size: number;
  exists: boolean;
  isDirectory: boolean;
  modificationTime: number;
}

/**
 * File encoding types (compatible with expo-file-system)
 */
export type FileEncoding = 'utf8' | 'base64';

/**
 * Directory type (compatible with expo-file-system)
 */
export type DirectoryType = 'documentDirectory' | 'cacheDirectory';

/**
 * File operation result
 */
export interface FileOperationResult {
  success: boolean;
  uri?: string;
  error?: string;
}

/**
 * Download progress info
 */
export interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
  progress: number; // 0 to 1
}

/**
 * File constants
 */
export const FILE_CONSTANTS = {
  MAX_FILE_NAME_LENGTH: 255,
  DEFAULT_ENCODING: 'utf8' as FileEncoding,
  TEMP_FILE_PREFIX: 'tmp_',
} as const;

/**
 * File utilities
 */
export class FileUtils {
  /**
   * Generate unique filename with timestamp
   */
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = FileUtils.getFileExtension(originalName);
    const baseName = originalName.replace(extension, '').substring(0, 50);
    return `${baseName}_${timestamp}_${randomStr}${extension}`;
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/);
    return match ? match[0] : '';
  }

  /**
   * Get filename without extension
   */
  static getFilenameWithoutExtension(filename: string): string {
    return filename.replace(/\.[^.]+$/, '');
  }

  /**
   * Sanitize filename (remove invalid characters)
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, FILE_CONSTANTS.MAX_FILE_NAME_LENGTH);
  }

  /**
   * Format file size to human-readable string
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  /**
   * Parse download progress percentage
   */
  static calculateProgress(written: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(Math.max(written / total, 0), 1);
  }

  /**
   * Check if path is absolute
   */
  static isAbsolutePath(path: string): boolean {
    return path.startsWith('/') || path.startsWith('file://');
  }

  /**
   * Join path segments
   */
  static joinPaths(...segments: string[]): string {
    return segments
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/');
  }

  /**
   * Get filename from filepath
   */
  static getFileName(filepath: string): string {
    return filepath.split('/').pop() || '';
  }

  /**
   * Get MIME type from filename
   */
  static getMimeType(filename: string): string {
    const ext = this.getFileExtension(filename).toLowerCase().replace('.', '');
    
    const mimeTypes: Record<string, string> = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      
      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      
      // Text
      txt: 'text/plain',
      csv: 'text/csv',
      json: 'application/json',
      
      // Video
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      mkv: 'video/x-matroska',
      webm: 'video/webm',
      
      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if file is an image
   */
  static isImageFile(filename: string): boolean {
    const ext = this.getFileExtension(filename).toLowerCase().replace('.', '');
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  }

  /**
   * Check if file is a video
   */
  static isVideoFile(filename: string): boolean {
    const ext = this.getFileExtension(filename).toLowerCase().replace('.', '');
    return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext);
  }

  /**
   * Check if file is an audio file
   */
  static isAudioFile(filename: string): boolean {
    const ext = this.getFileExtension(filename).toLowerCase().replace('.', '');
    return ['mp3', 'wav', 'm4a', 'ogg', 'flac'].includes(ext);
  }

  /**
   * Generate filename with prefix (alternative to generateUniqueFilename)
   */
  static generateFileName(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const ext = this.getFileExtension(originalName);
    const baseName = prefix ? `${prefix}_` : '';

    return `${baseName}${timestamp}_${random}${ext}`;
  }
}
