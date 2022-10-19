import { Router } from 'express';

import {
  acceptFriendRequest,
  addFriend,
  getAllFriendRequests,
} from '@/controllers/friendRequestController';

const router = Router();

router.get('/', getAllFriendRequests);
router.post('/', addFriend);
router.put('/:id/accept', acceptFriendRequest);

export { router as friendRequestRouter };
