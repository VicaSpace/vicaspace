import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  getUserFromSocketIdHandler,
  partialUpdateUserHandler,
} from '@/controllers/user';
import authenticate from '@/middlewares/auth';
import checkUpdateUserRequest from '@/middlewares/schemas/updateUserSchema';

const router = Router();

router.get('/', authenticate, asyncHandler(getUserFromSocketIdHandler));
router.patch(
  '/',
  [authenticate, checkUpdateUserRequest],
  asyncHandler(partialUpdateUserHandler)
);

export { router as userRouter };
