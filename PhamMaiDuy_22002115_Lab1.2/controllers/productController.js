import Product from "../models/Product.js";

class ProductController {
    // Hiển thị danh sách sản phẩm
    static async index(req, res) {
        try {
            const { q } = req.query;
            const products = await Product.getAll(q);
            res.render("products", {
                products,
                q: q || "",
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }

    // Thêm sản phẩm
    static async create(req, res) {
        try {
            const { name, price, quantity } = req.body;
            await Product.create(name, price, quantity);
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
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }

    // Xử lý cập nhật
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, quantity } = req.body;
            await Product.update(id, name, price, quantity);
            res.redirect("/products");
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }

    // Xóa sản phẩm
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await Product.delete(id);
            res.redirect("/products");
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    }
}

export default ProductController;
