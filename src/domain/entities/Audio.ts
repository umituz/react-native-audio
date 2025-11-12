/**
 * Audio Domain - Core Entities
 *
 * This file defines core types and interfaces for audio/video operations.
 * Handles audio recording, playback, and video playback using expo-av.
 */

/**
 * Audio quality enumeration
 */
export enum AudioQuality {
  LOW = 'low',
  HIGH = 'high',
}

/**
 * Audio encoding format
 */
export enum AudioEncoding {
  AAC = 'aac',
  AMR_NB = 'amr_nb',
  AMR_WB = 'amr_wb',
  LINEAR_PCM = 'lpcm',
  MP3 = 'mp3',
}

/**
 * Playback status
 */
export enum PlaybackStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  FINISHED = 'finished',
  ERROR = 'error',
}

/**
 * Recording status
 */
export enum RecordingStatus {
  READY = 'ready',
  RECORDING = 'recording',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error',
}

/**
 * Audio recording options
 */
export interface AudioRecordingOptions {
  quality?: AudioQuality;
  encoding?: AudioEncoding;
  sampleRate?: number;
  numberOfChannels?: 1 | 2;
  bitRate?: number;
}

/**
 * Audio playback options
 */
export interface AudioPlaybackOptions {
  shouldPlay?: boolean;
  rate?: number;
  volume?: number;
  isMuted?: boolean;
  isLooping?: boolean;
  progressUpdateIntervalMillis?: number;
}

/**
 * Video playback options
 */
export interface VideoPlaybackOptions extends AudioPlaybackOptions {
  shouldCorrectPitch?: boolean;
}

/**
 * Recording info
 */
export interface RecordingInfo {
  uri: string;
  duration: number;
  size?: number;
  canRecord: boolean;
  isRecording: boolean;
  isDoneRecording: boolean;
}

/**
 * Playback state
 */
export interface PlaybackState {
  isLoaded: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  rate: number;
  shouldPlay: boolean;
  positionMillis: number;
  durationMillis: number;
  didJustFinish: boolean;
  error?: string;
}

/**
 * Audio permission status
 */
export enum AudioPermission {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

/**
 * Audio constants
 */
export const AUDIO_CONSTANTS = {
  DEFAULT_QUALITY: AudioQuality.HIGH,
  DEFAULT_ENCODING: AudioEncoding.AAC,
  DEFAULT_SAMPLE_RATE: 44100,
  DEFAULT_CHANNELS: 2,
  DEFAULT_BIT_RATE: 128000,
  DEFAULT_VOLUME: 1.0,
  DEFAULT_RATE: 1.0,
  MAX_RECORDING_DURATION: 3600000, // 1 hour in milliseconds
  PROGRESS_UPDATE_INTERVAL: 500, // 500ms
} as const;

/**
 * Recording presets
 */
export const RECORDING_PRESETS = {
  LOW_QUALITY: {
    quality: AudioQuality.LOW,
    encoding: AudioEncoding.AAC,
    sampleRate: 22050,
    numberOfChannels: 1 as const,
    bitRate: 64000,
  },
  HIGH_QUALITY: {
    quality: AudioQuality.HIGH,
    encoding: AudioEncoding.AAC,
    sampleRate: 44100,
    numberOfChannels: 2 as const,
    bitRate: 128000,
  },
} as const;

/**
 * Audio utilities
 */
export class AudioUtils {
  /**
   * Format milliseconds to MM:SS
   */
  static formatDuration(millis: number): string {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate recording file size estimation (bytes)
   */
  static estimateFileSize(durationMs: number, bitRate: number = AUDIO_CONSTANTS.DEFAULT_BIT_RATE): number {
    const durationSeconds = durationMs / 1000;
    return Math.floor((bitRate / 8) * durationSeconds);
  }

  /**
   * Check if recording duration is within limits
   */
  static isWithinDurationLimit(durationMs: number): boolean {
    return durationMs <= AUDIO_CONSTANTS.MAX_RECORDING_DURATION;
  }

  /**
   * Calculate playback progress percentage (0-100)
   */
  static calculateProgress(positionMillis: number, durationMillis: number): number {
    if (durationMillis === 0) return 0;
    return Math.min(Math.max((positionMillis / durationMillis) * 100, 0), 100);
  }

  /**
   * Validate volume value (0-1)
   */
  static validateVolume(volume: number): number {
    return Math.min(Math.max(volume, 0), 1);
  }

  /**
   * Validate playback rate (0.5-2.0)
   */
  static validateRate(rate: number): number {
    return Math.min(Math.max(rate, 0.5), 2.0);
  }
}

