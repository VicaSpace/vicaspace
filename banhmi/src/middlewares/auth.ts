import { Request } from 'express';

import { prisma } from '@/db';

const authenticate = async function (req: Request, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (typeof accessToken === 'undefined') {
    return res.status(403).json({
      error: 'Unauthorized',
    });
  }

  const token = await prisma.authToken.findFirst({
    where: {
      accessToken: accessToken,
    },
  });

  // check if token is not null
  if (token === null)
    return res.status(403).json({
      error: 'Unauthorized',
    });

  // check if accessToken expired
  if (token.expiredTime < new Date())
    return res.status(403).json({
      error: 'Unauthorized',
    });

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
