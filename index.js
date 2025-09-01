import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cookieParser());

//  Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
app.use(express.json());

//  Static Files
app.use("/uploads", express.static("uploads"));

//  Test Route
app.get("/api/test", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ dbWorking: true, result: result[0].result });
  });
});

//  API Routes
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

//  Default Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is live!");
});

//  Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
