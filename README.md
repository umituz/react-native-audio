# @umituz/react-native-audio

Audio recording and playback for React Native apps - Recording, playback, video playback using expo-av.

## Features

- ✅ **Audio Recording** - High/low quality recording with permissions
- ✅ **Audio Playback** - Play, pause, stop, seek, volume, rate control
- ✅ **Video Playback** - Re-exports Video component from expo-av
- ✅ **Permission Management** - Built-in microphone permissions
- ✅ **File Operations** - Save recordings to device storage
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Playback State** - Real-time playback status updates

## Installation

```bash
npm install @umituz/react-native-audio
```

## Peer Dependencies

```bash
npm install expo-av @umituz/react-native-filesystem
```

## Usage

### Audio Recording

```tsx
import { useAudio, AudioQuality } from '@umituz/react-native-audio';

function MyComponent() {
  const { startRecording, stopRecording, isRecording } = useAudio();

  const handleRecord = async () => {
    if (isRecording) {
      const info = await stopRecording();
      console.log('Recorded:', info?.uri, info?.duration);
    } else {
      await startRecording({ quality: AudioQuality.HIGH });
    }
  };

  return (
    <Button onPress={handleRecord}>
      {isRecording ? 'Stop' : 'Record'}
    </Button>
  );
}
```

### Audio Playback

```tsx
const { loadAudio, play, pause, playbackState } = useAudio();

const handlePlay = async () => {
  await loadAudio('file:///path/to/audio.m4a');
  await play();
};

// Access playback state
console.log('Position:', playbackState?.positionMillis);
console.log('Duration:', playbackState?.durationMillis);
console.log('Is playing:', playbackState?.isPlaying);
```

### Playback Controls

```tsx
const {
  play,
  pause,
  stop,
  seekTo,
  setVolume,
  setRate,
  setMuted,
  setLooping,
} = useAudio();

// Seek to 30 seconds
await seekTo(30000);

// Set volume to 50%
await setVolume(0.5);

// Play at 1.5x speed
await setRate(1.5);

// Enable looping
await setLooping(true);
```

### Recording with Save

```tsx
import { useAudio, RECORDING_PRESETS } from '@umituz/react-native-audio';

const { startRecording, stopRecording, saveRecording } = useAudio();

const handleRecordAndSave = async () => {
  await startRecording(RECORDING_PRESETS.HIGH_QUALITY);
  // ... wait for user to finish
  const info = await stopRecording();
  if (info) {
    const savedUri = await saveRecording(info.uri, 'my-recording.m4a');
    console.log('Saved to:', savedUri);
  }
};
```

### Video Playback

```tsx
import { Video } from '@umituz/react-native-audio';

<Video
  source={{ uri: 'https://example.com/video.mp4' }}
  style={{ width: 300, height: 200 }}
  useNativeControls
  resizeMode="contain"
  shouldPlay={false}
/>
```

### Permissions

```tsx
const { requestPermission, getPermissionStatus } = useAudio();

const checkPermission = async () => {
  const status = await getPermissionStatus();
  if (status !== 'granted') {
    await requestPermission();
  }
};
```

### Audio Utilities

```tsx
import { AudioUtils } from '@umituz/react-native-audio';

// Format duration (milliseconds to MM:SS)
const formatted = AudioUtils.formatDuration(125000); // "02:05"

// Calculate progress percentage
const progress = AudioUtils.calculateProgress(30000, 120000); // 25%

// Estimate file size
const size = AudioUtils.estimateFileSize(60000, 128000); // bytes
```

## API Reference

### `useAudio()`

React hook for audio operations.

**Returns:**
- `startRecording(options?)` - Start recording
- `stopRecording()` - Stop recording
- `pauseRecording()` - Pause recording
- `resumeRecording()` - Resume recording
- `saveRecording(uri, filename?)` - Save recording
- `loadAudio(uri, options?)` - Load audio
- `play()` - Play audio
- `pause()` - Pause audio
- `stop()` - Stop audio
- `seekTo(positionMillis)` - Seek to position
- `setVolume(volume)` - Set volume (0-1)
- `setRate(rate)` - Set playback rate (0.5-2.0)
- `setMuted(isMuted)` - Set mute
- `setLooping(isLooping)` - Set looping
- `unloadAudio()` - Unload audio
- `requestPermission()` - Request microphone permission
- `getPermissionStatus()` - Get permission status
- `isRecording` - Recording state
- `recordingDuration` - Recording duration
- `playbackState` - Playback state
- `isLoading` - Loading state
- `error` - Error message

### `AudioRecordingService`

Static service class for recording operations.

**Methods:**
- `requestPermission()` - Request permission
- `getPermissionStatus()` - Get permission status
- `startRecording(options?)` - Start recording
- `stopRecording()` - Stop recording
- `pauseRecording()` - Pause recording
- `resumeRecording()` - Resume recording
- `getRecordingStatus()` - Get recording status
- `saveRecording(uri, filename?)` - Save recording
- `deleteRecording(uri)` - Delete recording

### `AudioPlaybackService`

Static service class for playback operations.

**Methods:**
- `loadAudio(uri, options?)` - Load audio
- `play()` - Play audio
- `pause()` - Pause audio
- `stop()` - Stop audio
- `seekTo(positionMillis)` - Seek to position
- `setVolume(volume)` - Set volume
- `setRate(rate)` - Set playback rate
- `setMuted(isMuted)` - Set mute
- `setLooping(isLooping)` - Set looping
- `getStatus()` - Get playback status
- `unloadAudio()` - Unload audio
- `setStatusUpdateCallback(callback)` - Set status update callback

### `AudioUtils`

Utility class for audio operations.

**Methods:**
- `formatDuration(millis)` - Format duration to MM:SS
- `estimateFileSize(durationMs, bitRate?)` - Estimate file size
- `isWithinDurationLimit(durationMs)` - Check duration limit
- `calculateProgress(positionMillis, durationMillis)` - Calculate progress %
- `validateVolume(volume)` - Validate volume (0-1)
- `validateRate(rate)` - Validate rate (0.5-2.0)

## Types

- `AudioQuality` - Low, High
- `AudioEncoding` - AAC, AMR_NB, AMR_WB, LINEAR_PCM, MP3
- `PlaybackStatus` - Loading, Loaded, Playing, Paused, Stopped, Finished, Error
- `RecordingStatus` - Ready, Recording, Paused, Stopped, Error
- `AudioPermission` - Granted, Denied, Undetermined
- `AudioRecordingOptions` - Recording configuration
- `AudioPlaybackOptions` - Playback configuration
- `RecordingInfo` - Recording information
- `PlaybackState` - Playback state information

## License

MIT

## Author

Ümit UZ <umit@umituz.com>

