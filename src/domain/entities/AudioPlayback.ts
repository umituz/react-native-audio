import {
  AudioMetadata,
  AudioPlaybackOptions,
  AudioPlaybackState,
  PlaybackResult,
  PlaybackStatus,
} from '../types/AudioTypes';

/**
 * AudioPlayback entity - manages audio playback state and operations
 */
export class AudioPlayback {
  private _state: AudioPlaybackState;
  private _uri: string | null;
  private _options: AudioPlaybackOptions;
  private _duration: number;
  private _position: number;
  private _error: Error | null;
  private _status: PlaybackStatus | null;

  constructor(options: AudioPlaybackOptions) {
    this._state = AudioPlaybackState.IDLE;
    this._uri = null;
    this._options = options;
    this._duration = 0;
    this._position = 0;
    this._error = null;
    this._status = null;
  }

  get state(): AudioPlaybackState {
    return this._state;
  }

  get uri(): string | null {
    return this._uri;
  }

  get options(): AudioPlaybackOptions {
    return this._options;
  }

  get duration(): number {
    return this._duration;
  }

  get position(): number {
    return this._position;
  }

  get volume(): number {
    return this._options.volume;
  }

  get playbackRate(): number {
    return this._options.playbackRate;
  }

  get isLooping(): boolean {
    return this._options.isLooping;
  }

  get isMuted(): boolean {
    return this._options.isMuted;
  }

  get error(): Error | null {
    return this._error;
  }

  get status(): PlaybackStatus | null {
    return this._status;
  }

  get isPlaying(): boolean {
    return this._state === AudioPlaybackState.PLAYING;
  }

  get isPaused(): boolean {
    return this._state === AudioPlaybackState.PAUSED;
  }

  get isStopped(): boolean {
    return this._state === AudioPlaybackState.STOPPED;
  }

  get isCompleted(): boolean {
    return this._state === AudioPlaybackState.COMPLETED;
  }

  get hasError(): boolean {
    return this._state === AudioPlaybackState.ERROR;
  }

  get canPlay(): boolean {
    return (
      this._uri !== null &&
      (this._state === AudioPlaybackState.IDLE ||
        this._state === AudioPlaybackState.READY ||
        this._state === AudioPlaybackState.PAUSED ||
        this._state === AudioPlaybackState.STOPPED ||
        this._state === AudioPlaybackState.COMPLETED)
    );
  }

  get canPause(): boolean {
    return this._state === AudioPlaybackState.PLAYING;
  }

  get canStop(): boolean {
    return (
      this._state === AudioPlaybackState.PLAYING ||
      this._state === AudioPlaybackState.PAUSED ||
      this._state === AudioPlaybackState.LOADING
    );
  }

  get canSeek(): boolean {
    return (
      this._uri !== null &&
      (this._state === AudioPlaybackState.READY ||
        this._state === AudioPlaybackState.PLAYING ||
        this._state === AudioPlaybackState.PAUSED ||
        this._state === AudioPlaybackState.STOPPED ||
        this._state === AudioPlaybackState.COMPLETED)
    );
  }

  get progress(): number {
    if (this._duration === 0) return 0;
    return this._position / this._duration;
  }

  setState(state: AudioPlaybackState): void {
    this._state = state;
  }

  setUri(uri: string): void {
    this._uri = uri;
  }

  setDuration(duration: number): void {
    this._duration = duration;
  }

  setPosition(position: number): void {
    this._position = Math.max(0, Math.min(position, this._duration));
  }

  setVolume(volume: number): void {
    this._options.volume = volume;
  }

  setPlaybackRate(playbackRate: number): void {
    this._options.playbackRate = playbackRate;
  }

  setLooping(isLooping: boolean): void {
    this._options.isLooping = isLooping;
  }

  setMuted(isMuted: boolean): void {
    this._options.isMuted = isMuted;
  }

  setError(error: Error): void {
    this._error = error;
    this._state = AudioPlaybackState.ERROR;
  }

  setStatus(status: PlaybackStatus): void {
    this._status = status;
  }

  clearError(): void {
    this._error = null;
  }

  reset(): void {
    this._state = AudioPlaybackState.IDLE;
    this._uri = null;
    this._duration = 0;
    this._position = 0;
    this._error = null;
    this._status = null;
  }

  toResult(): PlaybackResult {
    if (!this._uri) {
      throw new Error('No playback URI available');
    }

    return {
      uri: this._uri,
      duration: this._duration,
      position: this._position,
      status: this._state,
    };
  }

  static fromMetadata(
    metadata: AudioMetadata,
    options: AudioPlaybackOptions
  ): AudioPlayback {
    const playback = new AudioPlayback(options);
    playback._uri = metadata.uri;
    playback._duration = metadata.duration;
    playback._state = AudioPlaybackState.READY;
    return playback;
  }
}
