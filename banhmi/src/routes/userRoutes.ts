import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  getUserFromSocketIdHandler,
  updateSocketIdHandler,
  updateSpaceIdHandler,
} from '@/controllers/user';
import authenticate from '@/middlewares/auth';

const router = Router();

router.get('/', authenticate, asyncHandler(getUserFromSocketIdHandler));
router.patch('/socketId', authenticate, asyncHandler(updateSocketIdHandler));
router.patch('/spaceId', authenticate, asyncHandler(updateSpaceIdHandler));

export { router as userRouter };
