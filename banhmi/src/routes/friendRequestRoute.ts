import { Router } from 'express';

import {
  acceptFriendRequestHandler,
  addFriendHandler,
  getAllFriendRequestsHandler,
} from '@/controllers/friendRequestController';

const router = Router();

router.get('/', getAllFriendRequestsHandler);
router.post('/', addFriendHandler);
router.put('/:id/accept', acceptFriendRequestHandler);

export { router as friendRequestRouter };
