import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import {
  getAllSpacesInfoHandler,
  getSpaceDetailsHandler,
} from '@/controllers/space';

const router = Router();

router.get('/', asyncHandler(getAllSpacesInfoHandler));

router.get('/:spaceId', asyncHandler(getSpaceDetailsHandler));

export { router as spaceRouter };
