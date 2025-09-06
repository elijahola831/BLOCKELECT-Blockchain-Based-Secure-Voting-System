@echo off
title BLOCKELECT Emergency Setup
echo ==========================================
echo 🚨 BLOCKELECT EMERGENCY SETUP 🚨
echo ==========================================
echo.
echo Fixing MetaMask and Network Issues...
echo.

REM Kill any existing processes
taskkill /F /IM node.exe >nul 2>&1

echo ✅ Step 1: Starting Ganache blockchain...
echo Please wait 10 seconds...
start "Ganache" cmd /c "npm run ganache"

echo ✅ Step 2: Waiting for Ganache to start...
timeout /t 15 /nobreak >nul

echo ✅ Step 3: Compiling contracts...
npm run compile

echo ✅ Step 4: Deploying contracts...
npm run migrate

echo ✅ Step 5: Starting server...
echo.
echo 🌟 SETUP COMPLETE! 🌟
echo.
echo 📱 YOUR URLS:
echo Computer: http://localhost:3000
echo Phone: http://10.82.102.78:3000
echo Analytics: http://localhost:3000/analytics.html
echo.
echo ⚠️ METAMASK SETUP REQUIRED:
echo 1. Add Network: Ganache Local
echo 2. RPC URL: http://127.0.0.1:7545
echo 3. Chain ID: 1337
echo 4. Import Account: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
echo.
pause
npm start
