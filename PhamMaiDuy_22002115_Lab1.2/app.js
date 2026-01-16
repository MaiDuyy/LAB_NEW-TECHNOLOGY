import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import productRoutes from "./routes/products.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Redirect root to login
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/products');
    } else {
        res.redirect('/auth/login');
    }
});

const PORT = process.env.NODE_PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});