# Product Management System - Node.js + Docker

MVC-based product management application với authentication, session management, và Docker Compose setup.

## 📁 Project Structure

```
├── controllers/          # Business logic
│   ├── authController.js    # Authentication logic
│   └── productController.js # Product CRUD operations
├── models/              # Data models
│   ├── User.js            # User model with password hashing
│   └── Product.js         # Product model
├── routes/              # API routes
│   ├── auth.route.js       # Authentication routes
│   └── products.route.js   # Product routes
├── middleware/          # Custom middleware
│   └── auth.js            # Authentication middleware
├── views/               # EJS templates
│   ├── login.ejs
│   ├── register.ejs
│   ├── products.ejs
│   └── editProduct.ejs
├── db/
│   ├── db.js            # Database connection pool
│   └── init.sql         # Database initialization script
├── app.js               # Express app configuration
├── package.json         # Dependencies
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Multi-container setup
└── .env.example         # Environment template
```

## 🚀 Quick Start

### Without Docker (Local MySQL)

```bash
# 1. Install dependencies
npm install

# 2. Setup database (create shopdb manually)
# Create 'shopdb' database and run sql/init.sql

# 3. Create .env file
cp .env.example .env

# 4. Start server
npm start

# 5. Access at http://localhost:3000
```

### With Docker Compose

```bash
# 1. Make sure Docker is running

# 2. Build and start services
docker-compose up --build

# 3. Access at http://localhost:3000

# 4. Stop services
docker-compose down
```

## 🛠️ Features

✅ **User Authentication**
- Registration with email validation
- Login with bcrypt password hashing
- Session management with express-session
- Secure logout

✅ **Product Management**
- List products with search
- Add new products
- Edit existing products
- Delete products
- Search/filter functionality

✅ **MVC Architecture**
- Clear separation of concerns
- Models for data logic
- Controllers for business logic
- Routes for HTTP handlers
- Middleware for authentication

✅ **Docker Integration**
- Dockerfile for Node.js app
- Docker Compose for Node.js + MySQL
- Persistent MySQL volumes
- Health checks
- Environment configuration

## 📋 Default Credentials (After First Run)

```
Email: admin@example.com
Password: password123
(After registration)
```

## 🔧 Environment Variables

```env
NODE_ENV=development
NODE_PORT=3000
DB_HOST=mysql           # localhost if not using Docker
DB_PORT=3306
DB_USER=shopuser
DB_PASSWORD=root123
DB_NAME=shopdb
SESSION_SECRET=your-secret-key
```

## 📚 API Routes

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Register page
- `POST /auth/register` - Process registration
- `POST /auth/logout` - Logout

### Products (Protected - Requires Login)
- `GET /products` - List products
- `POST /products/add` - Add product
- `GET /products/edit/:id` - Edit form
- `POST /products/edit/:id` - Update product
- `POST /products/delete/:id` - Delete product

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v

# Execute command in app
docker-compose exec app npm install [package]

# Connect to MySQL
docker-compose exec mysql mysql -u shopuser -proot123 shopdb

# Database backup
docker-compose exec mysql mysqldump -u shopuser -proot123 shopdb > backup.sql
```

## 📖 Documentation

- [Docker Setup Guide](./DOCKER_SETUP.md)
- [Node.js vs Java Comparison](./COMPARISON_NODEJS_VS_JAVA.md)

## 🔒 Security Notes

- Change `SESSION_SECRET` in production
- Use HTTPS in production
- Enable cookie.secure = true for HTTPS
- Update passwords in .env
- Use environment variables for sensitive data
- Regular npm updates for security patches

## 🤝 Dependencies

- **express** - Web framework
- **express-session** - Session management
- **ejs** - Template engine
- **mysql2** - MySQL driver
- **bcrypt** - Password hashing
- **nodemon** - Development auto-reload

## 📝 Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🧪 Testing

```bash
# Manual testing
# 1. Register at http://localhost:3000/auth/register
# 2. Login at http://localhost:3000/auth/login
# 3. Manage products at http://localhost:3000/products
```

## 📄 License

ISC

## 👤 Author

Phạm Mai Duy (22002115)
