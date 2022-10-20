import { Router } from 'express';

import getAllFriendsHandler from '@/controllers/friendshipController';

const router = Router();

router.get('/', getAllFriendsHandler);

export { router as friendshipRouter };
