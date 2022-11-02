import { prisma } from '@/db';
import { logger } from '@/utils/logger';

export const getSocketId = async (userId) => {
  try {
    const socketId = await prisma.user.findFirstOrThrow({
      where: {
        active: true,
        id: userId,
      },
      select: {
        socketId: true,
      },
    });
    return socketId;
  } catch (error) {
    logger.error(error);
    throw new Error('error querying user');
  }
};

export const updateSocketId = async (userId, socketId) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        socketId: socketId,
      },
    });
  } catch (error) {
    logger.error(error);
    throw new Error('error updating socket id');
  }
};
