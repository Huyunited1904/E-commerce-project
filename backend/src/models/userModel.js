import pool from "../config/db.js";

export const initializeUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NULL,
      address VARCHAR(255) NULL,
      role ENUM('customer', 'admin')
        NOT NULL DEFAULT 'customer',
      is_email_verified BOOLEAN
        NOT NULL DEFAULT FALSE,
      is_active BOOLEAN
        NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);

  console.log("Users table initialized successfully");
};
export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(query, [email]);

  return rows[0] || null;
};

export const createUser = async ({
  fullName,
  email,
  passwordHash,
}) => {
  const query = `
    INSERT INTO users (
      full_name,
      email,
      password_hash
    )
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    fullName,
    email,
    passwordHash,
  ]);

  return result.insertId;
};