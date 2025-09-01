import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔑 Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 👉 Register
export const registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  User.findByEmail(email, async (err, existingUser) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({ name, email, password: hashedPassword, role }, (err, user) => {
      if (err) return res.status(500).json({ message: "Error creating user" });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        token: generateToken(user.id, user.role || "user"),
      });
    });
  });
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