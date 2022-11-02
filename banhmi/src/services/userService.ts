import createHttpError from 'http-errors';

import { prisma } from '@/db';
import { logger } from '@/utils/logger';

export const getUserFromSocketId = async (socketId) => {
  if (typeof socketId === 'undefined') {
    createHttpError(400, 'no socket id found');
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        socketId,
      },
      select: {
        id: true,
        username: true,
        spaceId: true,
        socketId: true,
        updatedAt: true,
      },
    });
    return users;
  } catch (error) {
    throw new Error('error querying users');
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
