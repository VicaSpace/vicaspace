import createHttpError from 'http-errors';

import { prisma } from '@/db';
import { logger } from '@/utils/logger';

export const getUserFromSocketId = async (socketId) => {
  if (typeof socketId === 'undefined') {
    throw createHttpError(400, 'no socket id found');
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

export const partialUpdateUser = async (req) => {
  const { socketId, spaceId } = req.body;
  const userId = req.user.id;
  if (typeof socketId !== 'undefined') {
    await updateSocketId(userId, socketId);
    return;
  }
  if (typeof spaceId !== 'undefined') {
    await updateSpaceId(userId, spaceId);
    return;
  }
  throw createHttpError(
    400,
    'the updated field should either be socketid or spaceid'
  );
}

export const updateSocketId = async (userId: number, socketId: string) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        socketId,
      },
    });
  } catch (error) {
    logger.error(error);
    throw new Error('error updating socket id');
  }
};

export const updateSpaceId = async (userId: number, spaceId: number) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        spaceId,
      },
    });
  } catch (error) {
    logger.error(error);
    throw new Error('error updating socket id');
  }
};
