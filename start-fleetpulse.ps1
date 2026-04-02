# FleetPulse - One-click launcher
# Starts C# ASP.NET Core API + React frontend in separate terminal windows

Write-Host ""
Write-Host "  FLEETPULSE" -ForegroundColor Blue
Write-Host ""
Write-Host "  IoT Fleet Telemetry Platform - Powerfleet Demo" -ForegroundColor Cyan
Write-Host ""

$apiPath = Join-Path $PSScriptRoot "FleetPulse.Api"
$frontendPath = Join-Path $PSScriptRoot "fleetpulse-frontend"

if (-not (Test-Path $apiPath)) {
    Write-Host "  [ERROR] FleetPulse.Api not found at: $apiPath" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $frontendPath)) {
    Write-Host "  [ERROR] fleetpulse-frontend not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "  Starting C# ASP.NET Core API on http://localhost:5112 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiPath'; Write-Host 'FleetPulse API' -ForegroundColor Blue; dotnet run --launch-profile http"

Start-Sleep -Seconds 3

Write-Host "  Starting React frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FleetPulse Frontend' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "  OK API:      http://localhost:5112" -ForegroundColor Green
Write-Host "  OK Swagger:  http://localhost:5112/swagger" -ForegroundColor Green
Write-Host "  OK Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Opening dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"