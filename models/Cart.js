import db from "../config/db.js";

// Create cart table if not exists
const createCartTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      qty INT DEFAULT 1,
      price DECIMAL(10,2) NOT NULL,
      productname VARCHAR(255),
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("❌ Error creating carts table:", err);
    } else {
      console.log("✅ Carts table ready");
    }
  });
};
createCartTable();

// Promise-based query helper
const queryAsync = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

const Cart = {
  // Merge items into user's cart
  async merge(userId, items) {
    for (const item of items) {
      const checkQuery =
        "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
      const existing = await queryAsync(checkQuery, [userId, item.id]);

      if (existing.length > 0) {
        // Update qty if exists
        const updateQuery =
          "UPDATE carts SET qty = qty + ? WHERE user_id = ? AND product_id = ?";
        await queryAsync(updateQuery, [item.qty, userId, item.id]);
      } else {
        // Insert new
        const insertQuery = `
          INSERT INTO carts (user_id, product_id, qty, price, productname, image)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await queryAsync(insertQuery, [
          userId,
          item.id,
          item.qty,
          item.price,
          item.productname,
          item.image,
        ]);
      }
    }
    return await Cart.getByUser(userId);
  },

  // Get cart items for user
  async getByUser(userId) {
    const query = "SELECT * FROM carts WHERE user_id = ?";
    const results = await queryAsync(query, [userId]);
    return results;
  },

  // Clear cart after purchase
  async clear(userId) {
    const query = "DELETE FROM carts WHERE user_id = ?";
    await queryAsync(query, [userId]);
    return true;
  },

  // Remove single item
  async removeItem(userId, productId) {
    const query = "DELETE FROM carts WHERE user_id = ? AND product_id = ?";
    await queryAsync(query, [userId, productId]);
    return true;
  },
};

export default Cart;
