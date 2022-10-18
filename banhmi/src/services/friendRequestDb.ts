import { prisma } from '@/db';
import { FriendRequestStatus } from '@prisma/client';

const createFriendRequest = async (senderId, receiverId) => {
  try {
    const frRequest = await prisma.friendRequest.create({
        data: {
            sender: {
                connect: { id: senderId }
            },
            receiver: {
                connect: { id: receiverId }
            },
            status: FriendRequestStatus.PENDING,
        }
    });

    return frRequest;
  } catch (err) {
    return err;
  }
};

export default createFriendRequest;
