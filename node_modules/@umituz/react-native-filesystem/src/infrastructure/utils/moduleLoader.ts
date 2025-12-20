/**
 * Module Loader Utilities - DEPRECATED
 *
 * These functions are deprecated and no longer used.
 * Kept for backward compatibility only.
 */

import type { ModuleCollection } from '../../domain/entities/ModuleContext';

/**
 * @deprecated No longer used - kept for backward compatibility
 */
export function loadJsonModules(): ModuleCollection {
  return {};
}

/**
 * @deprecated No longer used - kept for backward compatibility
 */
export function loadModulesWithTransform(): ModuleCollection {
  return {};
}

/**
 * @deprecated No longer used - kept for backward compatibility
 */
export function getModuleNames(): string[] {
  return [];
}
