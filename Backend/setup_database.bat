@echo off
echo =============================================
echo   LearnXchange - Database Setup (No MySQL)
echo =============================================
echo.

REM Must be run from the Backend folder
if not exist ".env" (
    echo ERROR: .env not found.
    echo Run this first:  copy .env.example .env
    echo Then run:        php artisan key:generate
    echo Then run this script again.
    pause
    exit /b 1
)

echo Switching to SQLite (no MySQL needed)...
powershell -Command "(Get-Content .env) -replace 'DB_CONNECTION=mysql', 'DB_CONNECTION=sqlite' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_HOST',     '#DB_HOST'     | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_PORT',     '#DB_PORT'     | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_DATABASE', '#DB_DATABASE' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_USERNAME', '#DB_USERNAME' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_PASSWORD', '#DB_PASSWORD' | Set-Content .env"

echo Creating SQLite database file...
type nul > database\database.sqlite

echo Running migrations...
php artisan migrate --force
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Migration failed. Make sure PHP is installed and composer install was run.
    pause
    exit /b 1
)

echo Running seeders...
php artisan db:seed --force
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Seeding failed.
    pause
    exit /b 1
)

echo.
echo =============================================
echo   Done! Database is ready.
echo   Now run:  php artisan serve
echo =============================================
pause
