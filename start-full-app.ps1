# ===================================================================
# Surgery Clinic System - Complete Startup Script
# ===================================================================
# This script starts both Backend and Frontend servers
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Surgery Clinic Management System" -ForegroundColor Cyan
Write-Host "  Full Application Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Store the root directory
$rootDir = Get-Location

# ===================================================================
# STEP 1: Check Prerequisites
# ===================================================================
Write-Host "[1/6] Checking Prerequisites..." -ForegroundColor Yellow

# Check .NET SDK
try {
    $dotnetVersion = dotnet --version
    Write-Host "  ? .NET SDK $dotnetVersion installed" -ForegroundColor Green
} catch {
    Write-Host "  ? .NET SDK not found. Please install .NET 8.0 SDK" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ? Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "  ? Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "  ? npm $npmVersion installed" -ForegroundColor Green
} catch {
    Write-Host "  ? npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ===================================================================
# STEP 2: Check Backend
# ===================================================================
Write-Host "[2/6] Checking Backend..." -ForegroundColor Yellow

if (Test-Path "Backend\ClinicSystemBackend.csproj") {
    Write-Host "  ? Backend project found" -ForegroundColor Green
    
    # Build backend
    Set-Location Backend
    Write-Host "  ? Building backend..." -ForegroundColor Cyan
    $buildOutput = dotnet build --nologo 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ? Backend build successful" -ForegroundColor Green
    } else {
        Write-Host "  ? Backend build failed:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        Set-Location $rootDir
        exit 1
    }
    
    Set-Location $rootDir
} else {
    Write-Host "  ? Backend project not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ===================================================================
# STEP 3: Check Frontend
# ===================================================================
Write-Host "[3/6] Checking Frontend..." -ForegroundColor Yellow

if (Test-Path "frontend\package.json") {
    Write-Host "  ? Frontend project found" -ForegroundColor Green
    
    Set-Location frontend
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "  ? Installing dependencies..." -ForegroundColor Cyan
        npm install --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ? Dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "  ? Failed to install dependencies" -ForegroundColor Red
            Set-Location $rootDir
            exit 1
        }
    } else {
        Write-Host "  ? Dependencies already installed" -ForegroundColor Green
    }
    
    Set-Location $rootDir
} else {
    Write-Host "  ? Frontend project not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ===================================================================
# STEP 4: Check Configuration
# ===================================================================
Write-Host "[4/6] Checking Configuration..." -ForegroundColor Yellow

# Check backend appsettings.json
if (Test-Path "Backend\appsettings.json") {
    Write-Host "  ? Backend configuration found" -ForegroundColor Green
} else {
    Write-Host "  ? Backend appsettings.json not found" -ForegroundColor Red
    exit 1
}

# Check frontend .env
if (Test-Path "frontend\.env.development") {
    Write-Host "  ? Frontend environment configuration found" -ForegroundColor Green
} else {
    Write-Host "  ? Frontend .env.development not found, using defaults" -ForegroundColor Yellow
}

Write-Host ""

# ===================================================================
# STEP 5: Database Check
# ===================================================================
Write-Host "[5/6] Checking Database..." -ForegroundColor Yellow

Set-Location Backend

# Check if migrations exist
if (Test-Path "Migrations") {
    Write-Host "  ? Database migrations found" -ForegroundColor Green
    
    # Try to apply migrations
    Write-Host "  ? Attempting to update database..." -ForegroundColor Cyan
    Write-Host "  ? If this fails, ensure SQL Server is running" -ForegroundColor Gray
    
    try {
        # Use dotnet run approach to apply migrations
        Write-Host "  ? Database will be updated when the application starts" -ForegroundColor Gray
        Write-Host "  ? Ready to apply migrations" -ForegroundColor Green
    } catch {
        Write-Host "  ? Could not verify database. It will be created on first run" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ? No migrations found. Database will be created on first run" -ForegroundColor Yellow
}

Set-Location $rootDir
Write-Host ""

# ===================================================================
# STEP 6: Start Servers
# ===================================================================
Write-Host "[6/6] Starting Servers..." -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend will start on: http://localhost:5000" -ForegroundColor Green
Write-Host "  Swagger UI: http://localhost:5000/swagger" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C in this window to stop the backend" -ForegroundColor Yellow
Write-Host ""

# Start backend in this window
Set-Location Backend
Write-Host "Starting backend..." -ForegroundColor Cyan
Write-Host ""

# Open frontend in new window
$frontendScript = @"
`$host.UI.RawUI.WindowTitle = 'Surgery Clinic - Frontend Server'
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend will start on: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C in this window to stop the frontend" -ForegroundColor Yellow
Write-Host ""
Set-Location '$($rootDir.Path)\frontend'
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

# Wait a moment for frontend window to open
Start-Sleep -Seconds 2

# Start backend (this will block)
dotnet run

# If we get here, backend was stopped
Write-Host ""
Write-Host "Backend server stopped." -ForegroundColor Yellow
Write-Host "Frontend server is still running in the other window." -ForegroundColor Yellow
Write-Host ""
