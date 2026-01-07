import { Audio } from 'expo-av';
import { AudioRecording } from '../../domain/entities/AudioRecording';
import { AudioRecordingState } from '../../domain/types/AudioTypes';
import { AudioErrorCode } from '../../domain/constants/AudioConstants';

/**
 * AudioRecordingService - handles audio recording operations using expo-av
 */
export class AudioRecordingService {
  private recordingInstance: Audio.Recording | null;
  private recording: AudioRecording;

  constructor(recording: AudioRecording) {
    this.recordingInstance = null;
    this.recording = recording;
  }

  get recordingEntity(): AudioRecording {
    return this.recording;
  }

  async prepare(config: Audio.RecordingOptions): Promise<void> {
    try {
      this.recording.setState(AudioRecordingState.PREPARING);

      this.recordingInstance = new Audio.Recording();
      await this.recordingInstance.prepareToRecordAsync(config);

      this.recording.setState(AudioRecordingState.IDLE);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to prepare recording');
      this.recording.setError(err);
      throw err;
    }
  }

  async start(): Promise<string> {
    try {
      if (!this.recordingInstance) {
        throw new Error('Recording not prepared. Call prepare() first.');
      }

      this.recording.setState(AudioRecordingState.RECORDING);

      await this.recordingInstance.startAsync();

      const status = await this.recordingInstance.getStatusAsync();
      this.recording.setDuration(status.durationMillis || 0);

      if (status.uri) {
        this.recording.setUri(status.uri);
      }

      this.startStatusUpdate();

      return status.uri || '';
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to start recording');
      this.recording.setError(err);
      throw err;
    }
  }

  async pause(): Promise<void> {
    try {
      if (!this.recordingInstance || !this.recording.canPause) {
        throw new Error('Cannot pause recording');
      }

      this.recording.setState(AudioRecordingState.PAUSED);

      await this.recordingInstance.pauseAsync();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to pause recording');
      this.recording.setError(err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    try {
      if (!this.recordingInstance || !this.recording.canStop) {
        throw new Error('Cannot stop recording');
      }

      this.recording.setState(AudioRecordingState.STOPPING);

      const status = await this.recordingInstance.stopAndUnloadAsync();

      if (status.uri) {
        this.recording.setUri(status.uri);
      }

      this.recording.setDuration(status.durationMillis || 0);
      this.recording.setState(AudioRecordingState.STOPPED);

      this.recordingInstance = null;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to stop recording');
      this.recording.setError(err);
      throw err;
    }
  }

  async cancel(): Promise<void> {
    try {
      if (this.recordingInstance) {
        await this.recordingInstance.stopAndUnloadAsync();
        this.recordingInstance = null;
      }

      this.recording.reset();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Failed to cancel recording');
      this.recording.setError(err);
      throw err;
    }
  }

  private startStatusUpdate(): void {
    if (!this.recordingInstance) return;

    const interval = setInterval(async () => {
      if (!this.recordingInstance) {
        clearInterval(interval);
        return;
      }

      try {
        const status = await this.recordingInstance.getStatusAsync();

        this.recording.setStatus({
          durationMillis: status.durationMillis || 0,
        });

        this.recording.setDuration(status.durationMillis || 0);

        if (!status.isRecording) {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 500);

    if (this.recordingInstance) {
      (this.recordingInstance as any)._statusUpdateInterval = interval;
    }
  }

  private stopStatusUpdate(): void {
    if (this.recordingInstance && (this.recordingInstance as any)._statusUpdateInterval) {
      clearInterval((this.recordingInstance as any)._statusUpdateInterval);
      (this.recordingInstance as any)._statusUpdateInterval = null;
    }
  }

  dispose(): void {
    this.stopStatusUpdate();
    this.recordingInstance = null;
    this.recording.reset();
  }
}
