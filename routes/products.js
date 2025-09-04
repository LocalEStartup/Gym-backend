import express from "express";
import multer from "multer";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  toggleActive,
  deleteProductPermanent,
  getProductById
} from "../controllers/productController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// READ — logged-in users
router.get("/", getProducts);
router.get("/:id", protect,getProductById);


// CREATE — admin only
router.post("/", protect, adminOnly, upload.single("file"), addProduct);

// UPDATE — admin only (with optional image replacement)
router.put("/:id", protect, adminOnly, upload.single("file"), updateProduct);

// TOGGLE ACTIVE — admin only (single toggle endpoint)
router.patch("/:id/toggle-active", protect, adminOnly, toggleActive);

// PERMANENT DELETE — admin only (DB row + image file)
router.delete("/:id", protect, adminOnly, deleteProductPermanent);

export default router;
