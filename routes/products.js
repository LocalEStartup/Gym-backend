// routes/products.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// routes/products.js
router.get("/", (req, res) => {
  const sql = `
    SELECT id, name, price, image, description AS \`desc\` FROM products
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);  // Log error to terminal
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


export default router;
