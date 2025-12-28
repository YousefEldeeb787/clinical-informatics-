# ===================================================================
# RESTART BACKEND - Quick Fix for Port Issues
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Restarting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any process using port 5160
Write-Host "[1/3] Clearing port 5160..." -ForegroundColor Yellow

$processes = Get-NetTCPConnection -LocalPort 5160 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  ? Stopped process: $pid" -ForegroundColor Green
        } catch {
            Write-Host "  ? Could not stop process: $pid" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  ? Port 5160 is free" -ForegroundColor Green
}

Write-Host ""

# Step 2: Wait a moment
Write-Host "[2/3] Waiting for port to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "  ? Ready" -ForegroundColor Green
Write-Host ""

# Step 3: Start backend
Write-Host "[3/3] Starting Backend Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Backend will start on: http://localhost:5160" -ForegroundColor Cyan
Write-Host "  Swagger UI: http://localhost:5160/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location Backend
dotnet run
