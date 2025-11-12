/**
 * Audio Domain - Audio Recording Service
 *
 * Service for audio recording using expo-av.
 * Provides abstraction layer for recording audio with permissions.
 */

import { Audio } from 'expo-av';
import { FileSystemService } from '@umituz/react-native-filesystem';
import type {
  AudioRecordingOptions,
  RecordingInfo,
  AudioPermission,
} from '../../domain/entities/Audio';
import { RECORDING_PRESETS, AudioQuality } from '../../domain/entities/Audio';

/**
 * Audio recording service for capturing audio
 */
export class AudioRecordingService {
  private static recording: Audio.Recording | null = null;

  /**
   * Request microphone permission
   */
  static async requestPermission(): Promise<AudioPermission> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return AudioRecordingService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Get microphone permission status
   */
  static async getPermissionStatus(): Promise<AudioPermission> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return AudioRecordingService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Start recording audio
   */
  static async startRecording(options?: AudioRecordingOptions): Promise<boolean> {
    try {
      const permission = await AudioRecordingService.requestPermission();
      if (permission !== 'granted') {
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = AudioRecordingService.mapRecordingOptions(options);
      const { recording } = await Audio.Recording.createAsync(recordingOptions);

      AudioRecordingService.recording = recording;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Stop recording audio
   */
  static async stopRecording(): Promise<RecordingInfo | null> {
    try {
      if (!AudioRecordingService.recording) {
        return null;
      }

      await AudioRecordingService.recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = AudioRecordingService.recording.getURI() || '';
      const status = await AudioRecordingService.recording.getStatusAsync();

      const info: RecordingInfo = {
        uri,
        duration: status.durationMillis || 0,
        canRecord: status.canRecord,
        isRecording: status.isRecording,
        isDoneRecording: status.isDoneRecording,
      };

      AudioRecordingService.recording = null;
      return info;
    } catch (error) {
      AudioRecordingService.recording = null;
      return null;
    }
  }

  /**
   * Pause recording (not supported on all platforms)
   */
  static async pauseRecording(): Promise<boolean> {
    try {
      if (!AudioRecordingService.recording) {
        return false;
      }

      await AudioRecordingService.recording.pauseAsync();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Resume recording
   */
  static async resumeRecording(): Promise<boolean> {
    try {
      if (!AudioRecordingService.recording) {
        return false;
      }

      await AudioRecordingService.recording.startAsync();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current recording status
   */
  static async getRecordingStatus(): Promise<RecordingInfo | null> {
    try {
      if (!AudioRecordingService.recording) {
        return null;
      }

      const status = await AudioRecordingService.recording.getStatusAsync();
      const uri = AudioRecordingService.recording.getURI() || '';

      return {
        uri,
        duration: status.durationMillis || 0,
        canRecord: status.canRecord,
        isRecording: status.isRecording,
        isDoneRecording: status.isDoneRecording,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Save recording to device documents
   */
  static async saveRecording(uri: string, filename?: string): Promise<string | null> {
    try {
      const result = await FileSystemService.copyToDocuments(uri, filename);
      return result.success ? result.uri : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete recording file
   */
  static async deleteRecording(uri: string): Promise<boolean> {
    try {
      return await FileSystemService.deleteFile(uri);
    } catch (error) {
      return false;
    }
  }

  /**
   * Map recording options to expo-av format
   */
  private static mapRecordingOptions(options?: AudioRecordingOptions): Audio.RecordingOptions {
    if (!options || options.quality === AudioQuality.HIGH) {
      return Audio.RecordingOptionsPresets.HIGH_QUALITY;
    }
    return Audio.RecordingOptionsPresets.LOW_QUALITY;
  }

  /**
   * Map permission status to domain enum
   */
  private static mapPermissionStatus(status: Audio.PermissionStatus): AudioPermission {
    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'undetermined';
  }
}

