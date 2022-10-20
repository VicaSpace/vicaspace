import {getSaltHandler, getUserSaltHandler, registerHandler} from '@/controllers/auth';
import { Router } from 'express';

const router = Router();

router.get('/get_salt', getSaltHandler);
router.post('/register', registerHandler);
router.get('/:username/get_salt', getUserSaltHandler);

export { router as authRouter };