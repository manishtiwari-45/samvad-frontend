@echo off
echo Testing SAMVAD Frontend...
echo.

echo Checking Node.js version...
node --version
echo.

echo Checking npm version...
npm --version
echo.

echo Installing dependencies (if needed)...
npm install
echo.

echo Running build test...
npm run build
echo.

echo Build test completed!
echo.

echo Starting development server...
echo Press Ctrl+C to stop the server
npm run dev
