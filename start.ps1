#!/usr/bin/env pwsh

Write-Host "🚀 Starting BLOCKELECT Voting System..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Blue

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start Ganache in background
Write-Host "⛓️  Starting Ganache blockchain..." -ForegroundColor Yellow
$ganacheJob = Start-Job -ScriptBlock {
    ganache-cli --networkId 1337 --port 7545 --deterministic --accounts 10 --host 127.0.0.1
}

# Wait for Ganache to start
Start-Sleep -Seconds 5

# Check if Ganache is running
$ganacheRunning = $false
try {
    $connection = Test-NetConnection -ComputerName 127.0.0.1 -Port 7545 -WarningAction SilentlyContinue
    $ganacheRunning = $connection.TcpTestSucceeded
} catch {
    $ganacheRunning = $false
}

if (-not $ganacheRunning) {
    Write-Host "❌ Failed to start Ganache. Please ensure ganache-cli is installed globally:" -ForegroundColor Red
    Write-Host "   npm install -g ganache-cli" -ForegroundColor Yellow
    Stop-Job $ganacheJob -Force
    Remove-Job $ganacheJob -Force
    exit 1
}

Write-Host "✅ Ganache running on http://127.0.0.1:7545 (Chain ID: 1337)" -ForegroundColor Green

# Compile contracts
Write-Host "🔨 Compiling smart contracts..." -ForegroundColor Yellow
npx truffle compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
    Stop-Job $ganacheJob -Force
    Remove-Job $ganacheJob -Force
    exit 1
}

# Deploy contracts
Write-Host "📡 Deploying contracts to Ganache..." -ForegroundColor Yellow
npx truffle migrate --network development --reset
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy contracts" -ForegroundColor Red
    Stop-Job $ganacheJob -Force
    Remove-Job $ganacheJob -Force
    exit 1
}

Write-Host "✅ Smart contracts deployed successfully!" -ForegroundColor Green

# Start the web server
Write-Host "🌐 Starting web server..." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Blue
Write-Host "🎉 BLOCKELECT is now running!" -ForegroundColor Green
Write-Host "   📱 Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   ⛓️  Ganache: http://localhost:7545" -ForegroundColor Cyan
Write-Host "   🆔 Chain ID: 1337" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Add Ganache network to MetaMask:" -ForegroundColor White
Write-Host "      - Network Name: Ganache Local" -ForegroundColor Gray
Write-Host "      - RPC URL: http://127.0.0.1:7545" -ForegroundColor Gray
Write-Host "      - Chain ID: 1337" -ForegroundColor Gray
Write-Host "      - Currency: ETH" -ForegroundColor Gray
Write-Host "   2. Import a test account using private key:" -ForegroundColor White
Write-Host "      - 4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d" -ForegroundColor Gray
Write-Host "" -ForegroundColor White
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Blue

# Start the Node.js server
try {
    node server.js
} finally {
    # Clean up Ganache job when server stops
    Write-Host "🛑 Stopping Ganache..." -ForegroundColor Yellow
    Stop-Job $ganacheJob -Force
    Remove-Job $ganacheJob -Force
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
