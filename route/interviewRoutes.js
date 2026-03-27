import express from 'express';
import { bookInterviewSlot, createSlot, deleteSlot, getAllSlots, getSlotsByFiltering, updateSlot } from '../controller/interviewController.js';
import { deleteModel } from 'mongoose';

const router = express.Router();

router.post("/create", createSlot);

router.post("/book-slots-for-teacher", bookInterviewSlot);

router.get("/getAllSlots", getAllSlots);

router.get("/get-slots-for-teacher", getSlotsByFiltering);

router.put("/update-slot", updateSlot );

router.delete("/delete-slot", deleteSlot);

export default router;