import TeacherProfile from '../model/teacherProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';



export const register =async (req, res) => {
    try {

        const { id } = req.params; 

        const { 
            fullName, mobile, pincode, city, 
            state, address, dob, gender , password, email, profilePhoto
        } = req.body;

        
        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found. ID invalid." });
        }

        const existingProfile = await TeacherProfile.findOne({ userId: id });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile for this user already exists." });
        }

        const mobileExists = await TeacherProfile.findOne({ mobile });
        if (mobileExists) {
            return res.status(400).json({ message: "Mobile number already in use by another teacher." });
        }

        const newTeacherProfile = new TeacherProfile({
            userId: id, // Params se aayi hui ID yahan link ho rahi hai
            fullName,
            mobile,
            pincode,
            city,
            state,
            address,
            dob,
            gender,
            password,
            email,
            profilePhoto
        });

        await newTeacherProfile.save();

        res.status(201).json({ 
            message: "Teacher Profile created successfully!", 
            profile: newTeacherProfile 
        });

    } catch (error) {
        console.error("Error creating profile:", error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const teacher = await TeacherProfile.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

       
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

       
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


export const updateProfile = async (req, res) => {
    try {
    
        const { id } = req.params; 
        const dataToUpdate = req.body; 

        const updatedProfile = await TeacherProfile.findByIdAndUpdate(
            id, 
            { $set: dataToUpdate }, 
            { new: true, runValidators: true } 
        );

    
        if (!updatedProfile) {
            return res.status(404).json({ message: "Teacher profile not found with this ID." });
        }

        res.status(200).json({
            message: "Profile updated successfully!",
            profile: updatedProfile
        });

    } catch (error) {
        console.error("Update Error:", error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists.` });
        }

        res.status(500).json({ message: "Server Error", error: error.message });
    }
};