import config from '@/config';

export type SpeechEvent = 'speaking' | 'stopped_speaking';

export interface EmitSpeechEventPayload {
  spaceSpeakerId: number;
  event: SpeechEvent;
}

/**
 * Send speech event to WebSocket server
 * @param spaceSpeakerId SpaceSpeaker ID
 * @param event Speech Event
 */
export const sendSpeechEvent = (
  socket: any,
  payload: EmitSpeechEventPayload
) => {
  const { event, spaceSpeakerId } = payload;
  socket.emit(
    `${config.handlerNamespace.spaceSpeaker}:speech-event`,
    {
      event,
      spaceSpeakerId,
      socketId: socket.id,
    },
    (res: any) => {
      console.log('did it callhere?');
      if (res.status === 'NOK') {
        console.error(res.error);
      }
    }
  );
};
