import { FriendRequestStatus } from '@prisma/client';
import createError from 'http-errors';

import { prisma } from '@/db';

const validateFriendRequestInput = async (
  sender_id: number,
  receiver_id: number
) => {
  if (sender_id === receiver_id) {
    const err = createError(
      400,
      'sender_id and receiver_id should not be the same'
    );
    throw err;
  }

  const sender = await prisma.user.findUnique({
    where: { id: sender_id },
  });

  const receiver = await prisma.user.findUnique({
    where: { id: receiver_id },
  });

  if (!sender) {
    const error = createError(404, `User with id ${sender_id} not found`);
    throw error;
  }

  if (!receiver) {
    const error = createError(404, `User with id ${receiver_id} not found`);
    throw error;
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          user1: sender,
          user2: receiver,
        },
        {
          user2: sender,
          user1: receiver,
        },
      ],
    },
  });

  if (friendship) {
    const error = createError(
      400,
      `Friendship between id ${receiver_id} and id ${sender_id} already exists`
    );
    throw error;
  }

  const friendRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        {
          sender,
          receiver,
        },
        {
          receiver: sender,
          sender: receiver,
        },
      ],
      NOT: [
        {
          status: FriendRequestStatus.REJECTED,
        },
      ],
    },
  });

  if (friendRequest) {
    const error = createError(
      400,
      `Request between id ${receiver_id} and id ${sender_id} already exists`
    );
    throw error;
  }
};

const validateAcceptedFriendRequest = async (request_id: number) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: request_id },
  });

  if (!request) {
    const error = createError(
      404,
      `Friend request with id ${request_id} not found`
    );
    throw error;
  }

  if (request.status !== FriendRequestStatus.PENDING) {
    const error = createError(
      400,
      `The status of friend request must be PENDING`
    );
    throw error;
  }
};

export { validateAcceptedFriendRequest, validateFriendRequestInput };
