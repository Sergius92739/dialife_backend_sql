import Router from 'express';
import authController from '../controllers/auth.controller.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = new Router();


router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/me', checkAuth, authController.getMe);

router.put('/update', checkAuth, authController.update);

export default router;
