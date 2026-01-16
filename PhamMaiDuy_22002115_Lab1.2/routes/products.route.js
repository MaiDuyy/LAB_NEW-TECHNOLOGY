import express from "express";
import ProductController from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều yêu cầu đăng nhập
router.use(isAuthenticated);

// Hiển thị danh sách sản phẩm
router.get("/", ProductController.index);

// Thêm sản phẩm
router.post("/add", ProductController.create);

// Xóa sản phẩm
router.post("/delete/:id", ProductController.delete);

// Hiển thị form sửa
router.get("/edit/:id", ProductController.editForm);

// Xử lý cập nhật
router.post("/edit/:id", ProductController.update);

export default router;