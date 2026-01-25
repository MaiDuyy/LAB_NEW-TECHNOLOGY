import Product from "../models/Product.js";
import { uploadProductImage, deleteProductImage } from "../services/s3.service.js";

class ProductController {
  // Hiển thị danh sách sản phẩm
  static async index(req, res) {
    try {
      const { q } = req.query;
      const products = await Product.getAll(q);

      res.render("products", {
        products,
        q: q || "",
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

  // Thêm sản phẩm (✅ upload ảnh lên S3 rồi lưu vào DynamoDB)
  // Lưu ý: route phải dùng multer upload.single("image") để req.file có dữ liệu
  static async create(req, res) {
    try {
      const { name, price, quantity } = req.body;

      // upload ảnh (nếu có)
      const { image_key, url_image } = await uploadProductImage(req.file);

      await Product.create(name, price, quantity, image_key, url_image);
      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

  // Hiển thị form sửa
  static async editForm(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      res.render("editProduct", {
        product,
        user: req.session.user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

  // Xử lý cập nhật (✅ nếu upload ảnh mới -> upload S3, xóa ảnh cũ, update DynamoDB)
  // Lưu ý: route phải dùng multer upload.single("image")
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;

      const current = await Product.getById(id);
      if (!current) return res.status(404).send("Product not found");

      // Có ảnh mới
      if (req.file) {
        const { image_key, url_image } = await uploadProductImage(req.file);

        // xóa ảnh cũ (khuyến khích)
        await deleteProductImage(current.image_key);

        await Product.update(id, name, price, quantity, image_key, url_image);
      } else {
        // Không đổi ảnh
        await Product.update(id, name, price, quantity);
      }

      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }

  // Xóa sản phẩm (✅ xóa DynamoDB + xóa ảnh S3)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const current = await Product.getById(id); // lấy image_key để xóa S3
      await Product.delete(id);

      // xóa ảnh (khuyến khích)
      await deleteProductImage(current?.image_key);

      res.redirect("/products");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
}

export default ProductController;
