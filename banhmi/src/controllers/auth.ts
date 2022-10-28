import { prisma } from '@/db';
import {
  login,
  refreshAccessToken,
  register,
} from '@/services/auth';
import { getRandomString } from '@/utils/utilities';

const SALT_LENGTH = 50;

const registerHandler = async (req, res) => {
  const user = await register(req.body.username, req.body.hashedPassword, req.body.salt);
  res.status(201).json({
    id: user.id,
    username: user.username,
  });
}

// Get random salt for register
const getSaltHandler = async (_req, res) => {
  const salt = getRandomString(SALT_LENGTH);
  res.status(200).json({ salt: salt });
}

const getUserSaltHandler = async (req, res) => {
  const username = req.params.username;
  const user = await prisma.user.findUnique({
    select: { salt: true },
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

const loginHandler = async (req, res) => {
  const accessToken = await login(req.body.username, req.body.hashedPassword);
  res.status(201).json(accessToken);
}

async function refreshAccessTokenHandler(req, res) {
  const username = req.body.username;
  const refreshToken = req.body.refreshToken;

  const newToken = await refreshAccessToken(username, refreshToken);

  if (newToken === null)
    return res.status(400).json({ error: 'Invalid refreshToken' });
  return res.status(200).json(newToken);
}

const getUserInfoHandler = async (req, res) => {
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
