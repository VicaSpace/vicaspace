import { FriendRequestStatus } from '@prisma/client';

import { prisma } from '@/db';

const createFriendRequest = async (senderId, receiverId) => {
  try {
    const frRequest = await prisma.friendRequest.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        status: FriendRequestStatus.PENDING,
      },
    });

    return frRequest;
  } catch (err) {
    return err;
  }
};

const processAcceptedFriendRequest = async (id) => {
  try {
    const friendShip = await prisma.$transaction(async (prisma: any) => {
      const friendRequest = await prisma.friendRequest.update({
        where: {
          id: id,
        },
        data: {
          status: FriendRequestStatus.ACCEPTED,
        },
      });
      const newFriendShip = await prisma.friendship.create({
        data: {
          user1: {
            connect: { id: friendRequest.senderId },
          },
          user2: {
            connect: { id: friendRequest.receiverId },
          },
        },
      });

      return newFriendShip;
    });

    return friendShip;
  } catch (err) {
    return err;
  }
};

export { createFriendRequest, processAcceptedFriendRequest };
