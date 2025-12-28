@echo off
cls
echo ========================================
echo   Surgery Clinic Management System
echo   Starting Application...
echo ========================================
echo.

REM Start Backend
echo [1/2] Starting Backend...
start "Backend Server" /D "%~dp0Backend" cmd /k "dotnet run"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend...
start "Frontend Server" /D "%~dp0frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   APPLICATION STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Login: admin@clinic.com / Admin123!
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:5173

echo.
echo Note: Keep the backend and frontend windows open!
echo Close those windows to stop the servers.
echo.
pause
