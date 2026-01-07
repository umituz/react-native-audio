import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioRecording } from '../../domain/entities/AudioRecording';
import { AudioRecordingService } from '../../infrastructure/services/AudioRecordingService';
import {
  AudioQuality,
  AudioRecordingConfig,
  RecordingStatus,
} from '../../domain/types/AudioTypes';
import { DEFAULT_RECORDING_CONFIG, DEFAULT_RECORDING_CONFIGS } from '../../domain/constants/AudioConstants';
import { toExpoRecordingConfig } from '../../infrastructure/utils/audio.utils';

interface UseAudioRecordingOptions {
  config?: Partial<AudioRecordingConfig>;
  quality?: AudioQuality;
}

interface UseAudioRecordingReturn {
  recording: AudioRecording | null;
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  hasError: boolean;
  error: Error | null;
  status: RecordingStatus | null;
  prepare: () => Promise<void>;
  start: () => Promise<string>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  cancel: () => Promise<void>;
  reset: () => void;
}

export function useAudioRecording(
  options: UseAudioRecordingOptions = {}
): UseAudioRecordingReturn {
  const { config, quality = AudioQuality.MEDIUM } = options;

  const recordingRef = useRef<AudioRecording | null>(null);
  const serviceRef = useRef<AudioRecordingService | null>(null);

  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<RecordingStatus | null>(null);

  const createRecording = useCallback(() => {
    const baseConfig = quality
      ? DEFAULT_RECORDING_CONFIGS[quality]
      : DEFAULT_RECORDING_CONFIG;

    const recordingConfig = config
      ? { ...baseConfig, ...config }
      : baseConfig;

    const recordingEntity = new AudioRecording(recordingConfig);
    const service = new AudioRecordingService(recordingEntity);

    recordingRef.current = recordingEntity;
    serviceRef.current = service;

    setRecording(recordingEntity);

    return { recordingEntity, service };
  }, [config, quality]);

  useEffect(() => {
    const { recordingEntity } = createRecording();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (recordingRef.current) {
      const interval = setInterval(() => {
        if (recordingRef.current) {
          setStatus(recordingRef.current.status);
          setError(recordingRef.current.error);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const prepare = useCallback(async () => {
    if (!serviceRef.current || !recordingRef.current) {
      throw new Error('Recording service not initialized');
    }

    const expoConfig = toExpoRecordingConfig(recordingRef.current.config);
    await serviceRef.current.prepare(expoConfig);
  }, []);

  const start = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Recording service not initialized');
    }

    const uri = await serviceRef.current.start();
    setRecording(serviceRef.current.recordingEntity);

    return uri;
  }, []);

  const pause = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Recording service not initialized');
    }

    await serviceRef.current.pause();
    setRecording(serviceRef.current.recordingEntity);
  }, []);

  const stop = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Recording service not initialized');
    }

    await serviceRef.current.stop();
    setRecording(serviceRef.current.recordingEntity);
  }, []);

  const cancel = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Recording service not initialized');
    }

    await serviceRef.current.cancel();
    setRecording(serviceRef.current.recordingEntity);
  }, []);

  const reset = useCallback(() => {
    if (recordingRef.current) {
      recordingRef.current.reset();
      setRecording(recordingRef.current);
    }
  }, []);

  return {
    recording,
    isRecording: recording?.isRecording ?? false,
    isPaused: recording?.isPaused ?? false,
    isStopped: recording?.isStopped ?? false,
    hasError: recording?.hasError ?? false,
    error,
    status,
    prepare,
    start,
    pause,
    stop,
    cancel,
    reset,
  };
}
