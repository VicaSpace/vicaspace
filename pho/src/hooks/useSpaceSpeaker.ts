import { Consumer } from 'mediasoup-client/lib/Consumer';
import { Transport } from 'mediasoup-client/lib/Transport';

import { useToast } from '@chakra-ui/react';
import { createRef, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import config from '@/config';
import { useDevice } from '@/hooks/useDevice';
import { useLocalAudioRef } from '@/hooks/useLocalAudioRef';
import { useSpaceRtpCapabilities } from '@/hooks/useSpaceRtpCapabilities';
import { countObjectKeys } from '@/lib/object';
import { WebSocketContext } from '@/modules/ws/WebSocketProvider';
import {
  deleteSpeaker,
  insertSpeaker,
  leaveSpaceSpeaker,
  setSpeakers,
  unsetSpeakers,
} from '@/states/spaceSpeaker/slice';
import {
  ClientConsumeResponse,
  CreateTransportResponse,
  GetSpeakersResponse,
  PeerAudioRefs,
  RecentUserJoinPayload,
  RecentUserLeavePayload,
  RecvTransports,
  SpeakerDetails,
} from '@/types/spaceSpeaker';

const { handlerNamespace } = config;

/**
 * UseSpaceSpeaker Hook
 * @param spaceSpeakerId SpaceSpeaker ID
 * @param speakers Speakers info
 * @returns List of audio refs
 */
export const useSpaceSpeaker = (
  spaceSpeakerId?: number,
  speakers?: SpeakerDetails
) => {
  /// Context setup
  const { socket } = useContext(WebSocketContext);
  const toast = useToast();
  const dispatch = useDispatch();

  /// Custom Hooks
  const { audioParams, getLocalUserMedia, localAudioRef } = useLocalAudioRef();
  const { getSpaceRtpCapabilities, rtpCapabilities } =
    useSpaceRtpCapabilities();
  const { device, initDevice } = useDevice();

  /* * Transport States * */
  const [sendTransport, setSendTransport] = useState<Transport | null>(null);
  const [localProducerId, setLocalProducerId] = useState<string | null>(null);
  const [recentRecvTransportId, setRecentRecvTransportId] = useState<
    string | null
  >(null);
  const [recvTransports, setRecvTransports] = useState<RecvTransports>({});
  const [deleteSpeakerId, setDeleteSpeakerId] = useState<string | null>(null);

  /* * Refs * */
  const peerAudioRefs = useRef<PeerAudioRefs>({});

  // On component unmount
  useEffect(() => {
    if (!spaceSpeakerId || !audioParams) return;
    return () => {
      // Announce leave notification
      toast({
        title: `Leave SpaceSpeaker`,
        description: `Leaving SpaceSpeaker (ID: ${spaceSpeakerId}) upon closing...`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      // TODO: Send client's socketId & producerId to terminate
      socket.emit(`${handlerNamespace.spaceSpeaker}:leave`, {
        spaceSpeakerId,
        producerId: localProducerId,
        sendTransportId: sendTransport?.id,
      });

      // Leave Space Speaker when unmount component
      dispatch(leaveSpaceSpeaker());

      // Remove client audio when leave
      audioParams.track.stop();

      // Clear all speakers from space
      dispatch(unsetSpeakers());

      // Offload socket on unmount
      socket.off(`${handlerNamespace.spaceSpeaker}:recent-user-join`);
      socket.off(`${handlerNamespace.spaceSpeaker}:recent-user-leave`);
    };
  }, [socket, audioParams]);

  /// Socket setup handlers
  useEffect(() => {
    if (!spaceSpeakerId || !audioParams) return;
    // Handle recent user join to SpaceSpeaker
    socket.on(
      `${handlerNamespace.spaceSpeaker}:recent-user-join`,
      ({ socketId, producerId }: RecentUserJoinPayload) => {
        // Skip client's own ID
        if (socket.id === socketId) return;

        console.log(
          `A recent user (sid: ${socketId}) (with pId: ${producerId}) has joined.`
        );

        // Add new audio ref for incoming speakers
        peerAudioRefs.current[socketId] = {
          id: socketId,
          ref: createRef<HTMLAudioElement>(),
        };

        // // Create Receiver Transports upon new comer
        console.log(
          'Add a receiver on new join in this room with spaceSpeakerId:',
          spaceSpeakerId
        );
        createRecvTransport(socketId).catch(console.error);

        // Add newcomer to the speaker state
        dispatch(
          insertSpeaker({
            id: socketId,
            producerId,
          })
        );
      }
    );

    /// Handle latest user leave space
    socket.on(
      `${handlerNamespace.spaceSpeaker}:recent-user-leave`,
      ({ socketId }: RecentUserLeavePayload) => {
        if (socketId === socket.id) return; // Skip client ID
        // Detach RecvTransport from deleting speaker
        setDeleteSpeakerId(socketId);
        console.log(`User (${socketId}) left the space ❌.`);
      }
    );
  }, [socket, device, spaceSpeakerId]);

  /**
   * Detect if we should trigger Deletion for RECV,
   */
  useEffect(() => {
    // Trigger on specified deleting speaker id
    if (!deleteSpeakerId) return;

    // Remove RECVTransport of leaving user
    setRecvTransports((prevRecvTransports) => {
      delete prevRecvTransports[deleteSpeakerId];
      return {
        ...prevRecvTransports,
      };
    });

    // Delete speaker from list
    dispatch(deleteSpeaker(deleteSpeakerId));

    // Delete audio ref of leaving speaker
    delete peerAudioRefs.current[deleteSpeakerId];
  }, [deleteSpeakerId]);

  /*
   * Join a SpaceSpeaker by Id
   * @param spaceSpeakerId ID to join
   * @returns void | Throw error if error raised
   */
  const joinSpaceSpeakerSocket = async (
    spaceSpeakerId: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      socket.emit(
        `${handlerNamespace.spaceSpeaker}:join`,
        { spaceSpeakerId, producerId: localProducerId },
        () => {
          console.log(
            `Join SpaceSpeaker (id: ${spaceSpeakerId}) successfully.`
          );
          resolve();
        }
      );
    });
  };

  /**
   * Fetch initial list of SpaceSpeaker's speakers (on join)
   * @param spaceSpeakerId SpaceSpeaker ID
   * @returns Get speakers of a SpaceSpeaker session
   */
  const fetchSpeakers = async (spaceSpeakerId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        `${handlerNamespace.spaceSpeaker}:get-speakers`,
        { spaceSpeakerId },
        async (res: GetSpeakersResponse) => {
          if (res.error) {
            return reject(res.error);
          }
          if (!res.speakers) return;

          // Initialize speaker audio refs
          // Update speaker count
          Object.keys(res.speakers).forEach((sId) => {
            if (socket.id === sId) return; // Skip client id
            peerAudioRefs.current[sId] = {
              id: sId,
              ref: createRef<HTMLAudioElement>(),
            };
            // // Create Receiver Transports
            createRecvTransport(sId).catch(console.error);
          });

          // Set initial speakers
          dispatch(setSpeakers(res.speakers));
          resolve();
        }
      );
    });
  };

  /**
   * Connect Peer Transport on connection
   */
  const connectPeerTransport = async () => {
    if (
      !speakers ||
      !recentRecvTransportId ||
      countObjectKeys(recvTransports) === 0
    )
      return;
    // Find peer id from given transport
    const matchRecvTransportId = Object.keys(recvTransports).find((k) => {
      return recvTransports[k].id === recentRecvTransportId;
    });
    if (!matchRecvTransportId) return;

    // Find peer with given recvTransports
    const { peerSocketId } = recvTransports[matchRecvTransportId];
    const peerProducerId = speakers[peerSocketId].producerId;

    // Connect Recv Transports
    await connectRecvTransport(
      spaceSpeakerId as number,
      recentRecvTransportId,
      peerProducerId
    );
    // Increase speaker count on successful peer connection
  };

  /**
   * Add/Delete Recv Transport from peer's Producer
   */
  useEffect(() => {
    // If RecvTransports has been set without deleteSpeakerId -> Connect
    if (!deleteSpeakerId) {
      connectPeerTransport().catch(console.error);
      return;
    }
    // Reset deleteSpeakerId after setting RecvTransports
    setDeleteSpeakerId(null);
  }, [recvTransports, recentRecvTransportId]);

  /**
   * Load a new device for user's (to create transport)
   */
  const loadDevice = async () => {
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
    // Loads the device with RTP capabilities of the Router (server side)
    if (!rtpCapabilities) {
      throw new Error(
        'Cannot create device. RTP Capabilities is currently null.'
      );
    }
    // Load device
    try {
      await device?.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      if (device?.loaded) {
        console.log('Loaded device successfully.');
      } else {
        console.log('Device loaded failed');
      }
    } catch (err) {
      console.error(err);
      if ((err as any).name === 'UnsupportedError') {
        console.warn('Browser not supported');
      }
    }
  };

  /**
   * Create Send Transport to server for a specific space
   */
  const createSendTransport = async (spaceSpeakerId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      socket.emit(
        `${handlerNamespace.rtc}:create-webrtcTransport`,
        { spaceSpeakerId },
        ({ params }: CreateTransportResponse) => {
          // The server sends back the params needed
          // to create the transport client-side
          if (params.error) {
            console.error(params.error);
            reject(params.error);
          }

          // Create a new WebRTC Transport to send media
          // based on server's producer transport params
          try {
            const sendTransport = device?.createSendTransport(params);
            if (!sendTransport) {
              return reject(new Error('Cannot create Send transport.'));
            }
            // Attach on send transport connects listener
            sendTransport.on(
              'connect',
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              async ({ dtlsParameters }, callback, errback) => {
                try {
                  // Signal local DTLS parameters to the server side transport
                  socket.emit(`${handlerNamespace.rtc}:connect-transport`, {
                    transportId: sendTransport.id,
                    spaceSpeakerId,
                    dtlsParameters,
                  });
                  // Tell the transport that parameters were transmitted.
                  callback();
                } catch (err) {
                  errback(err as Error);
                }
              }
            );

            // Attach on send transport produces listener
            sendTransport.on('produce', (parameters, callback, errback) => {
              try {
                // Tell the server to create a Producer
                // with the following parameters and produce,
                // and expect back a server-side producer id
                // see server's socket.on('rtc:create-producer', ...)
                socket.emit(
                  `${handlerNamespace.rtc}:create-producer`,
                  {
                    transportId: sendTransport.id,
                    spaceSpeakerId,
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    // appData: parameters.appData,
                  },
                  ({ id }: { id: string }) => {
                    // Tell the transport that parameters were transmitted and provide it with
                    // the server-side producer's id.
                    const producerIdObj = { id };
                    setLocalProducerId(id);
                    callback(producerIdObj);
                  }
                );
              } catch (err) {
                errback(err as Error);
              }
            });
            setSendTransport(sendTransport);
          } catch (err) {
            console.error(err);
            return reject(params.error);
          }
          resolve();
        }
      );
    });
  };

  /**
   * Connect Send Transport to the server for sending media
   */
  const connectSendTransport = async () => {
    // We now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    if (!audioParams) {
      console.error('No Audio Parameters available for transporting');
      return;
    }
    if (!sendTransport) {
      console.error('No Producer Transport available yet.');
      return;
    }

    const audioProducer = await sendTransport.produce(audioParams);

    audioProducer.on('trackended', () => {
      console.log('audio track ended');
    });

    audioProducer.on('transportclose', () => {
      console.log('audio transport ended');
    });

    console.log('Created Producer Transport ✅');
  };

  /**
   * On Join SpaceSpeaker Setup action
   */
  const onJoinSpaceSpeaker = async () => {
    // Get user's mic ref
    await getLocalUserMedia();

    // Get RTP Capabilities of spaceSpeakerId after joining
    await getSpaceRtpCapabilities(spaceSpeakerId as number);

    // Set/Initialize device
    initDevice();
  };

  /**
   * On joining SpaceSpeaker
   */
  useEffect(() => {
    if (!spaceSpeakerId) return;
    onJoinSpaceSpeaker().catch(console.error);
  }, [spaceSpeakerId]);

  /**
   * On device loaded
   */
  useEffect(() => {
    if (!device || !rtpCapabilities) return;
    loadDevice()
      .then(async () => createSendTransport(spaceSpeakerId as number))
      .catch(console.error);
  }, [device, rtpCapabilities]);

  /**
   * Connect recently created Send Transport to Server's one
   */
  useEffect(() => {
    if (!sendTransport) return;
    connectSendTransport().catch(console.error);
  }, [sendTransport]);

  /**
   * Actions performed on SpaceSpeaker joined
   */
  const onSpaceSpeakerJoin = async () => {
    if (!localProducerId) return;
    if (!spaceSpeakerId) {
      throw new Error('SpaceSpeaker ID is invalid.');
    }

    await joinSpaceSpeakerSocket(spaceSpeakerId);

    await fetchSpeakers(spaceSpeakerId);

    // Announce successfully join the SpaceSpeaker from client
    toast({
      title: `Join SpaceSpeaker`,
      description: `You've joined SpaceSpeaker ${spaceSpeakerId}  successfully.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  /**
   * On Send Transport created & connected as producer
   */
  useEffect(() => {
    onSpaceSpeakerJoin().catch(console.error);
  }, [localProducerId]);

  /**
   * Unload Cleanup for SpaceSpeaker
   */
  const unloadCleanup = () => {
    socket.emit(`${handlerNamespace.spaceSpeaker}:leave`, {
      spaceSpeakerId,
      producerId: localProducerId,
      sendTransportId: sendTransport?.id,
    });
    console.log('Left SpaceSpeaker.');
  };

  useEffect(() => {
    // TODO: Add a leave mechanism for moving between 2 tabs
    // Add tab unload listener
    window.addEventListener('beforeunload', unloadCleanup);
    return () => {
      window.removeEventListener('beforeunload', unloadCleanup);
    };
  }, [unloadCleanup]);

  /* * * RECV Section * * */

  /**
   * Create Recv Transport from server and init local device based on given params
   * @returns Recv Transport ID
   */
  const createRecvTransport = async (peerSocketId: string): Promise<void> => {
    if (!spaceSpeakerId) {
      throw new Error('SpaceSpeaker ID is invalid.');
    }
    return new Promise((resolve, reject) => {
      socket.emit(
        `${handlerNamespace.rtc}:create-webrtcTransport`,
        { spaceSpeakerId },
        ({ params }: CreateTransportResponse) => {
          if (params.error) {
            console.error(params.error);
            return reject(new Error(params.error as any));
          }
          if (!device) {
            return reject(new Error('Device is not found!'));
          }

          // Add a new WebRTC Transport to receive media
          // based on server's consumer transport params
          // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-createRecvTransport
          const recvTsp = device.createRecvTransport(params);

          // Attach on connect listener
          recvTsp.on('connect', ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit(`${handlerNamespace.rtc}:connect-transport`, {
                dtlsParameters,
                transportId: recvTsp.id,
                spaceSpeakerId,
              });
              // Inform receiver has connected successfully.
              callback();
            } catch (err) {
              errback(err as Error);
            }
          });

          // Update new Recv Transport record
          setRecvTransports((prevRecvTransports) => ({
            ...prevRecvTransports,
            [recvTsp.id]: {
              id: recvTsp.id,
              transport: recvTsp,
              peerSocketId,
            },
          }));

          // Update recent RecvTransportId
          setRecentRecvTransportId(recvTsp.id);

          resolve();
        }
      );
    });
  };

  /**
   * Connect Recv Transport to create a consumer from server
   * @param spaceSpeakerId SpaceSpeaker ID
   * @param transportId Transport ID to connect
   * @param producerId Producer ID to be connected with
   */
  const connectRecvTransport = async (
    spaceSpeakerId: number,
    transportId: string,
    producerId: string
  ): Promise<void> => {
    // Check for loaded device
    return new Promise((resolve, reject) => {
      if (!device) {
        return reject(new Error('Device is not found.'));
      }
      const { transport: recvTransport, peerSocketId } =
        recvTransports[transportId];

      if (!recvTransport) {
        return reject(new Error('Consumer Transport not created.'));
      }

      // Emit create consumer event
      socket.emit(
        `${handlerNamespace.rtc}:create-consumer`,
        {
          spaceSpeakerId,
          transportId,
          producerId,
          rtpCapabilities: device.rtpCapabilities,
        },
        async ({ params }: ClientConsumeResponse) => {
          if (params.error) {
            return reject(new Error(params.error as string));
          }
          console.log('Consume Params:', params);

          // Consume with local media transport -> Init a consumer
          let consumer: Consumer | undefined;
          try {
            consumer = await recvTransport.consume({
              id: params.id,
              producerId: params.producerId,
              kind: params.kind,
              rtpParameters: params.rtpParameters,
            });
          } catch (err) {
            console.error(err);
          }
          if (!consumer) {
            return reject(
              new Error('Cannot create consumer from given parameters.')
            );
          }

          // Destructure track from producer retrieved by consumer
          const { track } = consumer;

          // Assign to remote audio track section
          if (!peerAudioRefs.current[peerSocketId]) {
            return reject(
              new Error(
                'Cannot find reference to audio element of given socket id.'
              )
            );
          }

          // Get peer's audio ref
          const { ref: peerRef } = peerAudioRefs.current[peerSocketId];
          if (!peerRef.current) {
            return reject(
              new Error(
                `Reference to audio element has not been assigned yet for socketId  ${peerSocketId}`
              )
            );
          }
          peerRef.current.srcObject = new MediaStream([track]);
          console.log('Attached consumer to peer successfully ✅');
          resolve();
        }
      );
    });
  };
  return { localAudioRef, peerAudioRefs };
};

export default useSpaceSpeaker;
