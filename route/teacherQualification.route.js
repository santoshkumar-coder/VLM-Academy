import express from 'express';
import { createQualification, getAllQualifications, updateTeacherQualification } from '../controller/teacherQualification.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

const uploadFields = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'teachingCertification', maxCount: 1 },
    { name: 'aadharCard', maxCount: 1 },
    { name: 'experienceDocument', maxCount: 1 },
    { name: 'qualificationCertificate', maxCount: 1 },
    { name: 'additionalCertificates', maxCount: 5 },
     { name: 'introVideo', maxCount: 1 } // Allow multiple
]);


router.post("/create/:teacherId", uploadFields, createQualification);

router.put("/edit/:id", updateTeacherQualification)

router.get("/get", getAllQualifications);


export default router;
