import TeacherProfile from '../model/teacherProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { 
            fullName, mobile, email, password, 
            pincode, city, state, address, dob, gender 
        } = req.body;

        // 1. Check if user already exists
        const existingTeacher = await TeacherProfile.findOne({ $or: [{ email }, { mobile }] });
        if (existingTeacher) {
            return res.status(400).json({ message: "Email or Mobile already exists" });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save Teacher
        const newTeacher = new TeacherProfile({
            fullName,
            mobile,
            email,
            password: hashedPassword,
            pincode,
            city,
            state,
            address,
            dob,
            gender
        });

        await newTeacher.save();

        res.status(201).json({ message: "Teacher registered successfully!" }, newTeacher);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// --- LOGIN TEACHER ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find teacher by email
        const teacher = await TeacherProfile.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: teacher._id }, 
            'YOUR_SECRET_KEY', 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            teacher: {
                id: teacher._id,
                fullName: teacher.fullName,
                email: teacher.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};