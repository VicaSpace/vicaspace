import { Router } from 'express';

import {
  acceptFriendRequestHandler,
  addFriendHandler,
  getAllFriendRequestsHandler,
  rejectFriendRequestHandler,
} from '@/controllers/friendRequestController';
import checkFriendRequest from '@/middlewares/friendRequestSchema';

const router = Router();

router.get('/', getAllFriendRequestsHandler);
router.post('/', checkFriendRequest, addFriendHandler);
router.put('/:id/accept', acceptFriendRequestHandler);
router.put('/:id/reject', rejectFriendRequestHandler);

export { router as friendRequestRouter };
