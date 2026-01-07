/**
 * Audio recording state
 */
export enum AudioRecordingState {
  IDLE = 'idle',
  PREPARING = 'preparing',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  ERROR = 'error',
}

/**
 * Audio playback state
 */
export enum AudioPlaybackState {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  COMPLETED = 'completed',
  ERROR = 'error',
}

/**
 * Audio recording quality preset
 */
export enum AudioQuality {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  MAX = 'max',
}

/**
 * Audio output format
 */
export enum AudioFormat {
  AAC = 'aac',
  MP3 = 'mp3',
  WAV = 'wav',
  MPEG4 = 'mpeg4',
}

/**
 * Audio channel configuration
 */
export enum AudioChannel {
  MONO = 'mono',
  STEREO = 'stereo',
}

/**
 * Audio encoding bit rate
 */
export enum AudioBitRate {
  BPS_64K = 64000,
  BPS_128K = 128000,
  BPS_192K = 192000,
  BPS_256K = 256000,
  BPS_320K = 320000,
}

/**
 * Audio sample rate
 */
export enum AudioSampleRate {
  HZ_8000 = 8000,
  HZ_16000 = 16000,
  HZ_22050 = 22050,
  HZ_44100 = 44100,
  HZ_48000 = 48000,
}

/**
 * Audio file extension
 */
export enum AudioExtension {
  AAC = '.aac',
  MP3 = '.mp3',
  WAV = '.wav',
  M4A = '.m4a',
}

/**
 * Recording status information
 */
export interface RecordingStatus {
  durationMillis: number;
  mediaDurationMillis?: number;
  isRecording?: boolean;
  hasBeenRecorded?: boolean;
}

/**
 * Playback status information
 */
export interface PlaybackStatus {
  didJustFinish: boolean;
  durationMillis: number;
  isBuffering: boolean;
  isLoaded: boolean;
  isLooping: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  positionMillis: number;
  playbackRate: number;
  volume: number;
}

/**
 * Audio recording configuration
 */
export interface AudioRecordingConfig {
  quality: AudioQuality;
  format: AudioFormat;
  channel: AudioChannel;
  bitRate: AudioBitRate;
  sampleRate: AudioSampleRate;
  extension: AudioExtension;
  maxDurationSeconds?: number;
}

/**
 * Audio playback options
 */
export interface AudioPlaybackOptions {
  shouldPlay: boolean;
  volume: number;
  isLooping: boolean;
  isMuted: boolean;
  playbackRate: number;
  progressUpdateIntervalMillis: number;
  positionUpdateIntervalMillis: number;
}

/**
 * Audio metadata
 */
export interface AudioMetadata {
  uri: string;
  duration: number;
  size?: number;
  format?: AudioFormat;
  createdAt?: Date;
  modifiedAt?: Date;
}

/**
 * Recording result
 */
export interface RecordingResult {
  uri: string;
  duration: number;
  status: AudioRecordingState;
}

/**
 * Playback result
 */
export interface PlaybackResult {
  uri: string;
  duration: number;
  position: number;
  status: AudioPlaybackState;
}

/**
 * Audio error
 */
export interface AudioError {
  code: string;
  message: string;
  details?: unknown;
}
