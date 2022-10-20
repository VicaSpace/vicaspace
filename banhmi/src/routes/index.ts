import { Router } from 'express';

import { spaceRouter } from '@/routes/spaceRoutes';

const router = Router();

router.use('/spaces', spaceRouter);

export default router;
