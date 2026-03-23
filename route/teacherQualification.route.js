import express from 'express';
import { createQualification, getAllQualifications } from '../controller/teacherQualification.controller.js';

const router = express.Router();

router.post("/create", createQualification);

router.get("/get", getAllQualifications);


export default router;
