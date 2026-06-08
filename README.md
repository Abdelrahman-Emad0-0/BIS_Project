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

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate
```

If your MySQL root password is not empty, open `.env` and set `DB_PASSWORD=your_password`.

#### Import the full database (recommended — gets all real data)

```bash
mysql -u root -p < database/full_dump.sql
```

This creates the `learn_x_change` database and loads all tables, users, courses, enrollments, payments, and everything else.

> **Alternative (empty database + seed only):**
> ```bash
> # In MySQL: CREATE DATABASE learn_x_change;
> php artisan migrate
> php artisan db:seed
> ```

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

# Copy environment file
cp .env.example .env.local
# Already points to http://localhost:8000/api — no changes needed for local dev
```

Start the frontend dev server:

```bash
npm run dev
# Runs at http://localhost:3000
```

---

## Test accounts

All passwords are `password123`

| Role    | Email                          | Password    |
|---------|-------------------------------|-------------|
| Teacher | teacher@learnxchange.com      | password123 |
| Admin   | admin@learnxchange.com        | password123 |
| Learner | ahmedheyia@gmail.com          | password123 |
| Both    | exchange@learnxchange.com     | password123 |
