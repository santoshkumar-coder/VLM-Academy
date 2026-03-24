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

        // Check: Kya user exist karta hai aur kya uska role 'admin' hai?
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: You are not authorized as an admin." 
            });
        }

        // 3. Agar admin hai, toh body se data nikalna
        const { date, day, times } = req.body; 

        // 4. Validation: Times array check
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
// 2. Get All Slots (Admin View - Sab kuch dikhega)
export const getAllSlots = async (req, res) => {
    try {
        // 1. Database se saare slots fetch karna
        // .populate() optional hai, agar admin ka naam dekhna ho toh rakhein
        const slots = await Slot.find().populate('createdBy', 'name email');

        // 2. Response bhejna
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
// 3. Update Slot
export const updateSlot = async (req, res) => {
    try {
        // 1. adminId aur slotId dono URL query se nikalna (?adminId=...&slotId=...)
        const { adminId, slotId } = req.query;
        
        // 2. Naya data body se nikalna
        const { date, day, times } = req.body;

        // 3. Validation: Kya dono IDs provide ki gayi hain?
        if (!adminId || !slotId) {
            return res.status(400).json({ 
                success: false, 
                message: "Both adminId and slotId are required in query parameters." 
            });
        }

        // 4. Admin Verification: Kya ye user sach mein admin hai?
        const user = await User.findById(adminId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied: You are not authorized as an admin." 
            });
        }

        // 5. Update Data prepare karna
        const updateData = {};
        if (date) updateData.date = date;
        if (day) updateData.day = day;
        if (times) {
            if (!Array.isArray(times)) {
                return res.status(400).json({ message: "Invalid input: 'times' must be an array." });
            }
            // Naye times ko format karna
            updateData.timeSlots = times.map(t => ({ time: t, isBooked: false }));
        }

        // 6. Slot ko update karna (slotId ke base par)
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
// 4. Delete Slot
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