import { Router } from 'express';

import { authRouter } from '@/routes/authRoutes';
import { clocktimeRouter } from '@/routes/clocktimeRoutes';
import { friendRequestRouter } from '@/routes/friendRequestRoute';
import { friendshipRouter } from '@/routes/friendshipRoute';
import { spaceRouter } from '@/routes/spaceRoutes';
import { userRouter } from '@/routes/userRoutes';

const router = Router();

router.use('/spaces', spaceRouter);
router.use('/auth', authRouter);
router.use('/friends', friendshipRouter);
router.use('/friends/requests', friendRequestRouter);
router.use('/timer/', clocktimeRouter);
router.use('/users', userRouter);

export default router;
