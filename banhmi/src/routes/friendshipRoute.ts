import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import getAllFriendsHandler from '@/controllers/friendshipController';

const router = Router();

router.get('/', asyncHandler(getAllFriendsHandler));

export { router as friendshipRouter };
