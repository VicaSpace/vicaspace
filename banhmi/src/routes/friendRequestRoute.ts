import { Router } from 'express';

import {
  acceptFriendRequest,
  addFriend,
} from '@/controllers/friendRequestController';

const router = Router();

router.post('/', addFriend);
router.put('/:id/accept', acceptFriendRequest);

export { router as friendRequestRouter };
