import { Router } from 'express';
import authenticate from '@/middlewares/auth';
import {
  getSaltHandler,
  getUserInfoHandler,
  getUserSaltHandler,
  loginHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from '@/controllers/auth';
import validateRegisterRequest from '@/middlewares/schemas/registrationSchema';
import validateLoginFormRequest from '@/middlewares/schemas/loginFormSchema';
import asyncHandler from 'express-async-handler';

const router = Router();

router.get('/salt', asyncHandler(getSaltHandler));
router.post('/register', validateRegisterRequest, asyncHandler(registerHandler));
router.get('/users/:username/salt', asyncHandler(getUserSaltHandler));
router.post('/login', validateLoginFormRequest, asyncHandler(loginHandler));
router.post('/refresh', asyncHandler(refreshAccessTokenHandler));
router.get('/info', authenticate, asyncHandler(getUserInfoHandler));

export { router as authRouter };
