import TeacherQualification from "../model/TeacherQualification.js";

export const createQualification = async (req, res) => {
    try {
        const qualificationData = new TeacherQualification(req.body);
        const savedData = await qualificationData.save();
        
        res.status(201).json({
            success: true,
            message: "Qualification details saved successfully",
            data: savedData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllQualifications = async (req, res) => {
    try {
        const qualifications = await TeacherQualification.find();
        res.status(200).json({
            success: true,
            count: qualifications.length,
            data: qualifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


