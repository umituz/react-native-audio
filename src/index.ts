/**
 * @umituz/react-native-audio - Public API
 *
 * Audio recording and playback for React Native apps
 * Recording, playback, video playback using expo-av
 *
 * Usage:
 *   import { useAudio, AudioRecordingService, AudioPlaybackService, AudioUtils, Video } from '@umituz/react-native-audio';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  AudioRecordingOptions,
  AudioPlaybackOptions,
  VideoPlaybackOptions,
  RecordingInfo,
  PlaybackState,
} from './domain/entities/Audio';

export {
  AudioQuality,
  AudioEncoding,
  PlaybackStatus,
  RecordingStatus,
  AudioPermission,
  AUDIO_CONSTANTS,
  RECORDING_PRESETS,
  AudioUtils,
} from './domain/entities/Audio';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { AudioRecordingService } from './infrastructure/services/AudioRecordingService';
export { AudioPlaybackService } from './infrastructure/services/AudioPlaybackService';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useAudio } from './presentation/hooks/useAudio';

// =============================================================================
// EXPO-AV RE-EXPORTS
// =============================================================================

// Re-export Video component from expo-av for convenience
export { Video } from 'expo-av';

