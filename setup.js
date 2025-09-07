#!/usr/bin/env node

/**
 * BLOCKELECT Setup Script
 * Automated setup for the blockchain voting system
 * Handles Ganache startup, contract deployment, and server launch
 */

const { spawn, exec } = require('child_process');
const net = require('net');
const path = require('path');

// Configuration
const CONFIG = {
    GANACHE_PORT: 7545,
    SERVER_PORT: 3000,
    NETWORK_ID: 1337,
    GANACHE_STARTUP_DELAY: 8000, // 8 seconds
    MAX_RETRIES: 3
};

// ANSI color codes for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bright: '\x1b[1m'
};

// Utility functions
function log(message, color = colors.white) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, colors.green);
}

function logError(message) {
    log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
    log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
    log(`⚠️  ${message}`, colors.yellow);
}

// Check if port is available
function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
            server.once('close', () => resolve(true));
            server.close();
        });
        server.on('error', () => resolve(false));
    });
}

// Wait for port to become active
function waitForPort(port, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        const checkConnection = () => {
            const socket = net.createConnection(port, 'localhost');
            
            socket.on('connect', () => {
                socket.end();
                resolve(true);
            });
            
            socket.on('error', () => {
                if (Date.now() - startTime < timeout) {
                    setTimeout(checkConnection, 1000);
                } else {
                    reject(new Error(`Timeout waiting for port ${port}`));
                }
            });
        };
        
        checkConnection();
    });
}

// Execute command and return promise
function execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

// Start Ganache blockchain
async function startGanache() {
    logInfo("Starting Ganache local blockchain...");
    
    // Check if Ganache port is already in use
    const isPortFree = await checkPort(CONFIG.GANACHE_PORT);
    if (!isPortFree) {
        logWarning(`Port ${CONFIG.GANACHE_PORT} is already in use. Ganache might already be running.`);
        try {
            await waitForPort(CONFIG.GANACHE_PORT, 5000);
            logSuccess("Ganache is already running!");
            return true;
        } catch (e) {
            logError("Port is occupied but not responding to connections.");
            return false;
        }
    }
    
    // Start Ganache
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'npm.cmd' : 'npm';
    
    const ganacheProcess = spawn(command, ['run', 'ganache'], {
        stdio: 'pipe',
        detached: !isWindows,
        cwd: process.cwd()
    });
    
    ganacheProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Listening on')) {
            logSuccess("Ganache started successfully!");
        }
    });
    
    ganacheProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (!error.includes('µWS is not compatible')) {
            logWarning(`Ganache warning: ${error}`);
        }
    });
    
    // Wait for Ganache to start
    log("Waiting for Ganache to initialize...");
    await new Promise(resolve => setTimeout(resolve, CONFIG.GANACHE_STARTUP_DELAY));
    
    try {
        await waitForPort(CONFIG.GANACHE_PORT, 15000);
        logSuccess(`Ganache is running on port ${CONFIG.GANACHE_PORT}`);
        return true;
    } catch (e) {
        logError("Failed to start Ganache");
        return false;
    }
}

// Compile smart contracts
async function compileContracts() {
    logInfo("Compiling smart contracts...");
    try {
        const result = await execCommand('npm run compile');
        if (result.stdout.includes('Compiled successfully')) {
            logSuccess("Smart contracts compiled successfully!");
            return true;
        } else {
            logError("Contract compilation failed");
            console.log(result.stdout);
            return false;
        }
    } catch (e) {
        logError("Failed to compile contracts");
        console.log(e.stderr);
        return false;
    }
}

// Deploy contracts to local network
async function deployContracts() {
    logInfo("Deploying contracts to local network...");
    try {
        const result = await execCommand('npm run migrate');
        if (result.stdout.includes('contract address:')) {
            const addressMatch = result.stdout.match(/contract address:\s+([0-9a-fA-Fx]+)/);
            const contractAddress = addressMatch ? addressMatch[1] : 'Unknown';
            logSuccess(`Contracts deployed successfully at: ${contractAddress}`);
            return true;
        } else {
            logError("Contract deployment failed");
            console.log(result.stdout);
            return false;
        }
    } catch (e) {
        logError("Failed to deploy contracts");
        console.log(e.stderr);
        return false;
    }
}

