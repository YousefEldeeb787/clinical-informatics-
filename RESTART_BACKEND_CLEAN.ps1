#!/usr/bin/env pwsh
# Script to cleanly restart the backend by killing port conflicts

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Backend Clean Restart Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Kill process on port 5160
Write-Host "1. Checking for processes on port 5160..." -ForegroundColor Yellow
$port = 5160
$connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connection) {
    Write-Host "   Found process using port $port. Killing it..." -ForegroundColor Red
    Stop-Process -Id $connection.OwningProcess -Force
    Write-Host "   ? Process killed" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "   ? Port $port is free" -ForegroundColor Green
}

# Kill any stray dotnet backend processes
Write-Host ""
Write-Host "2. Checking for stray backend processes..." -ForegroundColor Yellow
$backendProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object { 
    $_.Path -like "*Backend*" 
}

if ($backendProcesses) {
    Write-Host "   Found backend processes. Killing them..." -ForegroundColor Red
    $backendProcesses | Stop-Process -Force
    Write-Host "   ? Backend processes killed" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "   ? No stray processes found" -ForegroundColor Green
}

# Start the backend
Write-Host ""
Write-Host "3. Starting backend..." -ForegroundColor Yellow
Write-Host ""
Set-Location "D:\clini -new_update\Backend"
dotnet run
