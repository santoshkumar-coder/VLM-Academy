import Slot from '../model/Slot.js'
import Booking from '../model/Booking.js';
import User from '../model/user.js';


// 1. Create Slot 
export const createSlot = async (req, res) => {
    try {
        // 1. Sirf adminId query se nikalna
        const { adminId } = req.query; 

        if (!adminId) {
            return res.status(400).json({ success: false, message: "adminId is required in query." });
        }

        // 2. Database mein User ko find karna aur uska role check karna
        const user = await User.findById(adminId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: You are not authorized as an admin." 
            });
        }

        const { date, day, times } = req.body; 

        if (!times || !Array.isArray(times)) {
            return res.status(400).json({ message: "Invalid input: 'times' must be an array." });
        }
        
        const timeSlotsArray = times.map(t => ({ time: t, isBooked: false }));

        // 5. Slot Create karna
        const newSlot = new Slot({
            date,
            day,
            timeSlots: timeSlotsArray,
            createdBy: adminId // Admin ki ID store ho jayegi
        });

        await newSlot.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Slot created successfully by verified Admin", 
            newSlot 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Slots for this date already exist." });
        }
        res.status(500).json({ error: error.message });
    }
};
export const getAllSlots = async (req, res) => {
    try {
        const slots = await Slot.find().populate('createdBy', 'name email');

        res.status(200).json({ 
            success: true, 
            totalSlots: slots.length,
            slots 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching slots", 
            error: error.message 
        });
    }
};


export const updateSlot = async (req, res) => {
    try {

        const { adminId, slotId } = req.query;
        const { date, day, times } = req.body;

        if (!adminId || !slotId) {
            return res.status(400).json({ 
                success: false, 
                message: "Both adminId and slotId are required in query parameters." 
            });
        }
       
        const user = await User.findById(adminId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: You are not authorized as an admin." 
            });
        }

        const updateData = {};
        if (date) updateData.date = date;
        if (day) updateData.day = day;
        if (times) {
            if (!Array.isArray(times)) {
                return res.status(400).json({ message: "Invalid input: 'times' must be an array." });
            }
         
            updateData.timeSlots = times.map(t => ({ time: t, isBooked: false }));
        }

        const updatedSlot = await Slot.findByIdAndUpdate(slotId, updateData, { new: true });
        
        if (!updatedSlot) {
            return res.status(404).json({ success: false, message: "Slot not found with the provided slotId." });
        }

        res.json({ 
            success: true, 
            message: "Slot updated successfully", 
            updatedSlot 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const deleteSlot = async (req, res) => {
    try {
  
        const { adminId, slotId } = req.query;
        if (!adminId || !slotId) {
            return res.status(400).json({ 
                success: false, 
                message: "adminId and slotId are both required in the query." 
            });
        }

        const adminUser = await User.findById(adminId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: You are not authorized as an admin." 
            });
        }
        const deletedSlot = await Slot.findOneAndDelete({ _id: slotId });

        if (!deletedSlot) {
            return res.status(404).json({ 
                success: false, 
                message: "Slot not found with the provided slotId." 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Slot deleted successfully by verified Admin",
            deletedSlotId: slotId
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};



export const getSlotsByFiltering = async (req, res) => {
    try {
        const { date, day } = req.query; 

        let filter = { "timeSlots.isBooked": false };

        if (date) {
            filter.date = date;
        }

        if (day) {
            filter.day = day;
        }

        const filteredSlots = await Slot.find(filter).select('date day timeSlots');

        if (filteredSlots.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No available slots found for the selected date/day."
            });
        }

        const result = filteredSlots.map(slot => ({
            slotId: slot._id,
            date: slot.date,
            day: slot.day,
            availableTimings: slot.timeSlots
                .filter(t => t.isBooked === false)
                .map(t => t.time)
        }));

        res.status(200).json({
            success: true,
            totalFound: result.length,
            slots: result
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const bookInterviewSlot = async (req, res) => {
    try {
        
        const { teacherId, slotId } = req.query;
       
        const { selectedTime, date, day } = req.body;

       
        if (!teacherId || !slotId || !selectedTime || !date || !day) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing fields: teacherId, slotId, date, day, and selectedTime are required." 
            });
        }

    
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: Only teachers can perform this action." 
            });
        }

        const slot = await Slot.findOne({
            _id: slotId,
            date: date, 
            day: day,   
            "timeSlots": { $elemMatch: { time: selectedTime, isBooked: false } }
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found or already booked for this specific Date/Day/Time."
            });
        }
        const newBooking = new Booking({
            slotId: slot._id,
            teacherId: teacherId,
            selectedTime: selectedTime,
            status: 'Scheduled'
            
        });

        await newBooking.save();

        await Slot.updateOne(
            { _id: slotId, "timeSlots.time": selectedTime },
            { $set: { "timeSlots.$.isBooked": true } }
        );

        res.status(201).json({
            success: true,
            message: `Success! Interview scheduled for ${date} (${day}) at ${selectedTime}`,
            bookingDetails: {
                id: newBooking._id,
                teacher: teacher.name,
                date: date,
                day: day,
                time: selectedTime
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};