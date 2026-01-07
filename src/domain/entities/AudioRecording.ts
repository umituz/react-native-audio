import {
  AudioFormat,
  AudioMetadata,
  AudioRecordingConfig,
  AudioRecordingState,
  RecordingResult,
  RecordingStatus,
} from '../types/AudioTypes';

/**
 * AudioRecording entity - manages audio recording state and operations
 */
export class AudioRecording {
  private _state: AudioRecordingState;
  private _config: AudioRecordingConfig;
  private _uri: string | null;
  private _duration: number;
  private _error: Error | null;
  private _status: RecordingStatus | null;

  constructor(config: AudioRecordingConfig) {
    this._state = AudioRecordingState.IDLE;
    this._config = config;
    this._uri = null;
    this._duration = 0;
    this._error = null;
    this._status = null;
  }

  get state(): AudioRecordingState {
    return this._state;
  }

  get config(): AudioRecordingConfig {
    return this._config;
  }

  get uri(): string | null {
    return this._uri;
  }

  get duration(): number {
    return this._duration;
  }

  get error(): Error | null {
    return this._error;
  }

  get status(): RecordingStatus | null {
    return this._status;
  }

  get isRecording(): boolean {
    return this._state === AudioRecordingState.RECORDING;
  }

  get isPaused(): boolean {
    return this._state === AudioRecordingState.PAUSED;
  }

  get isStopped(): boolean {
    return this._state === AudioRecordingState.STOPPED;
  }

  get hasError(): boolean {
    return this._state === AudioRecordingState.ERROR;
  }

  get canRecord(): boolean {
    return (
      this._state === AudioRecordingState.IDLE ||
      this._state === AudioRecordingState.STOPPED
    );
  }

  get canPause(): boolean {
    return this._state === AudioRecordingState.RECORDING;
  }

  get canStop(): boolean {
    return (
      this._state === AudioRecordingState.RECORDING ||
      this._state === AudioRecordingState.PAUSED
    );
  }

  get canResume(): boolean {
    return this._state === AudioRecordingState.PAUSED;
  }

  setState(state: AudioRecordingState): void {
    this._state = state;
  }

  setUri(uri: string): void {
    this._uri = uri;
  }

  setDuration(duration: number): void {
    this._duration = duration;
  }

  setError(error: Error): void {
    this._error = error;
    this._state = AudioRecordingState.ERROR;
  }

  setStatus(status: RecordingStatus): void {
    this._status = status;
  }

  clearError(): void {
    this._error = null;
  }

  reset(): void {
    this._state = AudioRecordingState.IDLE;
    this._uri = null;
    this._duration = 0;
    this._error = null;
    this._status = null;
  }

  toResult(): RecordingResult {
    if (!this._uri) {
      throw new Error('No recording URI available');
    }

    return {
      uri: this._uri,
      duration: this._duration,
      status: this._state,
    };
  }

  toMetadata(): AudioMetadata {
    if (!this._uri) {
      throw new Error('No recording URI available');
    }

    return {
      uri: this._uri,
      duration: this._duration,
      format: this._config.format as AudioFormat,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
  }

  static fromMetadata(
    metadata: AudioMetadata,
    config: AudioRecordingConfig
  ): AudioRecording {
    const recording = new AudioRecording(config);
    recording._uri = metadata.uri;
    recording._duration = metadata.duration;
    recording._state = AudioRecordingState.STOPPED;
    return recording;
  }
}
