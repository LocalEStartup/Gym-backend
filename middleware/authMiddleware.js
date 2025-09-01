import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect: checks if token exists and valid
export const protect = async (req, res, next) => {
  let token;

  // 🔹 Check cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 🔹 Allow fallback Bearer header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove password before attaching
    const { password, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ✅ Protect + Admin
export const adminOnly = async (req, res, next) => {
  try {
    // make sure user is authenticated
    await protect(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
      }
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
