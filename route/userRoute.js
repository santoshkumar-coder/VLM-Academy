import express from 'express'
const router = express.Router();
import verifyToken from '../auth/auth.js';
import userController from '../controller/userController.js';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile);
router.put("/edit-student/:userId", userController.updateStudentProfile);
router.delete("/delete-student/:id", userController.deleteStudentProfile)

export default router;