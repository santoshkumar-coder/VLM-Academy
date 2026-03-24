import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, 
    day: { type: String, required: true },
    timeSlots: [{
        time: { type: String, required: true },
        isBooked: { type: Boolean, default: false }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Slot', slotSchema);