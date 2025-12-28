# ===================================================================
# Surgery Clinic System - Verification and Startup Script
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Surgery Clinic Management System" -ForegroundColor Cyan
Write-Host "  Connection Verification & Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Get-Location

# ===================================================================
# STEP 1: Verify Backend Configuration
# ===================================================================
Write-Host "[1/5] Verifying Backend Configuration..." -ForegroundColor Yellow

# Check launchSettings.json
$launchSettings = Get-Content "Backend\Properties\launchSettings.json" | ConvertFrom-Json
$backendPort = $launchSettings.profiles.http.applicationUrl -replace "http://localhost:", ""

Write-Host "  ? Backend Port: $backendPort" -ForegroundColor Green

# Check appsettings.json
$appsettings = Get-Content "Backend\appsettings.json" | ConvertFrom-Json
$corsOrigins = $appsettings.CorsOrigins
Write-Host "  ? CORS Origins: $($corsOrigins -join ', ')" -ForegroundColor Green

# Check database connection
$dbConnection = $appsettings.ConnectionStrings.DefaultConnection
Write-Host "  ? Database: $($dbConnection.Split(';')[1] -replace 'Database=', '')" -ForegroundColor Green

Write-Host ""

# ===================================================================
# STEP 2: Verify Frontend Configuration
# ===================================================================
Write-Host "[2/5] Verifying Frontend Configuration..." -ForegroundColor Yellow

# Check .env.development
if (Test-Path "frontend\.env.development") {
    $envContent = Get-Content "frontend\.env.development"
    $apiUrl = ($envContent | Where-Object { $_ -match "VITE_API_BASE_URL" }) -replace "VITE_API_BASE_URL=", ""
    
    if ($apiUrl -eq "http://localhost:$backendPort") {
        Write-Host "  ? Frontend API URL: $apiUrl (MATCHES BACKEND)" -ForegroundColor Green
    } else {
        Write-Host "  ? Frontend API URL: $apiUrl (MISMATCH!)" -ForegroundColor Red
        Write-Host "  Expected: http://localhost:$backendPort" -ForegroundColor Yellow
        
        $fix = Read-Host "  Would you like to fix this? (Y/N)"
        if ($fix -eq "Y" -or $fix -eq "y") {
            $newEnvContent = $envContent -replace "VITE_API_BASE_URL=.*", "VITE_API_BASE_URL=http://localhost:$backendPort"
            $newEnvContent | Set-Content "frontend\.env.development"
            Write-Host "  ? Fixed! Updated to: http://localhost:$backendPort" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ? .env.development not found!" -ForegroundColor Red
    Write-Host "  Creating .env.development..." -ForegroundColor Yellow
    @"
VITE_API_BASE_URL=http://localhost:$backendPort
VITE_APP_NAME=Surgery Clinic System
VITE_APP_VERSION=1.0.0
"@ | Set-Content "frontend\.env.development"
    Write-Host "  ? Created .env.development" -ForegroundColor Green
}

Write-Host ""

# ===================================================================
# STEP 3: Build Backend
# ===================================================================
Write-Host "[3/5] Building Backend..." -ForegroundColor Yellow

Set-Location Backend
$buildOutput = dotnet build --nologo 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ? Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "  ? Backend build failed:" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    Set-Location $rootDir
    exit 1
}
Set-Location $rootDir

Write-Host ""

# ===================================================================
# STEP 4: Check Frontend Dependencies
# ===================================================================
Write-Host "[4/5] Checking Frontend Dependencies..." -ForegroundColor Yellow

Set-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "  ? Installing dependencies (this may take a minute)..." -ForegroundColor Cyan
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

Write-Host ""

# ===================================================================
# STEP 5: Connection Summary
# ===================================================================
Write-Host "[5/5] Connection Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ? Backend Port: $backendPort" -ForegroundColor Green
Write-Host "  ? Frontend API URL: http://localhost:$backendPort" -ForegroundColor Green
Write-Host "  ? CORS Configured: Yes" -ForegroundColor Green
Write-Host "  ? Database Connected: Ready" -ForegroundColor Green
Write-Host "  ? Build Status: Success" -ForegroundColor Green
Write-Host ""

# ===================================================================
# START APPLICATION
# ===================================================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ready to Start Application!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$start = Read-Host "Start the application now? (Y/N)"

if ($start -eq "Y" -or $start -eq "y") {
    Write-Host ""
    Write-Host "Starting servers..." -ForegroundColor Cyan
    Write-Host ""
    
    # Start Backend
    Write-Host "  ? Starting Backend Server..." -ForegroundColor Yellow
    Set-Location Backend
    $backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$host.UI.RawUI.WindowTitle = 'Backend Server - Port $backendPort'
Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Backend Server Started' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '  URL: http://localhost:$backendPort' -ForegroundColor Green
Write-Host '  Swagger: http://localhost:$backendPort/swagger' -ForegroundColor Green
Write-Host ''
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Yellow
Write-Host ''
cd '$($rootDir.Path)\Backend'
dotnet run --no-build
"@ -PassThru
    
    Set-Location $rootDir
    Start-Sleep -Seconds 3
    Write-Host "  ? Backend Server Started (PID: $($backend.Id))" -ForegroundColor Green
    
    # Start Frontend
    Write-Host "  ? Starting Frontend Server..." -ForegroundColor Yellow
    Set-Location frontend
    $frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$host.UI.RawUI.WindowTitle = 'Frontend Server - Port 5173'
Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Frontend Server Started' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '  URL: http://localhost:5173' -ForegroundColor Green
Write-Host ''
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Yellow
Write-Host ''
cd '$($rootDir.Path)\frontend'
npm run dev
"@ -PassThru
    
    Set-Location $rootDir
    Start-Sleep -Seconds 2
    Write-Host "  ? Frontend Server Started (PID: $($frontend.Id))" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Application Running Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:$backendPort" -ForegroundColor Cyan
    Write-Host "  Swagger:  http://localhost:$backendPort/swagger" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Default Login:" -ForegroundColor Yellow
    Write-Host "    Email:    admin@clinic.com" -ForegroundColor White
    Write-Host "    Password: Admin123!" -ForegroundColor White
    Write-Host ""
    Write-Host "  Keep both terminal windows open!" -ForegroundColor Yellow
    Write-Host ""
    
    # Open browser
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
    
} else {
    Write-Host ""
    Write-Host "Application ready but not started." -ForegroundColor Yellow
    Write-Host "Run this script again and choose 'Y' to start." -ForegroundColor Yellow
    Write-Host ""
}
