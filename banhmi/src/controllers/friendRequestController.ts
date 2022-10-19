import {
  createFriendRequest,
  getAllFriendRequestsOfUser,
  processAcceptedFriendRequest,
} from '@/services/friendRequestDb';
import {
  validateAcceptedFriendRequest,
  validateFriendRequestInput,
} from '@/validators/friendRequestValidator';

const addFriendHandler = async (req, res, next) => {
  try {
    const { sender_id: senderId, receiver_id: receiverId } = req.body;

    await validateFriendRequestInput(senderId, receiverId);

    const request = await createFriendRequest(senderId, receiverId);
    res.status(201).json(request);
  } catch (err: unknown) {
    next(err);
  }
};

const acceptFriendRequestHandler = async (req, res, next) => {
  try {
    const requestId = Number(req.params.id);

    await validateAcceptedFriendRequest(requestId);

    const friendship = await processAcceptedFriendRequest(requestId);
    res.status(200).json(friendship);
  } catch (err: unknown) {
    next(err);
  }
};

const getAllFriendRequestsHandler = async (_req, res, next) => {
  try {
    const userId = 1; // TODO: get id of user in session
    const friendRequests = await getAllFriendRequestsOfUser(userId);
    res.status(200).json(friendRequests);
  } catch (err: unknown) {
    next(err);
  }
};

export { addFriendHandler, acceptFriendRequestHandler, getAllFriendRequestsHandler };
