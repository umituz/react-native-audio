/**
 * Filesystem Domain - Barrel Export
 *
 * CENTRAL PLACE FOR ALL FILE OPERATIONS
 *
 * Provides two main capabilities:
 * 1. Build-time module loading (require.context)
 * 2. Runtime file operations (expo-file-system)
 *
 * @domain filesystem
 * @enabled true (All apps - Infrastructure domain)
 *
 * ARCHITECTURE:
 * - Domain Layer: Entities (ModuleContext for build-time, File for runtime)
 * - Infrastructure Layer: Utils (module loading) + Services (file operations)
 *
 * ============================================================================
 * BUILD-TIME MODULE LOADING (require.context)
 * ============================================================================
 *
 * FEATURES:
 * - Auto-discover JSON files in directory
 * - Load all modules with single function call
 * - Type-safe module loading
 * - Metro bundler compatible (React Native)
 * - Zero runtime dependencies
 * - Build-time resolution (fast)
 *
 * USAGE - Build-time Module Loading:
 *
 * Basic Example:
 * ```typescript
 * import { loadJsonModules } from '@domains/filesystem';
 *
 * // Auto-load all JSON files in current directory
 * const translationContext = require.context('./', false, /\.json$/);
 * const translations = loadJsonModules(translationContext);
 *
 * export default translations;
 * // Result: { common: {...}, errors: {...}, settings: {...} }
 * ```
 *
 * Custom Transform Example:
 * ```typescript
 * import { loadModulesWithTransform } from '@domains/filesystem';
 *
 * const context = require.context('./', false, /\.json$/);
 * const modules = loadModulesWithTransform(context, name => name.toUpperCase());
 * // Result: { COMMON: {...}, ERRORS: {...} }
 * ```
 *
 * Get Names Example:
 * ```typescript
 * import { getModuleNames } from '@domains/filesystem';
 *
 * const context = require.context('./', false, /\.json$/);
 * const names = getModuleNames(context);
 * // Result: ['common', 'errors', 'settings']
 * ```
 *
 * ============================================================================
 * RUNTIME FILE OPERATIONS (expo-file-system)
 * ============================================================================
 *
 * FEATURES:
 * - Read/write files on device
 * - Download files from URLs
 * - Directory management
 * - Cache management
 * - File copying/moving
 *
 * USAGE - Runtime File Operations:
 *
 * Read/Write Files:
 * ```typescript
 * import { FileSystemService } from '@domains/filesystem';
 *
 * // Write file
 * const result = await FileSystemService.writeFile(
 *   FileSystemService.generateFilePath('data.json'),
 *   JSON.stringify({ key: 'value' })
 * );
 *
 * // Read file
 * const content = await FileSystemService.readFile(result.uri);
 * ```
 *
 * Download Files:
 * ```typescript
 * import { FileSystemService } from '@domains/filesystem';
 *
 * const result = await FileSystemService.downloadFile(
 *   'https://example.com/file.pdf'
 * );
 * if (result.success) {
 *   console.log('Downloaded to:', result.uri);
 * }
 * ```
 *
 * Directory Operations:
 * ```typescript
 * import { FileSystemService, FileUtils } from '@domains/filesystem';
 *
 * // Get document directory
 * const docDir = FileSystemService.getDocumentDirectory();
 *
 * // List files
 * const files = await FileSystemService.listDirectory(docDir);
 *
 * // Clear cache
 * await FileSystemService.clearCache();
 * ```
 *
 * File Utilities:
 * ```typescript
 * import { FileUtils } from '@domains/filesystem';
 *
 * // Format file size
 * const size = FileUtils.formatFileSize(1024000); // "1.00 MB"
 *
 * // Generate unique filename
 * const filename = FileUtils.generateUniqueFilename('photo.jpg');
 *
 * // Sanitize filename
 * const safe = FileUtils.sanitizeFilename('my file!@#.txt'); // "my_file___.txt"
 * ```
 *
 * BENEFITS:
 * - Centralized file operations (no duplication)
 * - Type-safe with TypeScript
 * - Works across all 100+ apps
 * - Used by other domains (media, etc.)
 * - Clean, maintainable code
 *
 * @see https://docs.expo.dev/versions/latest/sdk/filesystem/
 */

// ============================================================================
// BUILD-TIME MODULE LOADING
// ============================================================================

// Domain Layer - Module Context Entities
export type {
  RequireContext,
  ModuleCollection,
  FileExtension,
} from './domain/entities/ModuleContext';

// Infrastructure Layer - Module Loading Utils
export {
  loadJsonModules,
  loadModulesWithTransform,
  getModuleNames,
} from './infrastructure/utils/moduleLoader';

// ============================================================================
// RUNTIME FILE OPERATIONS
// ============================================================================

// Domain Layer - File Entities
export type {
  FileInfo,
  FileOperationResult,
  DownloadProgress,
} from './domain/entities/File';

export type {
  FileEncoding,
  DirectoryType,
} from './domain/entities/File';

export {
  FILE_CONSTANTS,
  FileUtils,
} from './domain/entities/File';

// Infrastructure Layer - FileSystem Service
export { FileSystemService } from './infrastructure/services/FileSystemService';
