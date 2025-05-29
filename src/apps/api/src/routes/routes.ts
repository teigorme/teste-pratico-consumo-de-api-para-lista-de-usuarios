// routes/index.ts
import { Router } from "express";
import UserController from "../users/users.controller";
import AuthController from "../auth/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const router = Router();

router.use("/users", authenticate, UserController);
router.use("/auth", AuthController);
export default router;
