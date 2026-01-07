import { useEffect, useRef, useState, useCallback } from 'react';
import { AudioPlayback } from '../../domain/entities/AudioPlayback';
import { AudioPlaybackService } from '../../infrastructure/services/AudioPlaybackService';
import {
  AudioPlaybackOptions,
  PlaybackStatus,
} from '../../domain/types/AudioTypes';
import { DEFAULT_PLAYBACK_OPTIONS } from '../../domain/constants/AudioConstants';

interface UseAudioPlaybackOptions {
  options?: Partial<AudioPlaybackOptions>;
}

interface UseAudioPlaybackReturn {
  playback: AudioPlayback | null;
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isCompleted: boolean;
  hasError: boolean;
  error: Error | null;
  status: PlaybackStatus | null;
  progress: number;
  load: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  setLooping: (looping: boolean) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  unload: () => Promise<void>;
}

export function useAudioPlayback(
  options: UseAudioPlaybackOptions = {}
): UseAudioPlaybackReturn {
  const { options: playbackOptions } = options;

  const playbackRef = useRef<AudioPlayback | null>(null);
  const serviceRef = useRef<AudioPlaybackService | null>(null);

  const [playback, setPlayback] = useState<AudioPlayback | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<PlaybackStatus | null>(null);
  const [progress, setProgress] = useState(0);

  const createPlayback = useCallback(() => {
    const playbackOptionsConfig = playbackOptions
      ? { ...DEFAULT_PLAYBACK_OPTIONS, ...playbackOptions }
      : DEFAULT_PLAYBACK_OPTIONS;

    const playbackEntity = new AudioPlayback(playbackOptionsConfig);
    const service = new AudioPlaybackService(playbackEntity);

    playbackRef.current = playbackEntity;
    serviceRef.current = service;

    setPlayback(playbackEntity);

    return { playbackEntity, service };
  }, [playbackOptions]);

  useEffect(() => {
    const { playbackEntity } = createPlayback();

    return () => {
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (playbackRef.current) {
      const interval = setInterval(() => {
        if (playbackRef.current) {
          setStatus(playbackRef.current.status);
          setError(playbackRef.current.error);
          setProgress(playbackRef.current.progress);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const load = useCallback(async (uri: string) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.load(uri);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const play = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.play();
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const pause = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.pause();
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const stop = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.stop();
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const seek = useCallback(async (position: number) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.seek(position);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.setVolume(volume);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const setPlaybackRate = useCallback(async (rate: number) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.setPlaybackRate(rate);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const setLooping = useCallback(async (looping: boolean) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.setLooping(looping);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const setMuted = useCallback(async (muted: boolean) => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.setMuted(muted);
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  const unload = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Playback service not initialized');
    }

    await serviceRef.current.unload();
    setPlayback(serviceRef.current.playbackEntity);
  }, []);

  return {
    playback,
    isPlaying: playback?.isPlaying ?? false,
    isPaused: playback?.isPaused ?? false,
    isStopped: playback?.isStopped ?? false,
    isCompleted: playback?.isCompleted ?? false,
    hasError: playback?.hasError ?? false,
    error,
    status,
    progress,
    load,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    setLooping,
    setMuted,
    unload,
  };
}
