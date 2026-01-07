import {
  AudioBitRate,
  AudioChannel,
  AudioExtension,
  AudioFormat,
  AudioModeConfig,
  AudioPlaybackOptions,
  AudioQuality,
  AudioRecordingConfig,
  AudioSampleRate,
} from '../types/AudioTypes';

/**
 * Error codes
 */
export const AudioErrorCode = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RECORDING_FAILED: 'RECORDING_FAILED',
  PLAYBACK_FAILED: 'PLAYBACK_FAILED',
  INVALID_URI: 'INVALID_URI',
  LOAD_FAILED: 'LOAD_FAILED',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  DEVICE_NOT_AVAILABLE: 'DEVICE_NOT_AVAILABLE',
  UNKNOWN: 'UNKNOWN',
} as const;

/**
 * Default recording configurations for different quality presets
 */
export const DEFAULT_RECORDING_CONFIGS: Record<AudioQuality, AudioRecordingConfig> = {
  [AudioQuality.LOW]: {
    quality: AudioQuality.LOW,
    format: AudioFormat.AAC,
    channel: AudioChannel.MONO,
    bitRate: AudioBitRate.BPS_64K,
    sampleRate: AudioSampleRate.HZ_22050,
    extension: AudioExtension.AAC,
  },
  [AudioQuality.MEDIUM]: {
    quality: AudioQuality.MEDIUM,
    format: AudioFormat.AAC,
    channel: AudioChannel.MONO,
    bitRate: AudioBitRate.BPS_128K,
    sampleRate: AudioSampleRate.HZ_44100,
    extension: AudioExtension.AAC,
  },
  [AudioQuality.HIGH]: {
    quality: AudioQuality.HIGH,
    format: AudioFormat.AAC,
    channel: AudioChannel.STEREO,
    bitRate: AudioBitRate.BPS_192K,
    sampleRate: AudioSampleRate.HZ_44100,
    extension: AudioExtension.AAC,
  },
  [AudioQuality.MAX]: {
    quality: AudioQuality.MAX,
    format: AudioFormat.AAC,
    channel: AudioChannel.STEREO,
    bitRate: AudioBitRate.BPS_320K,
    sampleRate: AudioSampleRate.HZ_48000,
    extension: AudioExtension.AAC,
  },
} as const;

/**
 * Default recording configuration
 */
export const DEFAULT_RECORDING_CONFIG: AudioRecordingConfig =
  DEFAULT_RECORDING_CONFIGS[AudioQuality.MEDIUM];

/**
 * Default playback options
 */
export const DEFAULT_PLAYBACK_OPTIONS: AudioPlaybackOptions = {
  shouldPlay: false,
  volume: 1.0,
  isLooping: false,
  isMuted: false,
  playbackRate: 1.0,
  progressUpdateIntervalMillis: 500,
  positionUpdateIntervalMillis: 500,
} as const;

/**
 * Volume range
 */
export const VOLUME = {
  MIN: 0.0,
  MAX: 1.0,
  DEFAULT: 1.0,
} as const;

/**
 * Playback rate range
 */
export const PLAYBACK_RATE = {
  MIN: 0.5,
  MAX: 2.0,
  DEFAULT: 1.0,
} as const;

/**
 * Update interval range
 */
export const UPDATE_INTERVAL = {
  MIN: 100,
  MAX: 5000,
  DEFAULT: 500,
} as const;

/**
 * Max recording duration (no limit by default)
 */
export const MAX_RECORDING_DURATION = 0; // 0 means no limit

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMIT = {
  SMALL: 1024 * 1024, // 1MB
  MEDIUM: 5 * 1024 * 1024, // 5MB
  LARGE: 10 * 1024 * 1024, // 10MB
  UNLIMITED: 0, // 0 means no limit
} as const;

/**
 * Default audio mode configuration
 */
export const DEFAULT_AUDIO_MODE: AudioModeConfig = {
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  playsThroughEarpieceInAndroid: false,
} as const;
