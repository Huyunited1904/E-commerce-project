import express from "express"
import {validateRegister} from "../middlewares/validateRegister.js";
import { registerController } from "../controllers/registerController.js";
import { verifyEmailController } from "../controllers/verifyEmailController.js";
import { loginController } from "../controllers/loginController.js";
import { validateLogin } from "../middlewares/validateLogin.js";
const router = express.Router();
router.post("/register",validateRegister,registerController);
router.post("/verify-email",verifyEmailController);
router.post("/login",validateLogin,loginController);
export default router;
