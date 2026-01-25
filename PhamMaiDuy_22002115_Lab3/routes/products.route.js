import express from "express";
import multer from "multer";
import ProductController from "../controllers/productController.js";
// import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// (Tuỳ chọn) Tất cả routes đều yêu cầu đăng nhập
// router.use(isAuthenticated);

// ✅ Multer: dùng memoryStorage để upload lên S3 trực tiếp (không lưu file vào disk EC2)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Only JPG/PNG/WEBP allowed"), ok);
  },
});

// Hiển thị danh sách sản phẩm
router.get("/", ProductController.index);

// ✅ Thêm sản phẩm (có thể upload ảnh: field name="image" trong form)
router.post("/add", upload.single("image"), ProductController.create);

// Xóa sản phẩm
router.post("/delete/:id", ProductController.delete);

// Hiển thị form sửa
router.get("/edit/:id", ProductController.editForm);

// ✅ Xử lý cập nhật (có thể upload ảnh mới: field name="image")
router.post("/edit/:id", upload.single("image"), ProductController.update);

export default router;
