import { prisma } from "@/db"
import { logger } from "@/utils/logger";

export const getSocketId = async (id) => {
  try {
    const socketId = await prisma.user.findFirstOrThrow({
      where: {
        active: true,
        id
      },
      select: {
        socketId: true
      },
    });
    return socketId;
  } catch (error) {
    logger.error(error);
    throw new Error('error querying user');
  }
}
