/**
 * Audio Domain - useAudio Hook
 *
 * React hook for audio recording and playback operations.
 * Combines AudioRecordingService and AudioPlaybackService.
 */

import { useState, useCallback, useEffect } from 'react';
import { AudioRecordingService } from '../../infrastructure/services/AudioRecordingService';
import { AudioPlaybackService } from '../../infrastructure/services/AudioPlaybackService';
import type {
  AudioRecordingOptions,
  AudioPlaybackOptions,
  RecordingInfo,
  PlaybackState,
  AudioPermission,
} from '../../domain/entities/Audio';

/**
 * useAudio hook for complete audio workflow
 *
 * USAGE:
 * ```typescript
 * const {
 *   // Recording
 *   startRecording,
 *   stopRecording,
 *   isRecording,
 *   recordingDuration,
 *
 *   // Playback
 *   loadAudio,
 *   play,
 *   pause,
 *   stop,
 *   seekTo,
 *   playbackState,
 *
 *   isLoading,
 *   error,
 * } = useAudio();
 * ```
 */
export const useAudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  /**
   * Setup playback status updates
   */
  useEffect(() => {
    AudioPlaybackService.setStatusUpdateCallback(setPlaybackState);
    return () => {
      AudioPlaybackService.setStatusUpdateCallback(() => {});
    };
  }, []);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<AudioPermission> => {
    try {
      return await AudioRecordingService.requestPermission();
    } catch (err) {
      return 'denied';
    }
  }, []);

  /**
   * Get microphone permission status
   */
  const getPermissionStatus = useCallback(async (): Promise<AudioPermission> => {
    try {
      return await AudioRecordingService.getPermissionStatus();
    } catch (err) {
      return 'denied';
    }
  }, []);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async (options?: AudioRecordingOptions): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await AudioRecordingService.startRecording(options);
      if (success) {
        setIsRecording(true);
      } else {
        setError('Failed to start recording');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Stop recording audio
   */
  const stopRecording = useCallback(async (): Promise<RecordingInfo | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const info = await AudioRecordingService.stopRecording();
      setIsRecording(false);
      setRecordingDuration(0);
      return info;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      setIsRecording(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Pause recording
   */
  const pauseRecording = useCallback(async (): Promise<boolean> => {
    try {
      const success = await AudioRecordingService.pauseRecording();
      if (success) {
        setIsRecording(false);
      }
      return success;
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Resume recording
   */
  const resumeRecording = useCallback(async (): Promise<boolean> => {
    try {
      const success = await AudioRecordingService.resumeRecording();
      if (success) {
        setIsRecording(true);
      }
      return success;
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Save recording to device
   */
  const saveRecording = useCallback(async (uri: string, filename?: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const savedUri = await AudioRecordingService.saveRecording(uri, filename);
      return savedUri;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save recording';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load audio from URI
   */
  const loadAudio = useCallback(async (uri: string, options?: AudioPlaybackOptions): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await AudioPlaybackService.loadAudio(uri, options);
      if (!success) {
        setError('Failed to load audio');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audio';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Play audio
   */
  const play = useCallback(async (): Promise<boolean> => {
    try {
      return await AudioPlaybackService.play();
    } catch (err) {
      setError('Failed to play audio');
      return false;
    }
  }, []);

  /**
   * Pause audio
   */
  const pause = useCallback(async (): Promise<boolean> => {
    try {
      return await AudioPlaybackService.pause();
    } catch (err) {
      setError('Failed to pause audio');
      return false;
    }
  }, []);

  /**
   * Stop audio
   */
  const stop = useCallback(async (): Promise<boolean> => {
    try {
      return await AudioPlaybackService.stop();
    } catch (err) {
      setError('Failed to stop audio');
      return false;
    }
  }, []);

  /**
   * Seek to position
   */
  const seekTo = useCallback(async (positionMillis: number): Promise<boolean> => {
    try {
      return await AudioPlaybackService.seekTo(positionMillis);
    } catch (err) {
      setError('Failed to seek');
      return false;
    }
  }, []);

  /**
   * Set volume (0-1)
   */
  const setVolume = useCallback(async (volume: number): Promise<boolean> => {
    try {
      return await AudioPlaybackService.setVolume(volume);
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Set playback rate (0.5-2.0)
   */
  const setRate = useCallback(async (rate: number): Promise<boolean> => {
    try {
      return await AudioPlaybackService.setRate(rate);
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Set mute
   */
  const setMuted = useCallback(async (isMuted: boolean): Promise<boolean> => {
    try {
      return await AudioPlaybackService.setMuted(isMuted);
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Set looping
   */
  const setLooping = useCallback(async (isLooping: boolean): Promise<boolean> => {
    try {
      return await AudioPlaybackService.setLooping(isLooping);
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Unload audio
   */
  const unloadAudio = useCallback(async (): Promise<boolean> => {
    try {
      const success = await AudioPlaybackService.unloadAudio();
      setPlaybackState(null);
      return success;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    // Recording functions
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    saveRecording,

    // Recording state
    isRecording,
    recordingDuration,

    // Playback functions
    loadAudio,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    setRate,
    setMuted,
    setLooping,
    unloadAudio,

    // Playback state
    playbackState,

    // Permission functions
    requestPermission,
    getPermissionStatus,

    // Common state
    isLoading,
    error,
  };
};

