# Surgery Clinic System - Setup Script
# This script sets up both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Surgery Clinic System - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check .NET SDK
try {
    $dotnetVersion = dotnet --version
    Write-Host "? .NET SDK installed: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "? .NET SDK not found. Please install .NET 8.0 SDK" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "? Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "? Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend setup
Set-Location "Backend"

Write-Host "Restoring NuGet packages..." -ForegroundColor Yellow
dotnet restore

Write-Host "Building backend..." -ForegroundColor Yellow
dotnet build

Write-Host ""
Write-Host "Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To apply database migrations, run:" -ForegroundColor Yellow
Write-Host "  cd Backend" -ForegroundColor White
Write-Host "  dotnet ef database update" -ForegroundColor White
Write-Host ""

# Frontend setup
Set-Location "../frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing npm packages..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to root
Set-Location ".."

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update database connection string in Backend/appsettings.json" -ForegroundColor White
Write-Host "  2. Run migrations: cd Backend; dotnet ef database update" -ForegroundColor White
Write-Host "  3. Start backend: cd Backend; dotnet run" -ForegroundColor White
Write-Host "  4. Start frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "API will be at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
