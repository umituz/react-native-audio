/**
 * Audio Domain - Audio Playback Service
 *
 * Service for audio/video playback using expo-av.
 * Provides abstraction layer for playing audio and video files.
 */

import { Audio } from 'expo-av';
import type {
  AudioPlaybackOptions,
  PlaybackState,
} from '../../domain/entities/Audio';
import { AUDIO_CONSTANTS } from '../../domain/entities/Audio';

/**
 * Audio playback service for playing audio/video
 */
export class AudioPlaybackService {
  private static sound: Audio.Sound | null = null;
  private static onStatusUpdate: ((state: PlaybackState) => void) | null = null;

  /**
   * Load audio from URI
   */
  static async loadAudio(uri: string, options?: AudioPlaybackOptions): Promise<boolean> {
    try {
      await AudioPlaybackService.unloadAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: options?.shouldPlay ?? false,
          rate: options?.rate ?? AUDIO_CONSTANTS.DEFAULT_RATE,
          volume: options?.volume ?? AUDIO_CONSTANTS.DEFAULT_VOLUME,
          isMuted: options?.isMuted ?? false,
          isLooping: options?.isLooping ?? false,
          progressUpdateIntervalMillis: options?.progressUpdateIntervalMillis ?? AUDIO_CONSTANTS.PROGRESS_UPDATE_INTERVAL,
        },
        AudioPlaybackService.handleStatusUpdate
      );

      AudioPlaybackService.sound = sound;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Play audio
   */
  static async play(): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.playAsync();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Pause audio
   */
  static async pause(): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.pauseAsync();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Stop audio (pause and reset position)
   */
  static async stop(): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.pauseAsync();
      await AudioPlaybackService.sound.setPositionAsync(0);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Seek to position (milliseconds)
   */
  static async seekTo(positionMillis: number): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.setPositionAsync(positionMillis);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set volume (0-1)
   */
  static async setVolume(volume: number): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      const validVolume = Math.min(Math.max(volume, 0), 1);
      await AudioPlaybackService.sound.setVolumeAsync(validVolume);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set playback rate (0.5-2.0)
   */
  static async setRate(rate: number): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      const validRate = Math.min(Math.max(rate, 0.5), 2.0);
      await AudioPlaybackService.sound.setRateAsync(validRate, true);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set mute
   */
  static async setMuted(isMuted: boolean): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.setIsMutedAsync(isMuted);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set looping
   */
  static async setLooping(isLooping: boolean): Promise<boolean> {
    try {
      if (!AudioPlaybackService.sound) {
        return false;
      }

      await AudioPlaybackService.sound.setIsLoopingAsync(isLooping);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current playback status
   */
  static async getStatus(): Promise<PlaybackState | null> {
    try {
      if (!AudioPlaybackService.sound) {
        return null;
      }

      const status = await AudioPlaybackService.sound.getStatusAsync();
      return AudioPlaybackService.mapStatusToState(status);
    } catch (error) {
      return null;
    }
  }

  /**
   * Unload audio and release resources
   */
  static async unloadAudio(): Promise<boolean> {
    try {
      if (AudioPlaybackService.sound) {
        await AudioPlaybackService.sound.unloadAsync();
        AudioPlaybackService.sound = null;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set status update callback
   */
  static setStatusUpdateCallback(callback: (state: PlaybackState) => void): void {
    AudioPlaybackService.onStatusUpdate = callback;
  }

  /**
   * Handle status updates from expo-av
   */
  private static handleStatusUpdate = (status: Audio.SoundStatus): void => {
    if (!AudioPlaybackService.onStatusUpdate) return;

    const state = AudioPlaybackService.mapStatusToState(status);
    if (state) {
      AudioPlaybackService.onStatusUpdate(state);
    }
  };

  /**
   * Map expo-av status to domain state
   */
  private static mapStatusToState(status: Audio.SoundStatus): PlaybackState | null {
    if (!status.isLoaded) {
      return {
        isLoaded: false,
        isPlaying: false,
        isBuffering: false,
        isMuted: false,
        volume: 0,
        rate: 1,
        shouldPlay: false,
        positionMillis: 0,
        durationMillis: 0,
        didJustFinish: false,
        error: status.error,
      };
    }

    return {
      isLoaded: true,
      isPlaying: status.isPlaying,
      isBuffering: status.isBuffering,
      isMuted: status.isMuted,
      volume: status.volume,
      rate: status.rate,
      shouldPlay: status.shouldPlay,
      positionMillis: status.positionMillis,
      durationMillis: status.durationMillis || 0,
      didJustFinish: status.didJustFinish,
    };
  }
}

