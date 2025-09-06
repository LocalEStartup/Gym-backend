import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔑 Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 👉 Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Incoming data:", req.body);

    // 🔹 Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Create user (await instead of callback)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 🔹 Send response
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      token: generateToken(user.id, user.role || "user"),
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 👉 Login with role check and cookie
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  // 🔹 Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  // 🔹 Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const token = generateToken(user.id, user.role);

  // ✅ Store JWT in httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,   // cannot be accessed via JS
    secure: process.env.NODE_ENV === "production", // only https in prod
    sameSite: "strict", // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // ✅ Role-based response without sending token in JSON
  if (user.role === "admin") {
    return res.json({
      status: "success",
      message: "Welcome Admin!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      dashboard: "admin-dashboard",
    });
  } else {
    return res.json({
      status: "success",
      message: "Welcome User!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      dashboard: "user-dashboard",
    });
  }
};

// 👉 Logout (clear cookie)
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// 👉 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    res.json(users); // directly return list of users
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
