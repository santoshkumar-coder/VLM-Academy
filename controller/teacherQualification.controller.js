import TeacherQualification from "../model/TeacherQualification.js";

export const createQualification = async (req, res, next) => {
    try {
        const { teacherId } = req.params;

         const alreadyExists = await TeacherQualification.findOne({ teacher: teacherId });
        if (alreadyExists) {
            return res.status(400).json({ success: false, message: "Qualification already exists" });
        }
        const data = { ...req.body };
data.teacher = teacherId; 

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        if (req.files) {
            const setFullUrl = (fieldName) => {
                if (req.files[fieldName]) {
                    data[fieldName] = `${baseUrl}/uploads/teachers/${req.files[fieldName][0].filename}`;
                }
            };

            setFullUrl('resume');
            setFullUrl('teachingCertification');
            setFullUrl('aadharCard');
            setFullUrl('experienceDocument');
            setFullUrl('qualificationCertificate');
            setFullUrl('introVideo');

            if (req.files['additionalCertificates']) {
                data.additionalCertificates = req.files['additionalCertificates'].map(
                    file => `${baseUrl}/uploads/teachers/${file.filename}`
                );
            }
        }

        const jsonFields = ['subjects', 'classes', 'boards', 'teachingMode', 'languages'];
        jsonFields.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                try {
                    data[field] = JSON.parse(data[field]);
                } catch (e) {
                    data[field] = data[field].split(',').map(item => item.trim());
                }
            }
        });

        const qualificationData = new TeacherQualification(data);
        const savedData = await qualificationData.save();

        res.status(201).json({
            success: true,
            message: "Qualification saved Successfully",
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
        const { category, subject, mode } = req.query;
        let query = {};

        // Filtering logic
        if (category) query.classCategories = category;
        if (subject) query.subjects = { $in: [subject] };
        if (mode) query.teachingMode = mode;

        const qualifications = await TeacherQualification.find(query).sort({ createdAt: -1 });

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
