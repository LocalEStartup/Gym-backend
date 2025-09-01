import db from "../config/db.js";

// Create users table if not exists
const createUserTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("❌ Error creating users table:", err);
    } else {
      console.log("✅ Users table ready");
    }
  });
};
createUserTable();

// Convert db.query to promise-based helper
const queryAsync = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

const User = {
  // Create new user
  async create({ name, email, password, role }) {
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const result = await queryAsync(query, [name, email, password, role || "user"]);
    return { id: result.insertId, name, email, role: role || "user" };
  },

  // Find user by email
  async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const results = await queryAsync(query, [email]);
    return results[0];
  },

  // Find user by ID
  async findById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const results = await queryAsync(query, [id]);
    return results[0];
  },

  // Get all users
  async getAll() {
    const query = "SELECT id, name, email, role, created_at FROM users";
    const results = await queryAsync(query);
    return results;
  },
};

export default User;
