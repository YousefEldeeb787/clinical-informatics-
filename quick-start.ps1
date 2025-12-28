# ===================================================================
# Quick Start Script - Surgery Clinic System
# ===================================================================
# Simple script to start both servers quickly
# ===================================================================

Write-Host ""
Write-Host "?? Starting Surgery Clinic System..." -ForegroundColor Cyan
Write-Host ""

# Get root directory
$rootDir = Get-Location

# Start Backend
Write-Host "?? Starting Backend (http://localhost:5000)..." -ForegroundColor Yellow
$backendScript = @"
`$host.UI.RawUI.WindowTitle = 'Backend Server - Port 5000'
`$host.UI.RawUI.BackgroundColor = 'DarkBlue'
`$host.UI.RawUI.ForegroundColor = 'White'
Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Running on: http://localhost:5000" -ForegroundColor Green
Write-Host "  Swagger UI: http://localhost:5000/swagger" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Set-Location '$($rootDir.Path)\Backend'
dotnet run
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "?? Starting Frontend (http://localhost:5173)..." -ForegroundColor Yellow
$frontendScript = @"
`$host.UI.RawUI.WindowTitle = 'Frontend Server - Port 5173'
`$host.UI.RawUI.BackgroundColor = 'DarkGreen'
`$host.UI.RawUI.ForegroundColor = 'White'
Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FRONTEND SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Running on: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
Set-Location '$($rootDir.Path)\frontend'
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "? Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Access Points:" -ForegroundColor Cyan
Write-Host "   • Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   • Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   • Swagger:   http://localhost:5000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "?? Default Login:" -ForegroundColor Cyan
Write-Host "   Email:    admin@clinic.com" -ForegroundColor White
Write-Host "   Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "?? Two terminal windows have been opened:" -ForegroundColor Yellow
Write-Host "   • Blue window = Backend" -ForegroundColor Blue
Write-Host "   • Green window = Frontend" -ForegroundColor Green
Write-Host ""
Write-Host "?  Close those windows or press Ctrl+C to stop servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
