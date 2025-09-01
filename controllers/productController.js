// import db from "../config/db.js";

// // ✅ Add Product
// export const addProduct = (req, res) => {
//   const { productname, description, price } = req.body;
//   const image = req.file ? req.file.filename : null;

//   const sql =
//     "INSERT INTO products (productname, description, price, image, active) VALUES (?, ?, ?, ?, ?)";
//   db.query(sql, [productname, description, price, image, 1], (err, result) => {
//     if (err) {
//       console.error("Error inserting product:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json({
//       message: "✅ Product added successfully",
//       productId: result.insertId,
//     });
//   });
// };

// // ✅ Get only active Products
// export const getProducts = (req, res) => {
//   db.query("SELECT * FROM products WHERE active = 1", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json(results);
//   });
// };

// // ✅ Soft delete product (set active = 0)
// export const deleteProduct = (req, res) => {
//   const { id } = req.params;
//   const sql = "UPDATE products SET active = 0 WHERE id = ?";
//   db.query(sql, [id], (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json({ message: "🚫 Product deactivated successfully" });
//   });
// };

// // ✅ Reactivate product (set active = 1)
// export const activateProduct = (req, res) => {
//   const { id } = req.params;
//   const sql = "UPDATE products SET active = 1 WHERE id = ?";
//   db.query(sql, [id], (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json({ message: "✅ Product activated successfully" });
//   });
// };



import Product from "../models/Product.js";

// ✅ Add Product
// export const addProduct = (req, res) => {
//   const { productname, description, price } = req.body;
//   const image = req.file ? req.file.filename : null;

//   Product.create({ productname, description, price, image }, (err, product) => {
//     if (err) {
//       console.error("❌ Error inserting product:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     res.json({
//       message: "✅ Product added successfully",
//       product,
//     });
//   });
// };

export const addProduct = (req, res) => {
  console.log("📥 Body:", req.body);
  console.log("📸 File:", req.file);

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


// ✅ Get active products
export const getProducts = (req, res) => {
  Product.getActive((err, products) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(products);
  });
};

// ✅ Soft delete product
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.softDelete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "🚫 Product deactivated successfully" });
  });
};

// ✅ Reactivate product
export const activateProduct = (req, res) => {
  const { id } = req.params;
  Product.activate(id, (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "✅ Product activated successfully" });
  });
};
