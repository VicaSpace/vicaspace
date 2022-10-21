import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  acceptFriendRequestHandler,
  addFriendHandler,
  getAllFriendRequestsHandler,
  rejectFriendRequestHandler,
} from '@/controllers/friendRequestController';
import checkFriendRequest from '@/middlewares/friendRequestSchema';

const router = Router();

router.get('/', asyncHandler(getAllFriendRequestsHandler));
router.post('/', checkFriendRequest, asyncHandler(addFriendHandler));
router.put('/:id/accept', asyncHandler(acceptFriendRequestHandler));
router.put('/:id/reject', asyncHandler(rejectFriendRequestHandler));

export { router as friendRequestRouter };
