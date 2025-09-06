#!/usr/bin/env node

/**
 * Enhanced BLOCKELECT Installation Script
 * This script helps install all dependencies and set up the enhanced features
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 BLOCKELECT Enhanced Installation');
console.log('═══════════════════════════════════');

function runCommand(command, description) {
    console.log(`\n⏳ ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed`);
        return true;
    } catch (error) {
        console.log(`❌ ${description} failed:`, error.message);
        return false;
    }
}

function installDependencies() {
    console.log('\n📦 Installing Dependencies');
    console.log('─────────────────────────');
    
    // Core dependencies
    const corePackages = [
        'express@^4.21.0',
        'truffle@^5.11.5',
        'web3@^1.10.4'
    ];
    
    // Enhanced feature packages
    const enhancedPackages = [
        'chart.js@^4.4.0'
    ];
    
    // Try installing core packages first
    console.log('Installing core packages...');
    for (const pkg of corePackages) {
        runCommand(`npm install ${pkg}`, `Installing ${pkg}`);
    }
    
    // Try installing enhanced packages
    console.log('\nInstalling enhanced feature packages...');
    for (const pkg of enhancedPackages) {
        runCommand(`npm install ${pkg}`, `Installing ${pkg}`);
    }
    
    // Try installing optional packages (don't fail if these don't work)
    console.log('\nInstalling optional packages (for advanced features)...');
    const optionalPackages = [
        'ipfs-http-client@^60.0.1',
        'circomlib@^2.0.5',
        'snarkjs@^0.7.3'
    ];
    
    for (const pkg of optionalPackages) {
        console.log(`Attempting to install ${pkg}...`);
        try {
            execSync(`npm install ${pkg} --optional`, { stdio: 'pipe' });
            console.log(`✅ ${pkg} installed`);
        } catch (error) {
            console.log(`⚠️  ${pkg} skipped (will use fallback implementation)`);
        }
    }
}

function checkFiles() {
    console.log('\n🔍 Checking Enhanced Files');
    console.log('──────────────────────────');
    
    const requiredFiles = [
        'src/analytics.html',
        'src/css/analytics.css',
        'src/js/analytics.js',
        'src/js/zk-voting.js',
        'src/js/ipfs-client.js',
        'src/manifest.json',
        'src/sw.js',
        'src/offline.html',
        'contracts/VotingSys.sol',
        'server.js'
    ];
    
    let allFilesPresent = true;
    
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ Missing: ${file}`);
            allFilesPresent = false;
        }
    }
    
    return allFilesPresent;
}

function createMissingDirectories() {
    console.log('\n📁 Creating Directories');
    console.log('─────────────────────');
    
    const directories = [
        'dist',
        'build',
        'src/assets',
        'views'
    ];
    
    for (const dir of directories) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created: ${dir}`);
        } else {
            console.log(`✅ Exists: ${dir}`);
        }
    }
}

function displayNextSteps() {
    console.log('\n🎉 Installation Complete!');
    console.log('═══════════════════════════');
    console.log('\n📋 Next Steps:');
    console.log('1. Start Ganache: npm run ganache');
    console.log('2. In new terminal, compile contracts: npm run compile');
    console.log('3. Deploy contracts: npm run migrate');
    console.log('4. Bundle frontend: npm run bundle');
    console.log('5. Start server: npm start');
    console.log('\n🌟 Enhanced Features Available:');
    console.log('• Analytics Dashboard: http://localhost:3000/analytics.html');
    console.log('• Admin Panel: http://localhost:3000/official.html');
    console.log('• PWA Support: Installable app with offline mode');
    console.log('• Multi-Signature: Enhanced security controls');
    console.log('• IPFS Integration: Decentralized file storage');
    console.log('• ZK Proofs: Privacy-preserving voting');
    console.log('\n💡 Tip: If any packages failed to install, the system will still work');
    console.log('    with basic functionality and fallback implementations.');
}

// Main installation process
async function main() {
    try {
        createMissingDirectories();
        installDependencies();
        
        const filesOk = checkFiles();
        if (!filesOk) {
            console.log('\n⚠️  Some enhanced files are missing. The basic system will still work.');
        }
        
        displayNextSteps();
        
    } catch (error) {
        console.error('\n❌ Installation failed:', error.message);
        console.log('\n💡 You can still run the basic system with:');
        console.log('   npm install express truffle web3');
        console.log('   npm start');
    }
}

if (require.main === module) {
    main();
}
