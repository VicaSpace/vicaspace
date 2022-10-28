import { prisma } from "@/db";
import { login, register } from "../auth";

describe('test auth service', () => {
  it('should login successfully', async () => {
    //TODO: setup and tear down using platter and afterAll() and beforeAll()

    // seeding
    const registeredUser = await register('test_username', 'saltedPassword', 'salt');
    expect(registeredUser).not.toBeNull();
    expect(registeredUser.username).toBe('test_username');

    const accessToken = await login('test_username', 'saltedPassword');
    expect(accessToken).not.toBeNull();

    // tear down
    prisma.user.delete({ where: { id: registeredUser.id } });
  });

  it('should login failed', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockRejectedValue(new Error('not found'));
    expect(login('username', 'saltedPassword')).rejects.toThrow();
  });
});