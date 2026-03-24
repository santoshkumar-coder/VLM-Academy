import express from 'express';
import { createSlot, deleteSlot, getAllSlots, updateSlot } from '../controller/interviewController.js';
import { deleteModel } from 'mongoose';

const router = express.Router();

router.post("/create", createSlot);

router.get("/getAllSlots", getAllSlots);

router.put("/update-slot", updateSlot );

router.delete("/delete-slot", deleteSlot);

export default router;