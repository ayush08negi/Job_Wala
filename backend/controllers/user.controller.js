import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    console.log("hiiiiiii")
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        console.log("fullname",fullname)
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            },
        });

        return res.status(201).json({ message: "Account created successfully", success: true });

    } catch (error) {
        console.log("Register Error:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with this role", success: false });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const { password: _, ...userData } = user.toObject();

        return res.status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: userData,
                success: true
            });

    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.log("Logout Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({ message: "Profile updated successfully", user: userData, success: true });

    } catch (error) {
        console.log("Update Profile Error:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

