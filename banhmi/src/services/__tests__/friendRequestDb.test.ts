import { FriendRequest, FriendRequestStatus, Friendship } from '@prisma/client';

import { prisma } from '@/db';
import {
  createFriendRequest,
  processAcceptedFriendRequest,
  processRejectedFriendRequest,
} from '@/services/friendRequestDb';

describe('create a friend request', () => {
  it('should create friend request record in DB', async () => {
    const expected = {
      senderId: 1,
      receiverId: 2,
      status: FriendRequestStatus.PENDING,
    };

    jest.spyOn(prisma.friendRequest, 'findFirst').mockResolvedValue(null);
    jest
      .spyOn(prisma.friendRequest, 'create')
      .mockResolvedValue(expected as FriendRequest);

    const output = await createFriendRequest(
      expected.senderId,
      expected.receiverId
    );

    expect(output).toBe(expected);
  });

  it('should throw error if friend request exists', async () => {
    const mockData = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      status: FriendRequestStatus.PENDING,
    };
    jest
      .spyOn(prisma.friendRequest, 'findFirst')
      .mockResolvedValue(mockData as FriendRequest);
    expect(createFriendRequest).rejects.toThrow();
  });
});

describe('accept a friend request', () => {
  it('should create a new friendship', async () => {
    const expectedRequestBeforeUpdate = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      status: FriendRequestStatus.PENDING,
    };

    const expectedRequestAfterUpdate = {
      ...expectedRequestBeforeUpdate,
      status: FriendRequestStatus.ACCEPTED,
    };

    const expectedOutput = {
      user1Id: expectedRequestBeforeUpdate.senderId,
      user2Id: expectedRequestBeforeUpdate.receiverId,
    };

    // mock output for friend-related queries
    jest.spyOn(prisma.friendship, 'findFirst').mockResolvedValue(null);
    jest
      .spyOn(prisma.friendRequest, 'findUnique')
      .mockResolvedValue(expectedRequestBeforeUpdate as FriendRequest);

    // mock output for the update
    jest
      .spyOn(prisma.friendRequest, 'update')
      .mockResolvedValue(expectedRequestAfterUpdate as FriendRequest);

    // mock output data for friendship
    jest
      .spyOn(prisma.friendship, 'create')
      .mockResolvedValue(expectedOutput as Friendship);

    const output = await processAcceptedFriendRequest(1);
    expect(output).toBe(expectedOutput);
  });
});

describe('rejects a friend request', () => {
  it('should change the status of friend request to rejected', async () => {
    const expectedRequestBeforeUpdate = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      status: FriendRequestStatus.PENDING,
    };

    const expectedRequestAfterUpdate = {
      ...expectedRequestBeforeUpdate,
      status: FriendRequestStatus.REJECTED,
    };

    // mock output for friend-related queries
    jest.spyOn(prisma.friendship, 'findFirst').mockResolvedValue(null);
    jest
      .spyOn(prisma.friendRequest, 'findUnique')
      .mockResolvedValue(expectedRequestBeforeUpdate as FriendRequest);

    // mock output for the update
    jest
      .spyOn(prisma.friendRequest, 'update')
      .mockResolvedValue(expectedRequestAfterUpdate as FriendRequest);

    const output = await processRejectedFriendRequest(1);
    expect(output).toBe(expectedRequestAfterUpdate);
  });
});
