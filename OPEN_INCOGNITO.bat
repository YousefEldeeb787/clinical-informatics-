@echo off
cls
echo ========================================
echo   OPEN APP IN INCOGNITO MODE
echo   (No Cache - Will Work Immediately!)
echo ========================================
echo.

echo Opening Chrome in Incognito mode...
start chrome.exe --incognito http://localhost:5173
timeout /t 2 /nobreak >nul

if errorlevel 1 (
    echo Chrome not found, trying Edge...
    start msedge.exe --inprivate http://localhost:5173
    timeout /t 2 /nobreak >nul
)

if errorlevel 1 (
    echo Edge not found, trying Firefox...
    start firefox.exe -private-window http://localhost:5173
    timeout /t 2 /nobreak >nul
)

echo.
echo ========================================
echo   INCOGNITO MODE OPENED!
echo ========================================
echo.
echo This window has NO CACHE.
echo The app should work immediately!
echo.
echo Login: admin@clinic.com / Admin123!
echo.
echo ========================================
echo   IMPORTANT NOTES
echo ========================================
echo.
echo * If it works here, the problem is cache
echo * Clear your regular browser cache
echo * Press Ctrl+Shift+Delete
echo * Select "Cached images and files"
echo * Click Clear
echo.
pause