// Bundle frontend assets
async function bundleFrontend() {
    logInfo("Bundling frontend assets...");
    try {
        await execCommand('npm run bundle');
        logSuccess("Frontend assets bundled successfully!");
        return true;
    } catch (e) {
        logError("Failed to bundle frontend assets");
        console.log(e.stderr);
        return false;
    }
}

// Display setup completion message
function displayCompletionMessage() {
    log("\n" + "=".repeat(60), colors.green);
    log("🎉 BLOCKELECT SETUP COMPLETED SUCCESSFULLY! 🎉", colors.green + colors.bright);
    log("=".repeat(60), colors.green);
    log("");
    log("🌐 Your blockchain voting system is ready!", colors.cyan);
    log("");
    log("📍 Access Points:", colors.magenta);
    log(`   • Voter Interface (NIN Verification): http://localhost:${CONFIG.SERVER_PORT}`, colors.white);
    log(`   • Electoral Commission: http://localhost:${CONFIG.SERVER_PORT}/official.html`, colors.white);
    log("");
    log("🔗 MetaMask Configuration:", colors.magenta);
    log("   • Network Name: Ganache Local", colors.white);
    log(`   • RPC URL: http://127.0.0.1:${CONFIG.GANACHE_PORT}`, colors.white);
    log(`   • Chain ID: ${CONFIG.NETWORK_ID}`, colors.white);
    log("   • Currency: ETH", colors.white);
    log("");
    log("🔑 Test Account Private Key:", colors.magenta);
    log("   0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d", colors.cyan);
    log("   (Import this key into MetaMask for testing)", colors.white);
    log("");
    log("🚀 To start the web server, run:", colors.magenta);
    log("   npm start", colors.cyan);
    log("");
    log("=".repeat(60), colors.green);
}

// Display error message
function displayErrorMessage() {
    log("\n" + "=".repeat(60), colors.red);
    log("❌ SETUP FAILED", colors.red + colors.bright);
    log("=".repeat(60), colors.red);
    log("");
    log("Please check the error messages above and try again.", colors.white);
    log("You can also run the setup steps manually:", colors.white);
    log("   1. npm run ganache", colors.cyan);
    log("   2. npm run migrate", colors.cyan);
    log("   3. npm run bundle", colors.cyan);
    log("   4. npm start", colors.cyan);
    log("");
    log("=".repeat(60), colors.red);
}

// Main setup function
async function main() {
    log("\n" + "=".repeat(60), colors.blue);
    log("🚀 BLOCKELECT BLOCKCHAIN VOTING SYSTEM SETUP", colors.blue + colors.bright);
    log("=".repeat(60), colors.blue);
    log("");
    
    try {
        // Step 1: Start Ganache
        const ganacheStarted = await startGanache();
        if (!ganacheStarted) {
            throw new Error("Failed to start Ganache");
        }
        
        // Step 2: Compile contracts
        const contractsCompiled = await compileContracts();
        if (!contractsCompiled) {
            throw new Error("Failed to compile contracts");
        }
        
        // Step 3: Deploy contracts
        const contractsDeployed = await deployContracts();
        if (!contractsDeployed) {
            throw new Error("Failed to deploy contracts");
        }
        
        // Step 4: Bundle frontend
        const frontendBundled = await bundleFrontend();
        if (!frontendBundled) {
            throw new Error("Failed to bundle frontend");
        }
        
        displayCompletionMessage();
        
    } catch (error) {
        logError(`Setup failed: ${error.message}`);
        displayErrorMessage();
        process.exit(1);
    }
}

// Handle script termination
process.on('SIGINT', () => {
    log("\n🛑 Setup interrupted by user", colors.yellow);
    process.exit(0);
});

process.on('SIGTERM', () => {
    log("\n🛑 Setup terminated", colors.yellow);
    process.exit(0);
});

// Run setup
if (require.main === module) {
    main().catch(error => {
        logError(`Unexpected error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { main, CONFIG };
