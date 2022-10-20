import { Router } from 'express';

import { friendRequestRouter } from '@/routes/friendRequestRoute';
import { friendshipRouter } from '@/routes/friendshipRoute';

const router = Router();

router.use('/friends', friendshipRouter);
router.use('/friends/requests', friendRequestRouter);

export default router;
