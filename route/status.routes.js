import express from 'express';
import { adminForceUpdate, toggleStatus } from '../controller/status.Controller.js';

const router = express.Router();

router.patch("/toggle/:teacherId", toggleStatus);

router.patch("/status-updateby-admin", adminForceUpdate);


export default router;