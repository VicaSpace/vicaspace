import { prisma } from '@/db';

const getAllFriendsOfUser = async (userId: number) => {
  const allFriendShips = await Promise.all([
    prisma.friendship.findMany({
      where: {
        user2Id: userId,
      },
      include: {
        user1: true,
      },
    }),
    prisma.friendship.findMany({
      where: {
        user1Id: userId,
      },
      include: {
        user2: true,
      },
    }),
  ]);

  const returnFriendShips = allFriendShips
    .flat()
    .map((friendship) => friendship['user1'] ?? friendship['user2']);

  return returnFriendShips;
};

export default getAllFriendsOfUser;
