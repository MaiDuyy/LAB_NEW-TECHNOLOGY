# Docker Setup Guide

## Yêu Cầu

- Docker Desktop hoặc Docker Engine
- Docker Compose

## Quick Start

### 1. **Chuẩn Bị Môi Trường**

```bash
# Copy file cấu hình
cp .env.example .env

# (Optional) Chỉnh sửa .env nếu cần
# nano .env
```

### 2. **Khởi Động Services**

```bash
# Build và khởi động tất cả services
docker-compose up --build

# Hoặc chạy nền
docker-compose up -d --build
```

### 3. **Kiểm Tra Status**

```bash
# Xem running containers
docker-compose ps

# Xem logs
docker-compose logs -f app
docker-compose logs -f mysql

# Xem logs của app
docker-compose logs app
```

### 4. **Truy Cập Ứng Dụng**

```
http://localhost:3000
```

## Database Access

### Từ Node.js App
```javascript
// Tự động kết nối qua docker-compose network
const pool = mysql.createPool({
  host: 'mysql',     // Service name in docker-compose.yml
  user: 'shopuser',
  password: 'root123',
  database: 'shopdb'
});
```

### Từ Local Machine

```bash
# Connect directly to MySQL container
mysql -h localhost -u shopuser -p shopdb
# Password: root123

# Or use GUI tool
# Host: localhost:3306
# User: shopuser
# Password: root123
# Database: shopdb
```

## Các Lệnh Hữu Ích

```bash
# Dừng services
docker-compose down

# Dừng + xoá volumes (reset database)
docker-compose down -v

# Rebuild services
docker-compose build

# Chạy command trong container
docker-compose exec app npm install [package-name]
docker-compose exec mysql bash

# View container logs
docker-compose logs app
docker-compose logs mysql

# Shell access vào app container
docker-compose exec app sh

# Restart specific service
docker-compose restart app
docker-compose restart mysql
```

## Troubleshooting

### Port already in use
```bash
# Đổi port trong .env hoặc docker-compose.yml
NODE_PORT=3001
DB_PORT=3307
```

### Database connection refused
```bash
# Kiểm tra MySQL đã sẵn sàng
docker-compose logs mysql

# Chờ MySQL hoàn toàn khởi động
docker-compose exec mysql mysqladmin ping -u root -proot123
```

### Permission denied
```bash
# Linux: fix volume permissions
docker-compose down -v
docker-compose up -d --build
```

## Cấu Trúc Mạng

```
┌──────────────────────────────────────┐
│        Docker Network                 │
│     (shop-network bridge)             │
│                                       │
│  ┌──────────────────┐                │
│  │   Node.js App    │                │
│  │ (app:3000)       │◄───── Client  │
│  └────────┬─────────┘       (3000)  │
│           │                          │
│           │ (TCP)                    │
│           │                          │
│  ┌────────▼─────────┐                │
│  │   MySQL Server   │                │
│  │ (mysql:3306)     │◄────── Local   │
│  └──────────────────┘       (3306)  │
│                                       │
└──────────────────────────────────────┘
```

## Environment Variables

### .env file

```env
# Node.js Configuration
NODE_ENV=development
NODE_PORT=3000

# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USER=shopuser
DB_PASSWORD=root123
DB_NAME=shopdb

# Session
SESSION_SECRET=your-secret-key-here
```

## Volumes

```yaml
mysql_data:          # Persistent MySQL data
  - Survives container restart
  - Located at /var/lib/docker/volumes/...

app (bind mount):    # Live code reloading
  - Syncs local files with container
  - Great for development
```

## Production Deployment

### Sửa docker-compose.yml cho Production:

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
    restart: always
    # Remove volume bind mount để cố định code

  mysql:
    environment:
      - MYSQL_ROOT_PASSWORD=${SECURE_PASSWORD}
    restart: always
```

### Build & Push to Registry:

```bash
docker build -t username/node-shop:1.0 .
docker push username/node-shop:1.0

# Then use in docker-compose:
# image: username/node-shop:1.0
```

## Monitoring

```bash
# Resource usage
docker stats

# Container logs with timestamps
docker-compose logs --timestamps

# Real-time logs follow
docker-compose logs -f
```

## Backup & Restore

```bash
# Backup database
docker-compose exec mysql mysqldump -u shopuser -proot123 shopdb > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u shopuser -proot123 shopdb < backup.sql
```
