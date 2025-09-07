import db from "../config/db.js";

// Create orders table if not exists
const createOrderTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      items JSON NOT NULL,
      address TEXT NOT NULL,
      status ENUM('pending','confirmed','shipped','delivered') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("❌ Error creating orders table:", err);
    } else {
      console.log("✅ Orders table ready");
    }
  });
};
createOrderTable();

// Promise wrapper for db.query
const queryAsync = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

const Order = {
  // Create a new order
  async create({ user_id, items, address }) {
    const query = "INSERT INTO orders (user_id, items, address) VALUES (?, ?, ?)";
    const result = await queryAsync(query, [user_id, JSON.stringify(items), address]);
    return { id: result.insertId, user_id, items, address };
  },

  // Get orders by user
  async getByUser(user_id) {
    const query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    const results = await queryAsync(query, [user_id]);
    return results;
  },

  // ✅ Get all orders (for admin)
  async getAll() {
    const query = "SELECT * FROM orders ORDER BY created_at DESC";
    const results = await queryAsync(query);
    return results;
  },

  // Get a single order by ID
  async getById(id) {
    const query = "SELECT * FROM orders WHERE id = ?";
    const results = await queryAsync(query, [id]);
    return results[0];
  },

  // Update order status
  async updateStatus(id, status) {
    const query = "UPDATE orders SET status = ? WHERE id = ?";
    await queryAsync(query, [status, id]);
    return { id, status };
  },
};

export default Order;
