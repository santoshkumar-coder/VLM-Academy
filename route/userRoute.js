import express from 'express'
const router = express.Router();
import verifyToken from '../auth/auth.js';
import userController from '../controller/userController.js';
import upload from '../middleware/imageUplaod.js'
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile);
router.put("/edit-student/:userId", userController.updateStudentProfile);
router.delete("/delete-student/:id", userController.deleteStudentProfile);



router.post('/ask-doubt',verifyToken,upload.array("images", 6), userController.askDoubt )


// router.post('/doubt', verifyToken, userController.postDoubt);

export default router;