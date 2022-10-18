import { updateFriendRequest, addFriend } from '@/controllers/friendRequestController';
import { Router } from 'express';

const router = Router()

router.post('/', addFriend);
router.put('/:id', updateFriendRequest);

export { router as friendRequestRouter }