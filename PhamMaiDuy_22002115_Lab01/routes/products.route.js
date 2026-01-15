import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Hiển thị danh sách + tìm kiếm sản phẩm
router.get("/", async(req, res) => {
    const { q } = req.query;

    let sql = "SELECT * FROM products";
    let params = [];

    if (q) {
        sql += " WHERE name LIKE ?";
        params.push(`%${q}%`);
    }

    const [rows] = await db.query(sql, params);
    res.render("products", {
        products: rows,
        q: q || ""
    });
});


// Thêm sản phẩm
router.post("/add", async(req, res) => {
    const { name, price, quantity } = req.body;
    await db.query(
        "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)", [name, price, quantity]
    );
    res.redirect("/");
});

// XÓA sản phẩm
router.post("/delete/:id", async(req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.redirect("/");
});

// HIỂN THỊ FORM SỬA
router.get("/edit/:id", async(req, res) => {
    const { id } = req.params;
    const [
        [product]
    ] = await db.query(
        "SELECT * FROM products WHERE id = ?", [id]
    );
    res.render("editProduct", { product });
});

//  XỬ LÝ SỬA
router.post("/edit/:id", async(req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    await db.query(
        "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?", [name, price, quantity, id]
    );
    res.redirect("/");
});

// Tim kiếm sản phẩm theo LIKE

export default router;