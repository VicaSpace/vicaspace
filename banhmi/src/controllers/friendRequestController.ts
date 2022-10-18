import createFriendRequest from '@/services/friendRequestDb';

const addFriend = async (req, res) => {
  const { sender_id: senderId, receiver_id: receiverId } = req.body;
  const request = await createFriendRequest(senderId, receiverId);
  res.json(request);
};

const updateFriendRequest = async (req, res) => {
  res.json(`friend request update ${req.params.id}`);
};

export { addFriend, updateFriendRequest };
