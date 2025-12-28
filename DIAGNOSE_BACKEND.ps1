# ===================================================================
# BACKEND DIAGNOSTIC & FIX SCRIPT
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Diagnostic & Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Summary of Issues Found and Fixed
Write-Host "=== ISSUES FOUND AND FIXED ===" -ForegroundColor Yellow
Write-Host ""

Write-Host "? IAuthService Registration Missing" -ForegroundColor Green
Write-Host "  Fixed: Added builder.Services.AddScoped<IAuthService, AuthService>() to Program.cs" -ForegroundColor White
Write-Host ""

Write-Host "? Patients Endpoint Returning 500 Error" -ForegroundColor Yellow
Write-Host "  This indicates a runtime error in PatientService or PatientsController" -ForegroundColor White
Write-Host "  Common causes:" -ForegroundColor Cyan
Write-Host "    - Database connection issue" -ForegroundColor White
Write-Host "    - Missing data in database" -ForegroundColor White
Write-Host "    - Null reference in service logic" -ForegroundColor White
Write-Host "    - AutoMapper configuration missing" -ForegroundColor White
Write-Host ""

# Check Backend Status
Write-Host "=== CURRENT STATUS ===" -ForegroundColor Yellow
Write-Host ""

$backendRunning = Get-NetTCPConnection -LocalPort 5160 -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "? Backend Process Running (Port 5160)" -ForegroundColor Green
    Write-Host "  PID: $($backendRunning.OwningProcess | Select-Object -First 1)" -ForegroundColor Cyan
} else {
    Write-Host "? Backend Not Running" -ForegroundColor Red
}

Write-Host ""

# Test Health Endpoint
Write-Host "Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5160/health" -TimeoutSec 3
    Write-Host "? Health: $health" -ForegroundColor Green
} catch {
    Write-Host "? Health check failed" -ForegroundColor Red
}

Write-Host ""

# Test Login
Write-Host "Testing Login Endpoint..." -ForegroundColor Cyan
try {
    $loginBody = @{
        email = "admin@clinic.com"
        password = "Admin123!"
    } | ConvertTo-Json
    
    $auth = Invoke-RestMethod -Uri "http://localhost:5160/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -TimeoutSec 5
    
    Write-Host "? Login works - Token received" -ForegroundColor Green
    $token = $auth.token
} catch {
    Write-Host "? Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Please check backend console for details" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test Patients Endpoint
Write-Host "Testing Patients Endpoint..." -ForegroundColor Cyan
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $patients = Invoke-RestMethod -Uri "http://localhost:5160/api/patients" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 5
    
    Write-Host "? Patients endpoint works" -ForegroundColor Green
    Write-Host "  Found: $(@($patients).Count) patients" -ForegroundColor Cyan
} catch {
    Write-Host "? Patients endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "`n  Error Details:" -ForegroundColor Yellow
        try {
            $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "    $($errorObj | ConvertTo-Json -Depth 3)" -ForegroundColor White
        } catch {
            Write-Host "    $($_.ErrorDetails.Message)" -ForegroundColor White
        }
    }
    
    Write-Host "`n  Possible causes:" -ForegroundColor Cyan
    Write-Host "    1. Database connection issue" -ForegroundColor White
    Write-Host "    2. PatientService initialization error" -ForegroundColor White
    Write-Host "    3. Missing AutoMapper profile" -ForegroundColor White
    Write-Host "    4. Missing data in Patients table" -ForegroundColor White
    Write-Host ""
    Write-Host "  Check the Backend PowerShell window for detailed error stack trace" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Diagnostic Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check Backend PowerShell window for error details" -ForegroundColor White
Write-Host "2. Verify database connection in appsettings.json" -ForegroundColor White
Write-Host "3. Check if Patients table has data: SELECT * FROM Patients" -ForegroundColor White
Write-Host "4. Verify AutoMapper profiles are configured" -ForegroundColor White
Write-Host ""
