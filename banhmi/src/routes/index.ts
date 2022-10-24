import { Router } from 'express';

import { authRouter } from '@/routes/authRoutes';
import { friendRequestRouter } from '@/routes/friendRequestRoute';
import { friendshipRouter } from '@/routes/friendshipRoute';
import { spaceRouter } from '@/routes/spaceRoutes';

const router = Router();

router.use('/spaces', spaceRouter);
router.use('/auth', authRouter);
router.use('/friends', friendshipRouter);
router.use('/friends/requests', friendRequestRouter);

export default router;
