import { Router } from 'express';

import {
  acceptFriendRequestHandler,
  addFriendHandler,
  getAllFriendRequestsHandler,
} from '@/controllers/friendRequestController';
import checkFriendRequest from '@/middlewares/friendRequestSchema';

const router = Router();

router.get('/', getAllFriendRequestsHandler);
router.post('/', checkFriendRequest, addFriendHandler);
router.put('/:id/accept', acceptFriendRequestHandler);

export { router as friendRequestRouter };
