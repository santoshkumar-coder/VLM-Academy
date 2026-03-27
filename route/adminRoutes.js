import express from 'express';
import { loginAdmin, registerAdmin,updateTeacherProfileStatue } from '../controller/adminController.js';
import roleAuthorization from '../middleware/roleAuthorization.js';
import verifyToken from '../auth/auth.js'
const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.patch('/profile-status-update', roleAuthorization("admin"),verifyToken, updateTeacherProfileStatue)

export default router;