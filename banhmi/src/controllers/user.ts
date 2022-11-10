/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserFromSocketId, partialUpdateUser, updateSpaceBySocketId } from '@/services/userService';

export const getUserFromSocketIdHandler = async (req, res) => {
  const users = await getUserFromSocketId(req.query.socketId);
  res.status(200).json(users);
};

export const partialUpdateUserHandler = async (req, res) => {
  await partialUpdateUser(req);
  return res.status(204).json();
};

export const updateSpaceBySocketIdHandler = async (req, res) => {
  const { socketId, spaceId } = req.body;
  await updateSpaceBySocketId(socketId, spaceId);
  return res.status(204).json();
};
