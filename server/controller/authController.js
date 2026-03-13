import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//creating new user
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword, // ✅ save hash
            role,
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

//login user 
export const login = async (req, res) => {
    //take input from user
    const { email, password } = req.body;

    //check for user
    const user = await User.findOne({ email })
    if (!user)
        return res.status(400).json({ msg: "User not found" });

    //check for credential
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(400).json({ msg: "Invalid Credentials" })

    //assign token to user
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to false for localhost development
        sameSite: "lax",
        domain: "localhost", // Explicitly set domain for localhost
        maxAge: 24 * 60 * 60 * 1000
    });
    
    console.log("Cookie set with token:", token);
    console.log("Cookie settings:", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        domain: "localhost",
        maxAge: 24 * 60 * 60 * 1000
    });

    //all good->login
    res.json({
        success: true,
        user: { id: user._id, name: user.name, role: user.role }
    })

}

//This helps React reload user after refresh.
export const me = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
        success: true,
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email,
            role: user.role 
        }
    });
};


//get all users 
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch users" });
    }
};

export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: false, // Set to false for localhost development
        sameSite: "lax",
        domain: "localhost", // Explicitly set domain for localhost
        maxAge: 0
    });
    
    res.json({ success: true });
};

export const enableCalendar = async (req, res) => {
    req.user.calendarAutoEnabled = true;
    await req.user.save();

    res.json({ success: true });
};



