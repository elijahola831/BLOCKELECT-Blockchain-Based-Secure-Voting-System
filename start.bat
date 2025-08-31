@echo off
echo 🚀 Starting BLOCKELECT Voting System...
echo ===============================================

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ⛓️ Starting Ganache blockchain...
start /B ganache-cli --networkId 1337 --port 7545 --deterministic --accounts 10 --host 127.0.0.1

REM Wait for Ganache to start
timeout /t 8 /nobreak > nul

echo 🔨 Compiling smart contracts...
call npx truffle compile
if errorlevel 1 (
    echo ❌ Failed to compile contracts
    pause
    exit /b 1
)

echo 📡 Deploying contracts to Ganache...
call npx truffle migrate --network development --reset
if errorlevel 1 (
    echo ❌ Failed to deploy contracts
    pause
    exit /b 1
)

echo ✅ Smart contracts deployed successfully!

echo 🌐 Starting web server...
echo ===============================================
echo 🎉 BLOCKELECT is now running!
echo    📱 Web App: http://localhost:3000
echo    ⛓️ Ganache: http://localhost:7545
echo    🆔 Chain ID: 1337
echo.
echo 📋 Next steps:
echo    1. Add Ganache network to MetaMask:
echo       - Network Name: Ganache Local
echo       - RPC URL: http://127.0.0.1:7545
echo       - Chain ID: 1337
echo       - Currency: ETH
echo    2. Import a test account using private key:
echo       - 4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
echo.
echo Press Ctrl+C to stop the server
echo ===============================================

REM Start the Node.js server
node server.js
