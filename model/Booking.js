import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    selectedTime: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Scheduled', 'Rescheduled', 'Missed'], 
        default: 'Pending' 
    },
    rescheduleReason: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);