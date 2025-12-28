# ===================================================================
# Test Application Script - Surgery Clinic System
# ===================================================================
# Tests the connection between frontend and backend
# ===================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ===================================================================
# Test 1: Backend Health Check
# ===================================================================
Write-Host "[Test 1] Testing Backend Health..." -ForegroundColor Yellow

try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method Get -TimeoutSec 5
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "  ? Backend is running and healthy" -ForegroundColor Green
        Write-Host "    Response: $($healthCheck.Content)" -ForegroundColor Gray
    } else {
        Write-Host "  ? Backend returned status: $($healthCheck.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ? Backend is not responding" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "    ?? Make sure the backend is running:" -ForegroundColor Yellow
    Write-Host "       cd Backend" -ForegroundColor White
    Write-Host "       dotnet run" -ForegroundColor White
    Write-Host ""
}

Write-Host ""

# ===================================================================
# Test 2: Frontend Check
# ===================================================================
Write-Host "[Test 2] Testing Frontend..." -ForegroundColor Yellow

try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 5
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "  ? Frontend is running" -ForegroundColor Green
    } else {
        Write-Host "  ? Frontend returned status: $($frontendCheck.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ? Frontend is not responding" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "    ?? Make sure the frontend is running:" -ForegroundColor Yellow
    Write-Host "       cd frontend" -ForegroundColor White
    Write-Host "       npm run dev" -ForegroundColor White
    Write-Host ""
}

Write-Host ""

# ===================================================================
# Test 3: API Login Test
# ===================================================================
Write-Host "[Test 3] Testing API Login Endpoint..." -ForegroundColor Yellow

try {
    $loginBody = @{
        email = "admin@clinic.com"
        password = "Admin123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -TimeoutSec 10
    
    if ($loginResponse.token) {
        Write-Host "  ? Login successful!" -ForegroundColor Green
        Write-Host "    User: $($loginResponse.user.firstName) $($loginResponse.user.lastName)" -ForegroundColor Gray
        Write-Host "    Role: $($loginResponse.role)" -ForegroundColor Gray
        Write-Host "    Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Gray
        
        $token = $loginResponse.token
        
        Write-Host ""
        
        # ===================================================================
        # Test 4: Authenticated API Call
        # ===================================================================
        Write-Host "[Test 4] Testing Authenticated API Call..." -ForegroundColor Yellow
        
        try {
            $headers = @{
                "Authorization" = "Bearer $token"
            }
            
            $patientsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/patients" -Method Get -Headers $headers -TimeoutSec 10
            
            Write-Host "  ? Successfully fetched patients" -ForegroundColor Green
            Write-Host "    Total patients: $($patientsResponse.totalCount)" -ForegroundColor Gray
            
            if ($patientsResponse.items -and $patientsResponse.items.Count -gt 0) {
                Write-Host "    First patient: $($patientsResponse.items[0].firstName) $($patientsResponse.items[0].lastName)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "  ? Failed to fetch patients" -ForegroundColor Red
            Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
        }
        
    } else {
        Write-Host "  ? Login failed - no token received" -ForegroundColor Red
    }
} catch {
    Write-Host "  ? Login request failed" -ForegroundColor Red
    Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Gray
    
    if ($_.Exception.Message -like "*404*") {
        Write-Host ""
        Write-Host "    ?? The login endpoint may not exist. Check:" -ForegroundColor Yellow
        Write-Host "       Backend/Controllers/AuthController.cs" -ForegroundColor White
    }
}

Write-Host ""

# ===================================================================
# Test 5: Database Connection
# ===================================================================
Write-Host "[Test 5] Checking Database Configuration..." -ForegroundColor Yellow

if (Test-Path "Backend\appsettings.json") {
    $appsettings = Get-Content "Backend\appsettings.json" | ConvertFrom-Json
    $connectionString = $appsettings.ConnectionStrings.DefaultConnection
    
    if ($connectionString) {
        Write-Host "  ? Connection string found" -ForegroundColor Green
        
        # Extract server name
        if ($connectionString -match "Server=([^;]+)") {
            $serverName = $matches[1]
            Write-Host "    Server: $serverName" -ForegroundColor Gray
        }
        
        # Extract database name
        if ($connectionString -match "Database=([^;]+)") {
            $databaseName = $matches[1]
            Write-Host "    Database: $databaseName" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ? No connection string found" -ForegroundColor Red
    }
} else {
    Write-Host "  ? appsettings.json not found" -ForegroundColor Red
}

Write-Host ""

# ===================================================================
# Test 6: CORS Configuration
# ===================================================================
Write-Host "[Test 6] Checking CORS Configuration..." -ForegroundColor Yellow

if (Test-Path "Backend\appsettings.json") {
    $appsettings = Get-Content "Backend\appsettings.json" | ConvertFrom-Json
    $corsOrigins = $appsettings.CorsOrigins
    
    if ($corsOrigins) {
        Write-Host "  ? CORS origins configured" -ForegroundColor Green
        foreach ($origin in $corsOrigins) {
            $symbol = if ($origin -eq "http://localhost:5173") { "?" } else { " " }
            $color = if ($origin -eq "http://localhost:5173") { "Green" } else { "Gray" }
            Write-Host "    $symbol $origin" -ForegroundColor $color
        }
    } else {
        Write-Host "  ? No CORS origins found" -ForegroundColor Yellow
    }
}

Write-Host ""

# ===================================================================
# Summary
# ===================================================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "? All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open browser: http://localhost:5173" -ForegroundColor White
Write-Host "   2. Login with: admin@clinic.com / Admin123!" -ForegroundColor White
Write-Host "   3. Start using the application!" -ForegroundColor White
Write-Host ""
Write-Host "?? Documentation:" -ForegroundColor Cyan
Write-Host "   • FRONTEND_BACKEND_INTEGRATION.md" -ForegroundColor White
Write-Host "   • STARTUP_TESTING_GUIDE.md" -ForegroundColor White
Write-Host "   • INTEGRATION_COMPLETE_SUMMARY.md" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
