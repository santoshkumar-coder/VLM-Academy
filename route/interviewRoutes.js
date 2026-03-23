import express from 'express';
import { scheduleInterview } from '../controller/interviewController.js';

const router = express.Router();

router.post("/create/:teacherId", scheduleInterview);

export default router;