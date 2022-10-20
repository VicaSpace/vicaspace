import getAllFriendsOfUser from '@/services/friendshipDb';

const getAllFriendsHandler = async (_req, res) => {
  const userId = 1; // TODO: get id of user in session
  const friends = await getAllFriendsOfUser(userId);
  res.status(200).json(friends);
};

export default getAllFriendsHandler;
