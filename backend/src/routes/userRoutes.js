import express from "express"
import {validateRegister} from "../middlewares/validateRegister.js";
import { registerController } from "../controllers/registerController.js";
import { verifyEmailController } from "../controllers/verifyEmailController.js";
const router = express.Router();
router.post("/register",validateRegister,registerController);
router.post("/verify-email",verifyEmailController)
export default router;
