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
export const createVerificationToken = async ({
  userId,
  tokenHash,
  expiresAt,
}) => {
  const query = `
    INSERT INTO email_verification_tokens
      (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    userId,
    tokenHash,
    expiresAt,
  ]);

  return result.insertId;
};
export const findVerificationTokenByHash = async (tokenHash) => {
  const query = `
    SELECT id, user_id, token_hash, expires_at, used_at
    FROM email_verification_tokens
    WHERE token_hash = ?
    LIMIT 1
  `;

  const [rows] = await pool.query(query, [tokenHash]);

  return rows[0];
};

export const markVerificationTokenAsUsed = async (tokenId) => {
  const query = `
    UPDATE email_verification_tokens
    SET used_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await pool.query(query, [tokenId]);
};