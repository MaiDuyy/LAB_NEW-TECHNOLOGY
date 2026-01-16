import User from "../models/User.js";

class AuthController {
    // Hiển thị trang đăng ký
    static showRegister(req, res) {
        res.render("register", { error: null });
    }

    // Xử lý đăng ký
    static async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.render("register", {
                    error: "Email đã được sử dụng"
                });
            }

            // Tạo user mới
            await User.create(email, password, name);
            res.redirect("/auth/login");
        } catch (error) {
            console.error(error);
            res.render("register", {
                error: "Lỗi đăng ký, vui lòng thử lại"
            });
        }
    }

    // Hiển thị trang đăng nhập
    static showLogin(req, res) {
        res.render("login", { error: null });
    }

    // Xử lý đăng nhập
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Tìm user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.render("login", {
                    error: "Email hoặc mật khẩu không đúng"
                });
            }

            // Kiểm tra mật khẩu
            const isValid = await User.validatePassword(password, user.password);
            if (!isValid) {
                return res.render("login", {
                    error: "Email hoặc mật khẩu không đúng"
                });
            }

            // Lưu thông tin vào session
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name
            };

            res.redirect("/products");
        } catch (error) {
            console.error(error);
            res.render("login", {
                error: "Lỗi đăng nhập, vui lòng thử lại"
            });
        }
    }

    // Đăng xuất
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            }
            res.redirect("/auth/login");
        });
    }
}

export default AuthController;
