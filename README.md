# BIS Project — LearnXchange

A full-stack learning platform built with **Laravel** (backend API) and **Next.js** (frontend).

## Requirements

- PHP >= 8.2 + Composer
- Node.js >= 18 + npm
- MySQL 8

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Abdelrahman-Emad0-0/BIS_Project.git
cd BIS_Project
```

### 2. Backend (Laravel)

```bash
cd Backend

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env

# Generate app key
php artisan key:generate
```

Open `.env` and make sure the database settings match your local MySQL:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=learn_x_change
DB_USERNAME=root
DB_PASSWORD=
```

Create the database in MySQL, then run migrations and seed:

```bash
# In MySQL: CREATE DATABASE learn_x_change;

php artisan migrate
php artisan db:seed
```

Start the backend server:

```bash
php artisan serve
# Runs at http://localhost:8000
```

---

### 3. Frontend (Next.js)

```bash
cd ../Frontend

# Install JS dependencies
npm install

# Copy and configure environment
cp .env.example .env.local
# .env.local already points to http://localhost:8000/api — no changes needed for local dev
```

Start the frontend dev server:

```bash
npm run dev
# Runs at http://localhost:3000
```

---

## Seed accounts

After running `php artisan db:seed`:

| Role    | Email                          | Password    |
|---------|-------------------------------|-------------|
| Teacher | teacher@learnxchange.com      | password123 |
| Admin   | admin@learnxchange.com        | password123 |
