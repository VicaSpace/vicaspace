/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserFromSocketId, updateSocketId, updateSpaceId } from '@/services/userService';

export const getUserFromSocketIdHandler = async (req, res) => {
  const users = await getUserFromSocketId(req.query.socketId);
  res.status(200).json(users);
};

export const updateSocketIdHandler = async (req, res) => {
  const { socketId } = req.body;
  await updateSocketId(req.user.id, socketId);
  res.status(204).json();
};

export const updateSpaceIdHandler = async (req, res) => {
  const { spaceId } = req.body;
  await updateSpaceId(req.user.id, spaceId);
  res.status(204).json();
}
