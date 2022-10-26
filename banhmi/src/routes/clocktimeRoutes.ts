import { getServerTime, getSpaceClocktime } from '@/controllers/clocktime';
import { Router } from 'express';

const router = Router();

router.get('/:spaceId', getSpaceClocktime);
router.get('/', getServerTime)

export { router as clocktimeRouter };
