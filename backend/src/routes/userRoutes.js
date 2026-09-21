import express from "express"
import {validateRegister} from "../middlewares/validateRegister.js";
import { registerController } from "../controllers/registerController.js";
const router = express.Router();
router.post("/register",validateRegister,registerController);
export default router;
