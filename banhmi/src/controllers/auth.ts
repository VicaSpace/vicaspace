import { Request, Response } from 'express';

import { prisma } from '@/db';
import {
  createAccessToken,
  getHashedPasswordWithPepper,
  getRandomString,
  refreshAccessToken,
  validatePassword,
} from '@/services/auth';

const SALT_LENGTH = 50;

async function registerHandler(req: Request, res: Response) {
  // TODO: middleware to check required fields and its type
  const username = req.body.username;
  // TODO: utils to return error codes
  if (username === null)
    return res.status(400).json({
      error: 'username is required',
    });

  let user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user != null)
    return res.status(400).json({
      error: 'username already taken',
    });

  const salt = req.body.salt;
  const hashedPassword = req.body.hashedPassword;
  if (salt === null || hashedPassword === null)
    return res.status(400).json({
      error: 'salt and hashedPassword is required',
    });

  const hashedPasswordWithPepper = getHashedPasswordWithPepper(hashedPassword);
  user = await prisma.user.create({
    data: {
      username: username,
      salt: salt,
      hashedPassword: hashedPasswordWithPepper,
    },
  });
  res.status(201).json({
    id: user.id,
    username: username,
  });
}

// Get random salt for register
async function getSaltHandler(req: Request, res: Response) {
  const salt = getRandomString(SALT_LENGTH);
  res.status(200).json({ salt: salt });
}

async function getUserSaltHandler(req: Request, res: Response) {
  const username = req.params.username;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user === null)
    return res.status(404).json({
      error: 'username is not exists',
    });

  res.status(200).json({
    username: username,
    salt: user.salt,
  });
}

async function loginHandler(req: Request, res: Response) {
  const username = req.body.username;
  const hashedPassword = req.body.hashedPassword;
  const isPasswordValid = await validatePassword(hashedPassword, username);

  if (isPasswordValid) {
    const token = await createAccessToken(username);
    if (token === null)
      return res.status(400).json({ error: 'Invalid username or password' });
    res.status(200).json(token);
  } else {
    res.status(403).json({ error: 'Invalid username or password' });
  }
}

async function refreshAccessTokenHandler(req: Request, res: Response) {
  const username = req.body.username;
  const refreshToken = req.body.refreshToken;

  const newToken = await refreshAccessToken(username, refreshToken);

  if (newToken === null)
    return res.status(400).json({ error: 'Invalid refreshToken' });
  return res.status(200).json(newToken);
}

async function getUserInfoHandler(req: Request, res: Response) {
  return res.status(200).json(req.user);
}

export {
  getSaltHandler,
  registerHandler,
  getUserSaltHandler,
  loginHandler,
  refreshAccessTokenHandler,
  getUserInfoHandler,
};
