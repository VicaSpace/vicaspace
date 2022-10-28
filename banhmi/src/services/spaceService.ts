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
      },
    });
    return spacesInfo;
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
        serverTime: true,
        members: {
          select: {
            id: true,
            username: true,
          },
        },
        urlVideo: true,
        urlSpotify: true,
        timezone: true,
      },
    });
    return spaceDetails;
  } catch (error) {
    logger.error(error);
    throw new Error('error querying the space');
  }
};
