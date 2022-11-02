import { User } from '@prisma/client';

import { prisma } from '@/db';
import { getUserFromSocketId, updateSocketId } from '@/services/userService';

describe('test user service', () => {
  it('should return socket id', async () => {
    const expected = [
      {
        id: 1,
        username: 'richard',
        spaceId: 1,
        socketId: 'somesocketid',
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'minh',
        spaceId: 1,
        socketId: 'somesocketid',
        updatedAt: new Date(),
      }
    ];
    jest
      .spyOn(prisma.user, 'findMany')
      .mockResolvedValue(expected as User[]);
    const value = await getUserFromSocketId('somesocketid');
    expect(value).toBe(expected);
  });

  it('should throw error on fail socket id query', () => {
    jest.spyOn(prisma.user, 'findMany').mockRejectedValue(new Error());
    expect(getUserFromSocketId).rejects.toThrow();
  });

  it('should sucessfully update socket id', async () => {
    const mockResponse = {
      id: 1,
      username: 'richard',
      socketId: 'newsocketid',
    };
    jest.spyOn(prisma.user, 'update').mockResolvedValue(mockResponse as User);
    expect(updateSocketId(1, 'newsocketid')).resolves.not.toThrow();
  });

  it('should throw error on fail socket id update', () => {
    jest.spyOn(prisma.user, 'update').mockRejectedValue(new Error());
    expect(updateSocketId).rejects.toThrow();
  });
});
