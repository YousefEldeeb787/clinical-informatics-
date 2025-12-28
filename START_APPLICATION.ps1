# ===================================
# Surgery Clinic - Complete Startup Script
# ===================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Surgery Clinic Management System" -ForegroundColor Cyan
Write-Host "  Starting Application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "[1/6] Checking Prerequisites..." -ForegroundColor Yellow

if (-not (Test-CommandExists "dotnet")) {
    Write-Host "ERROR: .NET SDK not found. Please install .NET 8.0 SDK" -ForegroundColor Red
    Write-Host "Download from: https://dotnet.microsoft.com/download" -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "node")) {
    Write-Host "ERROR: Node.js not found. Please install Node.js" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "? .NET SDK: " -NoNewline -ForegroundColor Green
dotnet --version
Write-Host "? Node.js: " -NoNewline -ForegroundColor Green
node --version
Write-Host "? npm: " -NoNewline -ForegroundColor Green
npm --version
Write-Host ""

# Check ports
Write-Host "[2/6] Checking Ports..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "WARNING: Port 5000 is already in use" -ForegroundColor Yellow
    Write-Host "Attempting to kill process..." -ForegroundColor Yellow
    $processId = (Get-NetTCPConnection -LocalPort 5000).OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

if ($port5173) {
    Write-Host "WARNING: Port 5173 is already in use" -ForegroundColor Yellow
    Write-Host "Attempting to kill process..." -ForegroundColor Yellow
    $processId = (Get-NetTCPConnection -LocalPort 5173).OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "? Ports 5000 and 5173 are available" -ForegroundColor Green
Write-Host ""

# Backend setup
Write-Host "[3/6] Setting up Backend..." -ForegroundColor Yellow
Push-Location Backend

Write-Host "  ? Restoring packages..." -ForegroundColor Cyan
$restoreOutput = dotnet restore 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to restore backend packages" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "  ? Building backend..." -ForegroundColor Cyan
$buildOutput = dotnet build --no-restore 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend build failed" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "? Backend ready" -ForegroundColor Green
Pop-Location
Write-Host ""

# Frontend setup
Write-Host "[4/6] Setting up Frontend..." -ForegroundColor Yellow
Push-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "  ? Installing dependencies (this may take a few minutes)..." -ForegroundColor Cyan
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} else {
    Write-Host "  ? Dependencies already installed" -ForegroundColor Cyan
}

Write-Host "? Frontend ready" -ForegroundColor Green
Pop-Location
Write-Host ""

# Start Backend
Write-Host "[5/6] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "  ? Backend will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "  ? Swagger UI: http://localhost:5000/swagger" -ForegroundColor Cyan

$backendJob = Start-Job -ScriptBlock {
    Set-Location "D:\clini -new_update\Backend"
    dotnet run
}

# Wait for backend to start
Write-Host "  ? Waiting for backend to start..." -ForegroundColor Cyan
$backendStarted = $false
$attempts = 0
$maxAttempts = 30

while (-not $backendStarted -and $attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempts++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendStarted = $true
        }
    } catch {
        # Backend not ready yet
    }
    
    if ($backendStarted) {
        Write-Host "? Backend started successfully!" -ForegroundColor Green
    } else {
        Write-Host "  ? Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
    }
}

if (-not $backendStarted) {
    Write-Host "ERROR: Backend failed to start within 60 seconds" -ForegroundColor Red
    Stop-Job $backendJob
    Remove-Job $backendJob
    exit 1
}
Write-Host ""

# Start Frontend
Write-Host "[6/6] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "  ? Frontend will run on http://localhost:5173" -ForegroundColor Cyan

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "D:\clini -new_update\frontend"
    npm run dev
}

# Wait for frontend to start
Write-Host "  ? Waiting for frontend to start..." -ForegroundColor Cyan
$frontendStarted = $false
$attempts = 0
$maxAttempts = 30

while (-not $frontendStarted -and $attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempts++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $frontendStarted = $true
        }
    } catch {
        # Frontend not ready yet
    }
    
    if ($frontendStarted) {
        Write-Host "? Frontend started successfully!" -ForegroundColor Green
    } else {
        Write-Host "  ? Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
    }
}

if (-not $frontendStarted) {
    Write-Host "WARNING: Frontend may still be starting..." -ForegroundColor Yellow
}
Write-Host ""

# Success message
Write-Host "========================================" -ForegroundColor Green
Write-Host "  APPLICATION STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:     http://localhost:5000" -ForegroundColor Cyan
Write-Host "Swagger UI:      http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "Frontend App:    http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Yellow
Write-Host "  Email:    admin@clinic.com" -ForegroundColor White
Write-Host "  Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Keep this PowerShell window open!" -ForegroundColor Yellow
Write-Host "Both servers are running in the background." -ForegroundColor Yellow
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  Backend:  Receive-Job $($backendJob.Id)" -ForegroundColor White
Write-Host "  Frontend: Receive-Job $($frontendJob.Id)" -ForegroundColor White
Write-Host ""
Write-Host "To stop the servers: Press Ctrl+C" -ForegroundColor Cyan
Write-Host ""

# Monitor jobs
try {
    Write-Host "Monitoring servers... (Press Ctrl+C to stop)" -ForegroundColor Gray
    Write-Host ""
    
    while ($true) {
        # Check if jobs are still running
        $backendRunning = (Get-Job -Id $backendJob.Id).State -eq "Running"
        $frontendRunning = (Get-Job -Id $frontendJob.Id).State -eq "Running"
        
        if (-not $backendRunning) {
            Write-Host "ERROR: Backend stopped unexpectedly!" -ForegroundColor Red
            Receive-Job $backendJob.Id
            break
        }
        
        if (-not $frontendRunning) {
            Write-Host "ERROR: Frontend stopped unexpectedly!" -ForegroundColor Red
            Receive-Job $frontendJob.Id
            break
        }
        
        Start-Sleep -Seconds 5
    }
} finally {
    # Cleanup
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "? Servers stopped" -ForegroundColor Green
}
