@echo off
cls
color 0A
echo.
echo ========================================
echo   SURGERY CLINIC - SYSTEM STATUS
echo ========================================
echo.

echo [BACKEND SERVER]
netstat -an | findstr ":5160" >nul 2>&1
if %errorlevel% equ 0 (
    echo Status: RUNNING
    echo URL:    http://localhost:5160
    echo Swagger: http://localhost:5160/swagger
) else (
    echo Status: NOT RUNNING
    echo Action: Run "START.bat" to start servers
)

echo.
echo [FRONTEND SERVER]
netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo Status: RUNNING
    echo URL:    http://localhost:5173
) else (
    echo Status: NOT RUNNING
    echo Action: Run "START.bat" to start servers
)

echo.
echo ========================================
echo   CONFIGURATION
echo ========================================
echo.
echo Backend Port:   5160
echo Frontend Port:  5173
echo API Base URL:   http://localhost:5160
echo.
echo ========================================
echo   LOGIN CREDENTIALS
echo ========================================
echo.
echo Email:    admin@clinic.com
echo Password: Admin123!
echo.
echo ========================================
echo   QUICK ACTIONS
echo ========================================
echo.
echo 1. Press ENTER to open application
echo 2. Press S to open Swagger
echo 3. Press Q to quit
echo.
set /p choice="Your choice: "

if /i "%choice%"=="1" (
    echo.
    echo Opening application...
    start http://localhost:5173
    echo.
    echo IMPORTANT: Clear browser cache!
    echo Press Ctrl+Shift+Delete and clear cached files
    echo.
    pause
    exit
)

if /i "%choice%"=="S" (
    echo.
    echo Opening Swagger...
    start http://localhost:5160/swagger
    pause
    exit
)

if /i "%choice%"=="Q" (
    exit
)

echo.
pause
