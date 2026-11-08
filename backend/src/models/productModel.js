import pool from "../config/db.js";


export const initializeProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(12, 2) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      image_url VARCHAR(2048),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

      CONSTRAINT chk_products_price
        CHECK (price >= 0),

      CONSTRAINT chk_products_stock
        CHECK (stock >= 0)
    )
  `;

  await pool.query(query);
  console.log("Products Table initialized");
};

export const createProduct = async ({
  categoryId,
  name,
  description,
  price,
  stock,
  imageUrl,
}) => {
  const query = `
    INSERT INTO products (
      category_id,
      name,
      description,
      price,
      stock,
      image_url
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    categoryId,
    name,
    description,
    price,
    stock,
    imageUrl,
  ]);

  return result.insertId;
};
export const getAllProducts = async ({ limit, offset }) => {
  const query = `
    SELECT
      id,
      category_id,
      name,
      description,
      price,
      stock,
      image_url
    FROM products
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(query, [limit, offset]);

  return rows;
};
