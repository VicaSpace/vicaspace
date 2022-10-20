import getSaltHandler from '@/controllers/auth';
import { Router } from 'express';

const router = Router();

router.get('/get_salt', getSaltHandler);

export { router as authRouter };