import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("Database connected successfully");

    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default pool;
