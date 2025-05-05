import express from "express";
const authRouter = express.Router();
import { login, register, logout } from "../controllers/authController";

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.post("/logout", logout);

export { authRouter };
