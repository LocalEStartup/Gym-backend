import fs from "fs";
import path from "path";
import Product from "../models/Product.js";

const uploadsDir = path.resolve("uploads");

// ✅ Add product
export const addProduct = (req, res) => {
  const { productname, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  Product.create({ productname, description, price, image }, (err, product) => {
    if (err) {
      console.error("❌ Error inserting product:", err);
      return res.status(500).json({ error: err.sqlMessage || "Database error" });
    }
    res.json({ message: "✅ Product added", product });
  });
};

// ✅ Get all products
export const getProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(products);
  });
};

// ✅ Get product by ID
export const getProductById = (req, res) => {
  const { id } = req.params;

  Product.getById(id, (err, product) => {
    if (err) {
      console.error("❌ Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });
};


// ✅ Toggle active/inactive (single endpoint)
export const toggleActive = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, product) => {
    if (err || !product) return res.status(404).json({ error: "Product not found" });

    const nextActive = product.active === 1 ? 0 : 1;
    Product.setActive(id, nextActive, (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      res.json({
        message: nextActive ? "✅ Product activated" : "🚫 Product deactivated",
        active: nextActive,
      });
    });
  });
};

// ✅ Update product (replace image if new file uploaded; delete old file)
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { productname, description, price } = req.body;
  const newImage = req.file ? req.file.filename : null;

  Product.getById(id, (err, existing) => {
    if (err || !existing) return res.status(404).json({ error: "Product not found" });

    // If a new file is uploaded, delete the old file
    if (newImage && existing.image) {
      const oldPath = path.join(uploadsDir, existing.image);
      fs.unlink(oldPath, (uErr) => {
        // Ignore ENOENT (file already missing), log others
        if (uErr && uErr.code !== "ENOENT") {
          console.error("❌ Failed to remove old file:", uErr);
        }
      });
    }

    Product.update(
      id,
      {
        productname,
        description,
        price,
        image: newImage || undefined, // only update image if new one exists
      },
      (uErr) => {
        if (uErr) return res.status(500).json({ error: "Database error" });
        res.json({ message: "✅ Product updated successfully" });
      }
    );
  });
};

// ✅ Permanent delete (delete DB row + image file)
export const deleteProductPermanent = (req, res) => {
  const { id } = req.params;

  Product.getById(id, (err, product) => {
    if (err || !product) return res.status(404).json({ error: "Product not found" });

    // Delete image if exists
    if (product.image) {
      const filePath = path.join(uploadsDir, product.image);
      fs.unlink(filePath, (uErr) => {
        if (uErr && uErr.code !== "ENOENT") {
          console.error("❌ File delete error:", uErr);
        }
      });
    }

    Product.delete(id, (dErr) => {
      if (dErr) return res.status(500).json({ error: "Database error" });
      res.json({ message: "🗑️ Product permanently deleted" });
    });
  });
};
