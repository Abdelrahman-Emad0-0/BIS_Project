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
# Windows (Command Prompt):
copy .env.example .env
# Mac / Linux:
# cp .env.example .env

# Generate app key
php artisan key:generate
```

If your MySQL root password is not empty, open `.env` and set `DB_PASSWORD=your_password`.

#### Option A — No MySQL installed? Run the setup script (easiest)

Double-click `setup_database.bat` inside the `Backend` folder, or run it in CMD:

```
setup_database.bat
```

This switches the app to SQLite (no MySQL needed), runs all migrations, and seeds the data automatically.

#### Option B — Have MySQL installed? Import the full database

```bash
# Windows (CMD) — from the Backend folder:
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p < database\full_dump.sql

# Mac / Linux:
mysql -u root -p < database/full_dump.sql
```

This loads all real data: users, courses, enrollments, payments, and everything else.

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
# Windows (Command Prompt):
copy .env.example .env.local
# Mac / Linux:
# cp .env.example .env.local
# Already points to http://localhost:8000/api — no changes needed for local dev
```

Start the frontend dev server:

```bash
npm run dev
# Runs at http://localhost:3000
```

---

## Running on two separate machines

If one person runs the backend and another runs the frontend on different laptops:

**Both must be on the same WiFi network.**

### Backend machine

1. Find your local IP (Windows: `ipconfig`, Mac/Linux: `ifconfig`) — e.g. `192.168.1.42`
2. In `Backend/.env`, set `FRONTEND_URL` to the frontend machine's IP:
   ```
   FRONTEND_URL=http://192.168.1.XX:3000
   ```
3. Start Laravel bound to all interfaces:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

### Frontend machine

1. In `Frontend/.env.local`, point to the backend machine's IP:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.42:8000/api
   ```
2. Start normally:
   ```bash
   npm run dev
   ```

### Different networks (different homes)?

The backend person needs [ngrok](https://ngrok.com):
```bash
ngrok http 8000
# Gets a public URL like https://abc123.ngrok.io
```
Then the frontend person sets:
```
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io/api
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
