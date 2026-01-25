import db from "../db/db.js";
import bcrypt from "bcrypt";

class User {
    static async findByEmail(email) {
        const [[user]] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return user;
    }

    static async findById(id) {
        const [[user]] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return user;
    }

    static async create(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
            [email, hashedPassword, name]
        );
        return result;
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default User;
