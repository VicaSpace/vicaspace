import { prisma } from '@/db';
import { logger } from '@/utils/logger';

async function getSpaceTime(spaceId: number) {
  try {
    const spaceDetails = await prisma.space.findFirstOrThrow({
      where: {
        id: spaceId,
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
      },
    });
    return spaceDetails;
  } catch (error) {
    logger.error(error);
    throw new Error('error querying the space');
  }
}

export { getSpaceTime };
