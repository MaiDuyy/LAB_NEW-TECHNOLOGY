// Middleware kiểm tra đăng nhập
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect("/auth/login");
};

// Middleware kiểm tra chưa đăng nhập (cho trang login/register)
export const isGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect("/products");
    }
    next();
};
