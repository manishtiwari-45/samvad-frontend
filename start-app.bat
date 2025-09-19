@echo off
title StellarHub - Starting Application
color 0A

echo.
echo ========================================
echo    🌟 StellarHub Application Startup 🌟
echo ========================================
echo.

echo [1/4] Checking Node.js and npm...
node --version
npm --version
echo.

echo [2/4] Installing/updating dependencies...
npm install
echo.

echo [3/4] Setting up environment...
if not exist .env.local (
    echo Creating .env.local from example...
    copy env.example .env.local
    echo Please edit .env.local with your configuration!
    echo.
)

echo [4/4] Starting StellarHub...
echo.
echo ✅ Application starting at http://localhost:5173
echo ✅ Backend should be running at http://localhost:8000
echo.
echo Press Ctrl+C to stop the application
echo.

npm run dev

pause
