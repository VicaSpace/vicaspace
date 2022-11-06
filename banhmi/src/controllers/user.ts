/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserFromSocketId, partialUpdateUser } from '@/services/userService';

export const getUserFromSocketIdHandler = async (req, res) => {
  const users = await getUserFromSocketId(req.query.socketId);
  res.status(200).json(users);
};

export const partialUpdateUserHandler = async (req, res) => {
  await partialUpdateUser(req);
  return res.status(204).json();
};
