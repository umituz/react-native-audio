export {
  AudioRecordingState,
  AudioPlaybackState,
  AudioQuality,
  AudioFormat,
  AudioChannel,
  AudioBitRate,
  AudioSampleRate,
  AudioExtension,
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
} from './domain/types/AudioTypes';

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
} from './domain/constants/AudioConstants';

export { AudioRecording } from './domain/entities/AudioRecording';
export { AudioPlayback } from './domain/entities/AudioPlayback';

export { AudioRecordingService } from './infrastructure/services/AudioRecordingService';
export { AudioPlaybackService } from './infrastructure/services/AudioPlaybackService';

export {
  toExpoRecordingConfig,
  generateRecordingFilename,
  formatDuration,
  isValidUri,
  isFormatSupported,
} from './infrastructure/utils/audio.utils';

export { useAudioRecording } from './presentation/hooks/useAudioRecording';
export { useAudioPlayback } from './presentation/hooks/useAudioPlayback';
