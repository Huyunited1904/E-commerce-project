import pool from "../config/db.js";

export const initializeEmailVerificationTokenTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

      user_id BIGINT UNSIGNED NOT NULL,

      token_hash VARCHAR(255) NOT NULL UNIQUE,

      expires_at DATETIME NOT NULL,

      used_at DATETIME NULL,

      created_at TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_verification_token_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `;

  await pool.query(query);

  console.log(
    "Email verification tokens table initialized successfully"
  );
};