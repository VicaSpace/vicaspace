import { Router } from 'express';
import requireAuth from '@/middlewares/authenticate';
import {
  getSaltHandler,
  getUserInfoHandler,
  getUserSaltHandler,
  loginHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from '@/controllers/auth';

const router = Router();

router.get('/get_salt', getSaltHandler);
router.post('/register', registerHandler);
router.get('/:username/get_salt', getUserSaltHandler);
router.post('/login', loginHandler);
router.post('/refresh', refreshAccessTokenHandler);
router.get('/info', requireAuth, getUserInfoHandler);

export { router as authRouter };