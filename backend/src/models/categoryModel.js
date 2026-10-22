import pool from "../config/db.js";

export const initializeCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await pool.query(query);

  console.log("Categories table initialized");
};
export const createCategory = async ({ name, description }) => {
  const query = `
    INSERT INTO categories (name, description)
    VALUES (?, ?)
  `;

  const [result] = await pool.query(query, [
    name,
    description || null,
  ]);

  return {
    id: result.insertId,
    name,
    description: description || null,
  };
};
export const findCategoryByName = async (name) => {
  const query = `
    SELECT
      id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    WHERE name = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(query, [name]);

  return rows[0] || null;
};

export const getAllCategories = async () => {
  const query = `
    SELECT 
    id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    ORDER BY id ASC
  `;
  
  const [rows] = await pool.query(query);
  return rows;
}
export const updateCategoryById = async ({
  id,
  name,
  description,
}) => {
  const query = `
    UPDATE categories
    SET
      name = ?,
      description = ?
    WHERE id = ?
  `;

  const [result] = await pool.query(query, [
    name,
    description,
    id,
  ]);

  return result.affectedRows;
};

export const findCategoryById = async (id) => {
  const query = `
    SELECT
      id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    WHERE id = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(query, [id]);

  return rows[0] || null;
};