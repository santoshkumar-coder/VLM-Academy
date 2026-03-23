import Interview from '../model/Interview.js';

export const scheduleInterview = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const { interviewDate, interviewTime, interviewDay } = req.body;

        if (!interviewDate || !interviewTime || !interviewDay) {
            return res.status(400).json({
                success: false,
                message: "Please provide interview date, time, and day."
            });
        }

        const newInterview = new Interview({
            teacherId,
            interviewDate,
            interviewTime,
            interviewDay
        });

        const savedInterview = await newInterview.save();

        res.status(201).json({
            success: true,
            message: "Interview scheduled successfully",
            data: savedInterview
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};