import { getSocketIdHandler } from '@/controllers/users';
import authenticate from '@/middlewares/auth';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get('/socketId', authenticate, asyncHandler(getSocketIdHandler));

export { router as userRouter };
