import dotenv from "dotenv";
import app from "./app.js";
import { initializeUserTable } from "./models/userModel.js";
import { initializeEmailVerificationTokenTable } from "./models/emailVerificationTokenModel.js";
import { testConnection } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();
    await initializeUserTable();
    await initializeEmailVerificationTokenTable();
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    process.exit(1);
  }
};

startServer();