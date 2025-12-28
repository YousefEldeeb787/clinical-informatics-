# Quick Backend Verification Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Quick Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Health
Write-Host "Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5160/health" -TimeoutSec 3
    Write-Host "? Health: $health" -ForegroundColor Green
} catch {
    Write-Host "? Backend not responding" -ForegroundColor Red
    exit 1
}

# Test Login
Write-Host "`nTesting Login..." -ForegroundColor Yellow
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
    
    Write-Host "? Login successful" -ForegroundColor Green
    Write-Host "  User: $($auth.user.firstName) $($auth.user.lastName)" -ForegroundColor Cyan
    Write-Host "  Role: $($auth.role)" -ForegroundColor Cyan
    
    $token = $auth.token
} catch {
    Write-Host "? Login failed" -ForegroundColor Red
    exit 1
}

# Test Patients Endpoint
Write-Host "`nTesting Patients Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $patients = Invoke-RestMethod -Uri "http://localhost:5160/api/patients" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 5
    
    Write-Host "? Patients endpoint works" -ForegroundColor Green
    Write-Host "  Found: $(@($patients).Count) patients" -ForegroundColor Cyan
} catch {
    Write-Host "? Patients endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Rooms Endpoint
Write-Host "`nTesting Rooms Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $rooms = Invoke-RestMethod -Uri "http://localhost:5160/api/rooms" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 5
    
    Write-Host "? Rooms endpoint works" -ForegroundColor Green
    Write-Host "  Found: $(@($rooms).Count) rooms" -ForegroundColor Cyan
} catch {
    Write-Host "? Rooms endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ? Backend Verification Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend is operational at:" -ForegroundColor Cyan
Write-Host "  http://localhost:5160" -ForegroundColor White
Write-Host ""
