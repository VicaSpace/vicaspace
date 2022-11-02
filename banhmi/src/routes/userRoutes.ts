import { getSocketIdHandler, updateSocketIdHandler } from '@/controllers/user';
import authenticate from '@/middlewares/auth';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get('/socketId', authenticate, asyncHandler(getSocketIdHandler));
router.patch('/socketId', authenticate, asyncHandler(updateSocketIdHandler));

export { router as userRouter };
