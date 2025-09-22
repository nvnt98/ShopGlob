import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({
      message: "User registered successfully",
      user,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};


// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist", success: false });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ userId: user._id },"baabu12-secret",{
      expiresIn:'365d' // token valid for 1 year
    })

    res.json({ message: "Login successful", token, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ users, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
}



//get profile
export const getProfile = async (req, res) => {
  res.json({ user: req.user, success: true });
};