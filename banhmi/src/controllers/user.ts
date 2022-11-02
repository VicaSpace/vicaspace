/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserFromSocketId, updateSocketId } from '@/services/userService';

export const getUserFromSocketIdHandler = async (req, res) => {
  const users = await getUserFromSocketId(req.query.socketId);
  res.status(200).json(users);
};

export const updateSocketIdHandler = async (req, res) => {
  const { socketId } = req.body;
  updateSocketId(req.user.id, socketId);
  res.status(204).json();
};
