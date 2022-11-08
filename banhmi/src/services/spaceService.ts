import { prisma } from '@/db';
import { logger } from '@/utils/logger';

export const getAllSpacesInfo = async () => {
  try {
    const spacesInfo = await prisma.space.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        startTime: true,
        members: {
          select: {
            id: true,
            username: true,
          },
        },
        urlVideo: true,
        urlSpotify: true,
        timezone: true,
        pomodoroDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
      },
    });
    return spacesInfo.map((info) => {
      return {
        ...info,
        serverTime: new Date(),
      };
    });
  } catch (error) {
    logger.error(error);
    throw new Error('error querying spaces');
  }
};

export const getSpaceDetails = async (spaceId) => {
  try {
    const spaceDetails = await prisma.space.findFirstOrThrow({
      where: {
        id: parseInt(spaceId),
        active: true,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        startTime: true,
        members: {
          select: {
            id: true,
            username: true,
          },
        },
        urlVideo: true,
        urlSpotify: true,
        timezone: true,
        pomodoroDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
      },
    });
    return {
      ...spaceDetails,
      serverTime: Date.now(),
    };
  } catch (error) {
    logger.error(error);
    throw new Error('error querying the space');
  }
};
