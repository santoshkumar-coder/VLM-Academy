import express from 'express';
import { register, login, updateProfile } from '../controller/teacherProfileController.js';


const router = express.Router();

router.post('/register/:id', register, );
router.post('/login', login);
router.put("/edit/:id", updateProfile);

export default router;