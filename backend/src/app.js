import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});
app.use("/api/auth",userRoutes);
app.use("/api/category",categoryRoutes);
app.use(errorMiddleware);
export default app;