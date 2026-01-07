import { Audio } from 'expo-av';
import {
  AudioRecordingConfig,
  AudioFormat,
  AudioExtension,
} from '../../domain/types/AudioTypes';

/**
 * Convert recording config to Expo AV AudioRecordingConfiguration
 */
export function toExpoRecordingConfig(
  config: AudioRecordingConfig
): Audio.RecordingOptions {
  const androidOutputFormat = getAndroidOutputFormat(config.format);
  const iosOutputFormat = getIOSOutputFormat(config.format);
  const androidAudioEncoder = getAndroidAudioEncoder(config.format);
  const iosAudioEncoding = getIOSAudioEncoding(config.format);

  return {
    android: {
      extension: config.extension,
      outputFormat: androidOutputFormat,
      audioEncoder: androidAudioEncoder,
      sampleRate: config.sampleRate,
      numberOfChannels: config.channel === 'stereo' ? 2 : 1,
      bitRate: config.bitRate,
      maxFileSize: config.maxDurationSeconds
        ? config.maxDurationSeconds * 1000000
        : undefined,
    },
    ios: {
      extension: config.extension,
      outputFormat: iosOutputFormat,
      audioQuality: iosAudioEncoding,
      sampleRate: config.sampleRate,
      numberOfChannels: config.channel === 'stereo' ? 2 : 1,
      bitRate: config.bitRate,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: `audio/${config.format}`,
      bitsPerSecond: config.bitRate,
    },
  };
}

/**
 * Get Android output format
 */
function getAndroidOutputFormat(format: AudioFormat): number {
  const formatMap: Record<AudioFormat, number> = {
    [AudioFormat.AAC]: 0x10000, // android.media.MediaRecorder.OutputFormat.MPEG_4
    [AudioFormat.MP3]: 0x0, // Default to MPEG_4
    [AudioFormat.WAV]: 0x0, // Not supported on Android
    [AudioFormat.MPEG4]: 0x10000,
  };

  return formatMap[format] || 0x10000;
}

/**
 * Get iOS output format
 */
function getIOSOutputFormat(format: AudioFormat): string {
  const formatMap: Record<AudioFormat, string> = {
    [AudioFormat.AAC]: '.aac',
    [AudioFormat.MP3]: '.mp3',
    [AudioFormat.WAV]: '.wav',
    [AudioFormat.MPEG4]: '.m4a',
  };

  return formatMap[format] || '.aac';
}

/**
 * Get Android audio encoder
 */
function getAndroidAudioEncoder(format: AudioFormat): number {
  const encoderMap: Record<AudioFormat, number> = {
    [AudioFormat.AAC]: 0x8000, // android.media.MediaRecorder.AudioEncoder.AAC
    [AudioFormat.MP3]: 0x0,
    [AudioFormat.WAV]: 0x0,
    [AudioFormat.MPEG4]: 0x8000,
  };

  return encoderMap[format] || 0x8000;
}

/**
 * Get iOS audio encoding quality
 */
function getIOSAudioEncoding(format: AudioFormat): number {
  const qualityMap: Record<AudioFormat, number> = {
    [AudioFormat.AAC]: 192, // High quality
    [AudioFormat.MP3]: 192,
    [AudioFormat.WAV]: 192,
    [AudioFormat.MPEG4]: 192,
  };

  return qualityMap[format] || 192;
}

/**
 * Generate unique recording filename
 */
export function generateRecordingFilename(extension: AudioExtension): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `recording_${timestamp}_${random}${extension}`;
}

/**
 * Format duration to human-readable string (MM:SS)
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Format duration to human-readable string with milliseconds (MM:SS:mmm)
 */
export function formatDurationWithMillis(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = milliseconds % 1000;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}:${millis.toString().padStart(3, '0')}`;
}

/**
 * Format duration to human-readable string with hours (HH:MM:SS)
 */
export function formatDurationLong(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Validate recording URI
 */
export function isValidUri(uri: string): boolean {
  return typeof uri === 'string' && uri.length > 0;
}

/**
 * Check if format is supported on platform
 */
export async function isFormatSupported(format: AudioFormat): Promise<boolean> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Calculate bytes from milliseconds for a given format and quality
 */
export function calculateFileSize(
  durationMillis: number,
  bitRate: number
): number {
  const durationSeconds = durationMillis / 1000;
  return Math.floor((bitRate * durationSeconds) / 8);
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert milliseconds to seconds
 */
export function millisToSeconds(milliseconds: number): number {
  return milliseconds / 1000;
}

/**
 * Convert seconds to milliseconds
 */
export function secondsToMillis(seconds: number): number {
  return seconds * 1000;
}

/**
 * Check if value is valid volume (0-1)
 */
export function isValidVolume(volume: number): boolean {
  return volume >= 0 && volume <= 1;
}

/**
 * Check if value is valid playback rate (0.5-2.0)
 */
export function isValidPlaybackRate(rate: number): boolean {
  return rate >= 0.5 && rate <= 2.0;
}
