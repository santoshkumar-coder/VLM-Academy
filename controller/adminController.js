import User from "../model/user.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ErrorHandler from'../utils/errorHandler.js';
import catchAsyncError from "../middleware/catchAsyncError.js";

// --- Admin Register ---
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, gender, role } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email already registered" 
            });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create New Admin/User
        // Yahan role body se aayega (admin/teacher/student)
        const newAdmin = new User({
            name,
            email,
            password: hashedPassword,
            gender,
            role: role || "admin" // Default admin agar role nahi bheja gaya to
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newAdmin._id,
                name: newAdmin.name,
                role: newAdmin.role,
                email: newAdmin.email,
                password: newAdmin.password
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

// --- Admin Login ---
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. User find karein email se
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Email or Password" 
            });
        }

        // 2. Password match karein
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Email or Password" 
            });
        }

        // 3. Token generate karein
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "YOUR_SECRET_KEY_HERE", // Ise .env file mein rakhein
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const updateTeacherProfileStatue = catchAsyncError(
    async(req, res, next)=>{
        // const adminID = await 

})