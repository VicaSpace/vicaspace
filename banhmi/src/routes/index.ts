import { Router } from 'express';

import { spaceRouter } from '@/routes/spaceRoutes';
import { authRouter } from '@/routes/authRoutes';

const router = Router();

router.use('/spaces', spaceRouter);
router.use('/auth', authRouter);

export default router;