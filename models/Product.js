import db from "../config/db.js";

// ✅ Create products table if not exists
const createProductTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      productname VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image VARCHAR(255),
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("❌ Error creating products table:", err);
    } else {
      console.log("✅ Products table ready");
    }
  });
};

// Run once when file is imported
createProductTable();

const Product = {
  // Add new product
  create: (data, callback) => {
    const { productname, description, price, image } = data;
    const sql =
      "INSERT INTO products (productname, description, price, image, active) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [productname, description, price, image, 1], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, ...data, active: 1 });
    });
  },

  // Get all products
  getAll: (callback) => {
    const sql = "SELECT * FROM products WHERE active=1 ORDER BY id DESC";
    db.query(sql, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Get one
  getById: (id, callback) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Update (optionally update image)
  update: (id, data, callback) => {
    const { productname, description, price, image } = data;

    let sql = "UPDATE products SET productname=?, description=?, price=?";
    const values = [productname, description, price];

    if (image) {
      sql += ", image=?";
      values.push(image);
    }

    sql += " WHERE id=?";
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // Set active explicitly
  setActive: (id, active, callback) => {
    const sql = "UPDATE products SET active = ? WHERE id = ?";
    db.query(sql, [active, id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // Delete permanently (DB row only — controller will remove file)
  delete: (id, callback) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
};

export default Product;
