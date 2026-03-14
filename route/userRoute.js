import express from 'express'
const router = express.Router();
import verifyToken from '../auth/auth.js';
import userController from '../controller/userController.js';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile);

export default router;