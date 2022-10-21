import {getSaltHandler, getUserSaltHandler, loginHandler, registerHandler} from '@/controllers/auth';
import { Router } from 'express';

const router = Router();

router.get('/get_salt', getSaltHandler);
router.post('/register', registerHandler);
router.get('/:username/get_salt', getUserSaltHandler);
router.post('/login', loginHandler);

export { router as authRouter };