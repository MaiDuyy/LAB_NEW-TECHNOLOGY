import db from "../db/db.js";

class Product {
    static async getAll(searchQuery = null) {
        let sql = "SELECT * FROM products";
        let params = [];

        if (searchQuery) {
            sql += " WHERE name LIKE ?";
            params.push(`%${searchQuery}%`);
        }

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async getById(id) {
        const [[product]] = await db.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );
        return product;
    }

    static async create(name, price, quantity) {
        const [result] = await db.query(
            "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)",
            [name, price, quantity]
        );
        return result;
    }

    static async update(id, name, price, quantity) {
        const [result] = await db.query(
            "UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?",
            [name, price, quantity, id]
        );
        return result;
    }

    static async delete(id) {
        const [result] = await db.query(
            "DELETE FROM products WHERE id = ?",
            [id]
        );
        return result;
    }
}

export default Product;
