import { Audio } from 'expo-av';
import { PermissionStatus, AudioPermission } from '../../domain/types/AudioTypes';
import { AudioErrorCode } from '../../domain/constants/AudioConstants';
import { AudioErrorClass } from '../../domain/types/AudioTypes';

/**
 * Request audio recording permission
 */
export async function requestAudioPermission(): Promise<PermissionStatus> {
  try {
    const status = await Audio.requestPermissionsAsync();

    if (status.status === 'granted') {
      return PermissionStatus.GRANTED;
    }

    return PermissionStatus.DENIED;
  } catch (error) {
    throw new AudioErrorClass(
      AudioErrorCode.PERMISSION_DENIED,
      'Failed to request audio permission',
      error
    );
  }
}

/**
 * Get current audio permission status
 */
export async function getAudioPermissionStatus(): Promise<PermissionStatus> {
  try {
    const status = await Audio.getPermissionsAsync();

    if (!status.granted) {
      return PermissionStatus.DENIED;
    }

    return PermissionStatus.GRANTED;
  } catch {
    return PermissionStatus.UNDETERMINED;
  }
}

/**
 * Check if audio permission is granted
 */
export async function hasAudioPermission(): Promise<boolean> {
  const status = await getAudioPermissionStatus();
  return status === PermissionStatus.GRANTED;
}

/**
 * Ensure audio permission is granted, request if needed
 */
export async function ensureAudioPermission(): Promise<void> {
  const hasPermission = await hasAudioPermission();

  if (!hasPermission) {
    const status = await requestAudioPermission();

    if (status !== PermissionStatus.GRANTED) {
      throw new AudioErrorClass(
        AudioErrorCode.PERMISSION_DENIED,
        'Audio permission not granted'
      );
    }
  }
}

/**
 * Setup audio mode for recording/playback
 */
export async function setupAudioMode(
  allowsRecording: boolean = true,
  playsInSilentMode: boolean = true
): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: allowsRecording,
      playsInSilentModeIOS: playsInSilentMode,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    throw new AudioErrorClass(
      AudioErrorCode.DEVICE_NOT_AVAILABLE,
      'Failed to setup audio mode',
      error
    );
  }
}

/**
 * Check if audio mode is properly configured
 */
export async function isAudioModeSet(): Promise<boolean> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
    return true;
  } catch {
    return false;
  }
}
