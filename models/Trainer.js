import db from "../config/db.js";

// ✅ Create trainers table if not exists
const createTrainerTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS trainers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      trainername VARCHAR(100) NOT NULL,
      experience VARCHAR(255),
      services TEXT,
      timing VARCHAR(100),
      fees DECIMAL(10,2) NOT NULL,
      image VARCHAR(255),
      active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("❌ Error creating trainers table:", err);
    } else {
      console.log("✅ Trainers table ready");
    }
  });
};

// Run once
createTrainerTable();

const Trainer = {
  // Add new trainer
  create: (data, callback) => {
    const { trainername, experience, services, timing, fees, image } = data;
    const sql =
      "INSERT INTO trainers (trainername, experience, services, timing, fees, image, active) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [trainername, experience, services, timing, fees, image, 1], (err, result) => {
      if (err) return callback(err, null);
      callback(null, { id: result.insertId, ...data, active: 1 });
    });
  },

  // Get all
  getAll: (callback) => {
    const sql = "SELECT * FROM trainers ORDER BY id DESC";
    db.query(sql, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Get one
  getById: (id, callback) => {
    const sql = "SELECT * FROM trainers WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Update trainer
  update: (id, data, callback) => {
    const { trainername, experience, services, timing, fees, image } = data;

    let sql = "UPDATE trainers SET trainername=?, experience=?, services=?, timing=?, fees=?";
    const values = [trainername, experience, services, timing, fees];

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

  // Set active
  setActive: (id, active, callback) => {
    const sql = "UPDATE trainers SET active = ? WHERE id = ?";
    db.query(sql, [active, id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },

  // Delete trainer
  delete: (id, callback) => {
    const sql = "DELETE FROM trainers WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  },
};

export default Trainer;
