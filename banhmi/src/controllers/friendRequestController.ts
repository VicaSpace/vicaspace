import {
  createFriendRequest,
  getAllFriendRequestsOfUser,
  processAcceptedFriendRequest,
  processRejectedFriendRequest,
} from '@/services/friendRequestDb';

const addFriendHandler = async (req, res) => {
  const { sender_id: senderId, receiver_id: receiverId } = req.body;

  const request = await createFriendRequest(senderId, receiverId);
  res.status(201).json(request);
};

const acceptFriendRequestHandler = async (req, res) => {
  const requestId = Number(req.params.id);

  const friendship = await processAcceptedFriendRequest(requestId);
  res.status(200).json(friendship);
};

const getAllFriendRequestsHandler = async (_req, res) => {
  const userId = 1; // TODO: get id of user in session
  const friendRequests = await getAllFriendRequestsOfUser(userId);
  res.status(200).json(friendRequests);
};

const rejectFriendRequestHandler = async (req, res) => {
  const requestId = Number(req.params.id);

  const friendship = await processRejectedFriendRequest(requestId);
  res.status(200).json(friendship);
};

export {
  addFriendHandler,
  acceptFriendRequestHandler,
  getAllFriendRequestsHandler,
  rejectFriendRequestHandler,
};
