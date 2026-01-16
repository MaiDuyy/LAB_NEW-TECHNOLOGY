import express from "express";
import AuthController from "../controllers/authController.js";
import { isGuest } from "../middleware/auth.js";

const router = express.Router();

// Trang đăng ký
router.get("/register", isGuest, AuthController.showRegister);
router.post("/register", isGuest, AuthController.register);

// Trang đăng nhập
router.get("/login", isGuest, AuthController.showLogin);
router.post("/login", isGuest, AuthController.login);

// Đăng xuất
router.post("/logout", AuthController.logout);

export default router;
