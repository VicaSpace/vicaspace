import { getSocketId } from '@/services/userService';

export const getSocketIdHandler = async (req, res) => {
  const socketId = await getSocketId(req.user.id);
  res.status(200).json(socketId);
};
