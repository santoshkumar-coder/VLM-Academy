import TeacherStatus from '../model/teacherStatus.model.js';
import { updateMatchingPool } from '../service/matching.services.js';


export const toggleStatus = async (req, res) => {
    try {
        const { teacherId } = req.params; 
        const { status } = req.body;     

        const validStatuses = ['online', 'offline', 'busy'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status. Use online, offline, or busy." 
            });
        }

        // Status update logic
        const updatedStatus = await TeacherStatus.findOneAndUpdate(
            { teacher: teacherId }, // Find by teacherId from params
            { 
                status, 
                lastActive: new Date(),
                updatedBy: 'teacher' 
            },
            { new: true, upsert: true } 
        );

      
        updateMatchingPool(teacherId, status);

        res.status(200).json({
            success: true,
            message: `Teacher status updated to ${status}`,
            data: updatedStatus
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


// 2. Admin Control (Condition: Busy behavior rules)
export const adminForceUpdate = async (req, res) => {
    try {
        const { adminId, teacherId, status } = req.query;

        if (!adminId || !teacherId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide adminId, teacherId, and status in the query parameters." 
            });
        }

        const validStatuses = ['online', 'offline', 'busy'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status. Use online, offline, or busy." 
            });
        }

        const updatedStatus = await TeacherStatus.findOneAndUpdate(
            { teacher: teacherId },
            { 
                status: status.toLowerCase(), 
                updatedBy: 'admin',
                actionBy: adminId,      
                lastActive: new Date()
            },
            { new: true, upsert: true }
        ).populate('actionBy', 'name email');
        updateMatchingPool(teacherId, status);

        res.status(200).json({
            success: true,
            message: `Admin (ID: ${adminId}) changed status to ${status} for Teacher (ID: ${teacherId})`,
            data: updatedStatus
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};