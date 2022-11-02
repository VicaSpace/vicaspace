import { prisma } from '@/db';
import { getSocketId } from '@/services/userService';
import { User } from '@prisma/client';

describe('test user service', () => {
  it('should return socket id', async () => {
    const expected = { socketId: 'somesocket' };
    jest
      .spyOn(prisma.user, 'findFirstOrThrow')
      .mockResolvedValue(expected as User);
    const value = await getSocketId(1);
    expect(value).toBe(expected);
  });

  it('should throw error', () => {
    jest.spyOn(prisma.user, 'findFirstOrThrow').mockRejectedValue(new Error());
    expect(getSocketId).rejects.toThrow();
  });
});
