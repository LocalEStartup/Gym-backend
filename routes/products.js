import express from "express";
import multer from "multer";
import {
  addProduct,
  getProducts,
  deleteProduct,
  activateProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("file"), addProduct);
router.get("/", getProducts);
router.put("/deactivate/:id", deleteProduct);
router.put("/activate/:id", activateProduct);

export default router;
