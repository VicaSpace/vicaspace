import { FriendRequestStatus } from '@prisma/client';
import { prisma } from '@/db';

const getAllFriendRequestsOfUser = async (userId: number) => {
  const allRequests = await prisma.friendRequest.findMany({
    where: { receiverId: userId }
  });

  return allRequests;
}

const createFriendRequest = async (senderId, receiverId) => {
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
};

const processAcceptedFriendRequest = async (id) => {
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
};

export {
  createFriendRequest,
  processAcceptedFriendRequest,
  getAllFriendRequestsOfUser };
