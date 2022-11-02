import { getSocketId, updateSocketId } from '@/services/userService';

export const getSocketIdHandler = async (req, res) => {
  const socketId = await getSocketId(req.user.id);
  res.status(200).json(socketId);
};

export const updateSocketIdHandler = async (req, res) => {
  const {socketId}= req.body;
  updateSocketId(req.user.id, socketId)
  res.status(204).json()
}
