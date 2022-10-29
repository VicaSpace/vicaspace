import createError from 'http-errors';
import { sha256 } from 'js-sha256';
import jwt from 'jsonwebtoken';

import { prisma } from '@/db';
import { validateRegistrationRequest } from '@/validators/authValidator';

const ACCESS_TOKEN_EXPIRES_TIME = '3d';
const REFRESH_TOKEN_EXPIRES_TIME = '30d';

const getHashedPasswordWithPepper = (saltedPassword: string) => {
  return sha256(saltedPassword + process.env.PEPPER);
}

const checkPassword = async (saltedPassword: string, username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) return false;
  const hashedPasswordWithPepper = getHashedPasswordWithPepper(saltedPassword);
  if (user.hashedPassword !== hashedPasswordWithPepper) return false;
  else return true;
}

const createAccessToken = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) return null;

  let token = await prisma.authToken.findFirst({
    where: {
      user: user,
    },
    select: {
      id: true,
      userId: true,
      accessToken: true,
      refreshToken: true,
      expiredTime: true,
    },
  });

  const accessToken = jwt.sign(
    { user: user.username },
    process.env.JWT_PRIVATEKEY,
    { expiresIn: ACCESS_TOKEN_EXPIRES_TIME }
  );
  const refreshToken = jwt.sign(
    { user: user.username, accessToken: accessToken },
    process.env.JWT_PRIVATEKEY,
    { expiresIn: REFRESH_TOKEN_EXPIRES_TIME }
  );
  const expiredTime = Date.now() + 3 * 24 * 60 * 60 * 1000;

  if (token) {
    token = await updateAuthToken(user, accessToken, refreshToken, expiredTime);
  } else {
    // create new token
    token = await createAuthTokenObject(
      user,
      accessToken,
      refreshToken,
      expiredTime
    );
  }

  return token;
}

async function updateAuthToken(user, accessToken, refreshToken, expiredTime) {
  return await prisma.authToken.update({
    where: {
      userId: user.id,
    },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiredTime: new Date(expiredTime),
    },
  });
}

const createAuthTokenObject = async (
  user,
  accessToken,
  refreshToken,
  expiredTime
) => {
  return await prisma.authToken.create({
    data: {
      expiredTime: new Date(expiredTime),
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { connect: { id: user.id } },
    },
  });
}

const refreshAccessToken = async (username, refreshToken) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) return null;

  let token = await prisma.authToken.findFirst({
    where: {
      user: user,
      refreshToken: refreshToken,
    },
    select: {
      id: true,
      userId: true,
      accessToken: true,
      refreshToken: true,
      expiredTime: true,
    },
  });
  if (token) {
    const accessToken = jwt.sign(
      { user: user.username },
      process.env.JWT_PRIVATEKEY,
      { expiresIn: ACCESS_TOKEN_EXPIRES_TIME }
    );
    const refreshToken = jwt.sign(
      { user: user.username, accessToken: accessToken },
      process.env.JWT_PRIVATEKEY,
      { expiresIn: REFRESH_TOKEN_EXPIRES_TIME }
    );
    const expiredTime = Date.now() + 3 * 24 * 60 * 60 * 1000;

    token = await updateAuthToken(user, accessToken, refreshToken, expiredTime);
  }
  return token;
}

const register = async (username, saltedPassword, salt) => {
  await validateRegistrationRequest(username);
  const hashedPasswordWithPepper = getHashedPasswordWithPepper(saltedPassword);
  return await prisma.user.create({
    data: {
      username: username,
      salt: salt,
      hashedPassword: hashedPasswordWithPepper,
    },
  });
}

const login = async (username, saltedPassword) => {
  const passwordIsMatched = await checkPassword(saltedPassword, username);

  if (!passwordIsMatched) {
    const error = createError(
      400,
      `invalid username or password`,
    );
    throw error;
  }

  const token = await createAccessToken(username);
  if (token === null) {
    const error = createError(
      403,
      `invalid username or password`,
    );
    throw error;
  }
  return token;
}

export {
  register,
  login,
  refreshAccessToken,
};
