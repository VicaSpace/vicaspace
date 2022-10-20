import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { getAllSpacesInfoHandler } from '@/controllers/spaces';

const router = Router();

router.get('/', asyncHandler(getAllSpacesInfoHandler));

export { router as spaceRouter };
