# ===================================================================
# COMPREHENSIVE BACKEND FIX SCRIPT
# Fixes: Port conflicts, builds, and starts backend cleanly
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Comprehensive Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "SilentlyContinue"

# Step 1: Kill all processes on port 5160
Write-Host "[1/7] Clearing port 5160..." -ForegroundColor Yellow
$connections = Get-NetTCPConnection -LocalPort 5160 -ErrorAction SilentlyContinue
if ($connections) {
    $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  ? Stopped process: $pid" -ForegroundColor Green
        } catch {
            Write-Host "  ? Could not stop process: $pid" -ForegroundColor Yellow
        }
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ? Port 5160 is free" -ForegroundColor Green
}

# Step 2: Kill all dotnet processes (clean slate)
Write-Host "`n[2/7] Cleaning up dotnet processes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "ClinicSystemBackend" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  ? Cleanup complete" -ForegroundColor Green

# Step 3: Create wwwroot folder if missing
Write-Host "`n[3/7] Creating wwwroot folder..." -ForegroundColor Yellow
$wwwrootPath = "D:\clini -new_update\Backend\wwwroot"
if (-not (Test-Path $wwwrootPath)) {
    New-Item -Path $wwwrootPath -ItemType Directory -Force | Out-Null
    Write-Host "  ? Created wwwroot folder" -ForegroundColor Green
} else {
    Write-Host "  ? wwwroot folder exists" -ForegroundColor Green
}

# Step 4: Clean build artifacts
Write-Host "`n[4/7] Cleaning build artifacts..." -ForegroundColor Yellow
Set-Location "D:\clini -new_update\Backend"
dotnet clean --nologo | Out-Null
Write-Host "  ? Clean complete" -ForegroundColor Green

# Step 5: Restore packages
Write-Host "`n[5/7] Restoring packages..." -ForegroundColor Yellow
dotnet restore --nologo | Out-Null
Write-Host "  ? Restore complete" -ForegroundColor Green

# Step 6: Build
Write-Host "`n[6/7] Building backend..." -ForegroundColor Yellow
$buildResult = dotnet build --nologo 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ? Build successful" -ForegroundColor Green
} else {
    Write-Host "  ? Build failed" -ForegroundColor Red
    Write-Host $buildResult
    exit 1
}

# Step 7: Start backend in new window
Write-Host "`n[7/7] Starting backend..." -ForegroundColor Yellow
Write-Host ""

$startScript = @"
`$host.UI.RawUI.WindowTitle = 'Backend Server - Port 5160'
Write-Host ''
Write-Host '========================================' -ForegroundColor Green
Write-Host '  Backend Server Started' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
Write-Host '  URL: http://localhost:5160' -ForegroundColor Cyan
Write-Host '  Swagger: http://localhost:5160/swagger' -ForegroundColor Cyan
Write-Host '  Health: http://localhost:5160/health' -ForegroundColor Cyan
Write-Host ''
Write-Host '  Login: admin@clinic.com / Admin123!' -ForegroundColor Yellow
Write-Host ''
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Gray
Write-Host ''

cd 'D:\clini -new_update\Backend'
dotnet run --no-build
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $startScript

Start-Sleep -Seconds 8

# Verify backend started
Write-Host "Verifying backend started..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

try {
    $health = Invoke-WebRequest -Uri "http://localhost:5160/health" -TimeoutSec 5 -UseBasicParsing
    if ($health.StatusCode -eq 200) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ? Backend Started Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Backend:  http://localhost:5160" -ForegroundColor Cyan
        Write-Host "  Swagger:  http://localhost:5160/swagger" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  Next step: Start frontend with 'cd frontend; npm run dev'" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "? Backend is starting... Check the backend window" -ForegroundColor Yellow
    Write-Host "  It may take 10-15 seconds for first startup" -ForegroundColor Gray
    Write-Host ""
}

Set-Location "D:\clini -new_update"
