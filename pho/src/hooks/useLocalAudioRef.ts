import hark from 'hark';

import { useRef, useState } from 'react';

import { AudioParams } from '@/types/spaceSpeaker';

export const useLocalAudioRef = () => {
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const [audioParams, setAudioParams] = useState<AudioParams | null>(null);

  /**
   * Get Local User Audio stream
   */
  const getLocalUserMedia = async () => {
    const constraints: MediaStreamConstraints | undefined = {
      audio: true,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localAudioRef.current) {
        // Setup Hark
        const opts = {};
        const speechEvents = hark(stream, opts);

        // Speaking Events //
        /**
         * On speaking
         */
        speechEvents.on('speaking', () => {
          console.log('Speaking.');
        });

        /**
         * On stop speaking
         */
        speechEvents.on('stopped_speaking', () => {
          console.log('Stopped Speaking.');
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
  return { getLocalUserMedia, localAudioRef, audioParams };
};
