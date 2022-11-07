export const connectAudioGainNode = (stream: MediaStream) => {
  // Create Audio Context from MediaStream
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);

  // Create gain node
  const gainNode = audioCtx.createGain();

  // Connect AudioBufferSourceNode to Gain Node
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  return { source, gainNode };
};
