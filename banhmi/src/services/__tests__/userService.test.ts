import { User } from '@prisma/client';

import { prisma } from '@/db';
import { getSocketId, updateSocketId } from '@/services/userService';

describe('test user service', () => {
  it('should return socket id', async () => {
    const expected = { socketId: 'somesocket' };
    jest
      .spyOn(prisma.user, 'findFirstOrThrow')
      .mockResolvedValue(expected as User);
    const value = await getSocketId(1);
    expect(value).toBe(expected);
  });

  it('should throw error on fail socket id query', () => {
    jest.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue(new Error());
    expect(getSocketId).rejects.toThrow();
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
