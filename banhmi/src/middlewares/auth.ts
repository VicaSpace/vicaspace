import { Request } from 'express';
import createHttpError from 'http-errors';

import { prisma } from '@/db';

const authenticate = async function (req: Request, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (typeof accessToken === 'undefined') {
    return next(createHttpError(401, 'Unauthorized'));
  }

  const token = await prisma.authToken.findFirst({
    where: {
      accessToken: accessToken,
    },
  });

  // check if token is not null
  if (token === null) {
    return next(createHttpError(401, 'Unauthorized'));
  }

  // check if accessToken expired
  if (token.expiredTime < new Date()) {
    return next(createHttpError(401, 'Unauthorized'));
  }
  // get user profile
  const user = await prisma.user.findFirst({
    where: {
      id: token.userId,
    },
    select: {
      id: true,
      username: true,
      active: true,
    },
  });
  if (user === null)
    return res.status(404).json({
      error: 'User not found',
    });
  req.user = user;
  next();
};

export default authenticate;
