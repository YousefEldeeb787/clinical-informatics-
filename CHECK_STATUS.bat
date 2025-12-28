@echo off
cls
echo ================================================
echo   SURGERY CLINIC MANAGEMENT SYSTEM
echo   Current Status Check
echo ================================================
echo.

echo Checking Backend (Port 5160)...
curl -s http://localhost:5160/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is RUNNING on http://localhost:5160
) else (
    echo [ERROR] Backend is NOT responding
)

echo.
echo Checking Frontend (Port 5173)...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is RUNNING on http://localhost:5173
) else (
    echo [ERROR] Frontend is NOT responding
)

echo.
echo ================================================
echo   QUICK ACTIONS
echo ================================================
echo.
echo 1. Open Application:  http://localhost:5173
echo 2. Open Swagger:      http://localhost:5160/swagger
echo 3. Login:             admin@clinic.com / Admin123!
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:5173

echo.
echo Application opened in your default browser!
echo.
pause
