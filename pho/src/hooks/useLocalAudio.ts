import hark from 'hark';

import { MutableRefObject, useRef, useState } from 'react';

import { AudioParams } from '@/types/spaceSpeaker';

export interface UseLocalAudio {
  getLocalUserMedia: (
    onSpeaking?: () => void,
    onStoppedSpeaking?: () => void
  ) => Promise<void>;
  localAudioRef: MutableRefObject<HTMLAudioElement | null>;
  audioParams: AudioParams | null;
  isSpeaking: boolean;
}

/**
 * useLocalAudio handles audio stream & ref for HTML audio element
 * @returns Local Audio states & refs
 */
export const useLocalAudio = (): UseLocalAudio => {
  // Refs
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  // States
  const [audioParams, setAudioParams] = useState<AudioParams | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  /**
   * Get Local User Audio stream
   */
  const getLocalUserMedia = async (
    onSpeaking?: () => void,
    onStoppedSpeaking?: () => void
  ) => {
    const constraints: MediaStreamConstraints | undefined = {
      audio: true,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localAudioRef.current) {
        // Setup Hark
        const opts = {};
        const speechEvents = hark(stream, opts);

        /**
         * On speaking
         */
        speechEvents.on('speaking', () => {
          if (onSpeaking) onSpeaking();
          setIsSpeaking(true);
        });

        /**
         * On stop speaking
         */
        speechEvents.on('stopped_speaking', () => {
          if (onStoppedSpeaking) onStoppedSpeaking();
          setIsSpeaking(false);
        });

        // Assign audio stream to view
        localAudioRef.current.srcObject = stream;
        localAudioRef.current.volume = 0;

        // Create Audio Context from MediaStream
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);

        // Create gain node
        const gainNode = audioCtx.createGain();

        // Connect AudioBufferSourceNode to Gain Node
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Set local audio volume to 0 (avoid echo)
        gainNode.gain.value = 0;

        // Update audio params from stream track
        setAudioParams({
          track: source.mediaStream.getAudioTracks()[0],
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error(
        'Cannot get user media from microphone. Please grant the required permission.'
      );
    }
  };
  return {
    getLocalUserMedia,
    localAudioRef,
    audioParams,
    isSpeaking,
  };
};
