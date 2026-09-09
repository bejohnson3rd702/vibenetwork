/**
 * Safe getUserMedia utility that filters out virtual audio/video drivers
 * (Zoom, OBS, BlackHole, Soundflower, etc.) to prevent triggering
 * third-party applications when acquiring camera/mic streams.
 */

const VIRTUAL_AUDIO_BLOCKLIST = ['zoom', 'virtual', 'obs', 'blackhole', 'soundflower', 'loopback'];
const VIRTUAL_VIDEO_BLOCKLIST = ['zoom', 'virtual', 'obs', 'epoccam', 'camo'];

function isPhysicalDevice(label: string, blocklist: string[]): boolean {
  if (!label) return false;
  const lower = label.toLowerCase();
  return !blocklist.some(keyword => lower.includes(keyword));
}

export async function getSafeUserMedia(
  requestVideo = true,
  requestAudio = true
): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    video: requestVideo ? { facingMode: 'user' } : false,
    audio: requestAudio ? { echoCancellation: true, noiseSuppression: true } : false,
  };

  try {
    if (navigator.mediaDevices?.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasLabels = devices.some(d => d.label);

      if (hasLabels) {
        // Find a physical audio input device
        if (requestAudio) {
          const physicalAudio = devices.find(
            d => d.kind === 'audioinput' && isPhysicalDevice(d.label, VIRTUAL_AUDIO_BLOCKLIST)
          );
          if (physicalAudio?.deviceId) {
            constraints.audio = {
              deviceId: { ideal: physicalAudio.deviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            };
          }
        }

        // Find a physical video input device
        if (requestVideo) {
          const physicalVideo = devices.find(
            d => d.kind === 'videoinput' && isPhysicalDevice(d.label, VIRTUAL_VIDEO_BLOCKLIST)
          );
          if (physicalVideo?.deviceId) {
            constraints.video = {
              deviceId: { exact: physicalVideo.deviceId },
            };
          }
        }
      }
    }
  } catch (e) {
    console.warn('[mediaUtils] Failed to filter virtual media devices:', e);
  }

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err: any) {
    // If specific device constraints fail, fallback to default hardware constraints
    console.warn('[mediaUtils] Specific constraints failed, retrying with default media constraints:', err);
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: requestVideo ? { facingMode: 'user' } : false,
        audio: requestAudio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false,
      });
    } catch (fallbackErr: any) {
      // Last resort: basic true/false constraints
      return await navigator.mediaDevices.getUserMedia({
        video: requestVideo ? true : false,
        audio: requestAudio ? true : false,
      });
    }
  }
}
