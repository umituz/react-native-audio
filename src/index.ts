export {
  AudioRecordingState,
  AudioPlaybackState,
  AudioQuality,
  AudioFormat,
  AudioChannel,
  AudioBitRate,
  AudioSampleRate,
  AudioExtension,
  PermissionStatus,
  AudioPermission,
} from './domain/types/AudioTypes';

export type {
  RecordingStatus,
  PlaybackStatus,
  AudioRecordingConfig,
  AudioPlaybackOptions,
  AudioMetadata,
  RecordingResult,
  PlaybackResult,
  AudioError,
  AudioModeConfig,
  ProgressCallback,
  StatusChangeCallback,
} from './domain/types/AudioTypes';

export { AudioErrorClass } from './domain/types/AudioTypes';

export {
  AudioErrorCode,
  DEFAULT_RECORDING_CONFIGS,
  DEFAULT_RECORDING_CONFIG,
  DEFAULT_PLAYBACK_OPTIONS,
  VOLUME,
  PLAYBACK_RATE,
  UPDATE_INTERVAL,
  MAX_RECORDING_DURATION,
  FILE_SIZE_LIMIT,
  DEFAULT_AUDIO_MODE,
} from './domain/constants/AudioConstants';

export { AudioRecording } from './domain/entities/AudioRecording';
export { AudioPlayback } from './domain/entities/AudioPlayback';

export { AudioRecordingService } from './infrastructure/services/AudioRecordingService';
export { AudioPlaybackService } from './infrastructure/services/AudioPlaybackService';

export {
  toExpoRecordingConfig,
  generateRecordingFilename,
  formatDuration,
  formatDurationWithMillis,
  formatDurationLong,
  isValidUri,
  isFormatSupported,
  calculateFileSize,
  formatFileSize,
  clamp,
  millisToSeconds,
  secondsToMillis,
  isValidVolume,
  isValidPlaybackRate,
} from './infrastructure/utils/audio.utils';

export {
  requestAudioPermission,
  getAudioPermissionStatus,
  hasAudioPermission,
  ensureAudioPermission,
  setupAudioMode,
  isAudioModeSet,
} from './infrastructure/utils/permission.utils';

export { useAudioRecording } from './presentation/hooks/useAudioRecording';
export { useAudioPlayback } from './presentation/hooks/useAudioPlayback';
