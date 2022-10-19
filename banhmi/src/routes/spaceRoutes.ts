import { Router } from 'express';

import { getAllSpacesInfoHandler } from '../controllers/spaces';

const router = Router();

router.get('/', getAllSpacesInfoHandler);

export { router as spaceRouter };
