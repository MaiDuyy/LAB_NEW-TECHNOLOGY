import express from "express"
import productRoutes from "./routes/products.route.js"
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use('/', productRoutes);

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});