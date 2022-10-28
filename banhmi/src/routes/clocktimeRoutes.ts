import { getServerTime, getSpaceClocktime } from '@/controllers/clocktime';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get('/:spaceId', asyncHandler(getSpaceClocktime));
router.get('/', asyncHandler(getServerTime))

export { router as clocktimeRouter };
