import { Router } from 'express';

import { spaceRouter } from '@/routes/spaceRoutes';
<<<<<<< HEAD
import { authRouter } from '@/routes/authRoutes';
=======
import { friendRequestRouter } from '@/routes/friendRequestRoute';
import { friendshipRouter } from '@/routes/friendshipRoute';
>>>>>>> develop

const router = Router();

router.use('/spaces', spaceRouter);
<<<<<<< HEAD
router.use('/auth', authRouter);
=======
router.use('/friends', friendshipRouter);
router.use('/friends/requests', friendRequestRouter);
>>>>>>> develop

export default router;