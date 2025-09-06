@echo off
title BLOCKELECT - Complete Setup and Startup
color 0A

echo.
echo ========================================
echo    BLOCKELECT - Complete Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if needed
echo 🔧 Installing dependencies...
call npm install

:: Check if Ganache CLI is installed globally
ganache-cli --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Ganache CLI globally...
    call npm install -g ganache-cli
)

:: Kill any existing processes
echo 🛑 Stopping any existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ganache-cli.exe >nul 2>&1

:: Start Ganache
echo 🚀 Starting Ganache blockchain...
start "Ganache Blockchain" ganache-cli --networkId 1337 --accounts 10 --deterministic --host 0.0.0.0

:: Wait for Ganache to start
echo ⏳ Waiting for Ganache to initialize...
timeout /t 5 /nobreak >nul

:: Compile and deploy contracts
echo 📜 Compiling and deploying smart contracts...
call npx truffle compile
call npx truffle migrate --reset --network development

:: Check if contracts deployed successfully
if not exist "build\contracts\VotingSys.json" (
    echo ❌ Contract deployment failed
    pause
    exit /b 1
)

echo ✅ Smart contracts deployed successfully!

:: Start the enhanced server
echo 🌐 Starting BLOCKELECT server with real-time features...
echo.
echo 🎯 Server will be available at:
echo    📱 Mobile: http://10.82.102.78:3000
echo    💻 Desktop: http://localhost:3000
echo    📊 Analytics: http://localhost:3000/analytics.html
echo    ⚙️  Admin: http://localhost:3000/official.html
echo.
echo 🔥 Features enabled:
echo    ✅ MetaMask integration with auto-setup
echo    ✅ Real-time analytics dashboard
echo    ✅ WebSocket live updates
echo    ✅ Blockchain polling (2s interval)
echo    ✅ Multi-signature voting
echo    ✅ PWA offline support
echo.

node server.js

pause
