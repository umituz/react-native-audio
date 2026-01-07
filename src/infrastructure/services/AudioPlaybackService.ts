import { Audio } from 'expo-av';
import { AudioPlayback } from '../../domain/entities/AudioPlayback';
import {
  AudioPlaybackState,
  PlaybackStatus,
} from '../../domain/types/AudioTypes';

/**
 * AudioPlaybackService - handles audio playback operations using expo-av
 */
export class AudioPlaybackService {
  private soundInstance: Audio.Sound | null;
  private playback: AudioPlayback;
  private statusUpdateInterval: ReturnType<typeof setInterval> | null;

  constructor(playback: AudioPlayback) {
    this.soundInstance = null;
    this.playback = playback;
    this.statusUpdateInterval = null;
  }

  get playbackEntity(): AudioPlayback {
    return this.playback;
  }

  async load(uri: string): Promise<void> {
    try {
      this.playback.setState(AudioPlaybackState.LOADING);

      if (this.soundInstance) {
        await this.unload();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: this.playback.options.shouldPlay,
          volume: this.playback.options.volume,
          isLooping: this.playback.options.isLooping,
          isMuted: this.playback.options.isMuted,
          rate: this.playback.options.playbackRate,
          progressUpdateIntervalMillis:
            this.playback.options.progressUpdateIntervalMillis,
        }
      );

      this.soundInstance = sound;
      this.playback.setUri(uri);

      const status = await this.soundInstance.getStatusAsync();

      if (status.isLoaded) {
        this.playback.setDuration(status.durationMillis || 0);
        this.playback.setPosition(status.positionMillis || 0);
        this.playback.setState(AudioPlaybackState.READY);
      }

      this.startStatusUpdate();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to load audio');
      this.playback.setError(err);
      throw err;
    }
  }

  async play(): Promise<void> {
    try {
      if (!this.soundInstance || !this.playback.canPlay) {
        throw new Error('Cannot play audio');
      }

      this.playback.setState(AudioPlaybackState.PLAYING);

      await this.soundInstance.playAsync();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to play audio');
      this.playback.setError(err);
      throw err;
    }
  }

  async pause(): Promise<void> {
    try {
      if (!this.soundInstance || !this.playback.canPause) {
        throw new Error('Cannot pause audio');
      }

      this.playback.setState(AudioPlaybackState.PAUSED);

      await this.soundInstance.pauseAsync();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to pause audio');
      this.playback.setError(err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.soundInstance || !this.playback.canStop) {
        throw new Error('Cannot stop audio');
      }

      this.playback.setState(AudioPlaybackState.STOPPED);

      await this.soundInstance.stopAsync();
      this.playback.setPosition(0);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to stop audio');
      this.playback.setError(err);
      throw err;
    }
  }

  async seek(position: number): Promise<void> {
    try {
      if (!this.soundInstance || !this.playback.canSeek) {
        throw new Error('Cannot seek audio');
      }

      await this.soundInstance.setPositionAsync(position);
      this.playback.setPosition(position);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to seek audio');
      this.playback.setError(err);
      throw err;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      if (!this.soundInstance) {
        throw new Error('No sound loaded');
      }

      await this.soundInstance.setVolumeAsync(volume);
      this.playback.setVolume(volume);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to set volume');
      this.playback.setError(err);
      throw err;
    }
  }

  async setPlaybackRate(playbackRate: number, shouldCorrectPitch: boolean = false): Promise<void> {
    try {
      if (!this.soundInstance) {
        throw new Error('No sound loaded');
      }

      await this.soundInstance.setRateAsync(playbackRate, shouldCorrectPitch);
      this.playback.setPlaybackRate(playbackRate);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to set playback rate');
      this.playback.setError(err);
      throw err;
    }
  }

  async setLooping(isLooping: boolean): Promise<void> {
    try {
      if (!this.soundInstance) {
        throw new Error('No sound loaded');
      }

      await this.soundInstance.setIsLoopingAsync(isLooping);
      this.playback.setLooping(isLooping);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to set looping');
      this.playback.setError(err);
      throw err;
    }
  }

  async setMuted(isMuted: boolean): Promise<void> {
    try {
      if (!this.soundInstance) {
        throw new Error('No sound loaded');
      }

      await this.soundInstance.setIsMutedAsync(isMuted);
      this.playback.setMuted(isMuted);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to set muted');
      this.playback.setError(err);
      throw err;
    }
  }

  async unload(): Promise<void> {
    try {
      if (this.soundInstance) {
        await this.soundInstance.unloadAsync();
        this.soundInstance = null;
      }

      this.stopStatusUpdate();
      this.playback.reset();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to unload audio');
      this.playback.setError(err);
      throw err;
    }
  }

  private startStatusUpdate(): void {
    if (!this.soundInstance) return;

    this.statusUpdateInterval = setInterval(async () => {
      if (!this.soundInstance) {
        this.stopStatusUpdate();
        return;
      }

      try {
        const status = await this.soundInstance.getStatusAsync();

        if (!status.isLoaded) {
          this.stopStatusUpdate();
          return;
        }

        const playbackStatus: PlaybackStatus = {
          didJustFinish: status.didJustFinish,
          durationMillis: status.durationMillis || 0,
          isBuffering: status.isBuffering,
          isLoaded: status.isLoaded,
          isLooping: status.isLooping,
          isPlaying: status.isPlaying,
          isMuted: status.isMuted,
          positionMillis: status.positionMillis || 0,
          playbackRate: status.rate,
          volume: status.volume,
        };

        this.playback.setStatus(playbackStatus);
        this.playback.setDuration(status.durationMillis || 0);
        this.playback.setPosition(status.positionMillis || 0);

        if (status.didJustFinish && !this.playback.isLooping) {
          this.playback.setState(AudioPlaybackState.COMPLETED);
          this.stopStatusUpdate();
        }
      } catch {
        this.stopStatusUpdate();
      }
    }, this.playback.options.progressUpdateIntervalMillis);
  }

  private stopStatusUpdate(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
  }

  dispose(): void {
    this.stopStatusUpdate();
    this.soundInstance = null;
    this.playback.reset();
  }
}
