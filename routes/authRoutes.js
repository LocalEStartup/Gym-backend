import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { adminOnly , protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", registerUser);

// @route   POST /api/auth/login
router.post("/login", loginUser);

// routes/auth.js
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome user", user: req.user });
});

router.get("/admin-dashboard", adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

export default router;
