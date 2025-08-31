import express from "express";
import cors from "cors";
import db from "./db.js";
import productRoutes from "./routes/products.js";

const app = express();
const port = 8080;

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve images

// ✅ Test Route
app.get("/api/test", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ dbWorking: true, result: result[0].result });
  });
});

// ✅ Products API
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Backend is live!");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
