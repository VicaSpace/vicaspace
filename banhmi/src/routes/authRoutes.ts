import {getSaltHandler, registerHandler} from '@/controllers/auth';
import { Router } from 'express';

const router = Router();

router.get('/get_salt', getSaltHandler);
router.post('/register', registerHandler);

export { router as authRouter };