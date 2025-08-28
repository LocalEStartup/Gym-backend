import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost", 
  port: 3306, 
  user: "root",
  password: "",
  database: "nstargym",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

export default db;
