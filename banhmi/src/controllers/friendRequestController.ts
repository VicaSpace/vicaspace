import {
  createFriendRequest,
  processAcceptedFriendRequest,
} from '@/services/friendRequestDb';

const addFriend = async (req, res) => {
  const { sender_id: senderId, receiver_id: receiverId } = req.body;
  const request = await createFriendRequest(senderId, receiverId);
  res.status(201).json(request);
};

const acceptFriendRequest = async (req, res) => {
  const friendship = await processAcceptedFriendRequest(Number(req.params.id));
  res.status(201).json(friendship);
};

export { addFriend, acceptFriendRequest };
