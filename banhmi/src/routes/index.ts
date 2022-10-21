import { Router } from 'express';

import { spaceRouter } from '@/routes/spaceRoutes';
import { friendRequestRouter } from '@/routes/friendRequestRoute';
import { friendshipRouter } from '@/routes/friendshipRoute';

const router = Router();

router.use('/spaces', spaceRouter);
router.use('/friends', friendshipRouter);
router.use('/friends/requests', friendRequestRouter);

export default router;
