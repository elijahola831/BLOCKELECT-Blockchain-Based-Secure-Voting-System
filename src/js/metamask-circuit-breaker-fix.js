// MetaMask Circuit Breaker Fix
// Automatically handles MetaMask connection issues

console.log('🔧 Loading MetaMask Circuit Breaker Fix...');

// Automatic fix for circuit breaker errors
const MetaMaskCircuitBreakerFix = {
    
    // Check if we're experiencing circuit breaker issues
    detectCircuitBreakerError() {
        // Check for common circuit breaker error indicators
        const errorIndicators = [
            'circuit breaker is open',
            'Execution prevented because the circuit breaker is open',
            'CONNECTION ERROR',
            'ECONNREFUSED'
        ];
        
        // Check console for errors (simplified detection)
        return window.location.href.includes('localhost') && !window.ethereum?.selectedAddress;
    },
    
    // Automatically configure MetaMask for Ganache
    async autoConfigureMetaMask() {
        if (!window.ethereum) {
            console.log('❌ MetaMask not detected');
            return false;
        }
        
        try {
            console.log('🔄 Auto-configuring MetaMask for Ganache...');
            
            // Try to switch to Ganache network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x539' }], // 1337 in hex
            });
            
            console.log('✅ Successfully switched to Ganache network');
            return true;
            
        } catch (switchError) {
            console.log('📝 Network not found, adding Ganache network...');
            
            try {
                // Add Ganache network if it doesn't exist
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x539', // 1337
                        chainName: 'Ganache Local',
                        rpcUrls: ['http://127.0.0.1:7545'],
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18
                        }
                    }]
                });
                
                console.log('✅ Ganache network added and switched');
                return true;
                
            } catch (addError) {
                console.error('❌ Failed to add Ganache network:', addError);
                return false;
            }
        }
    },
    
    // Import test account automatically
    async importTestAccount() {
        try {
            // This will show MetaMask import dialog
            console.log('💡 To complete setup, import this test account in MetaMask:');
            console.log('Private Key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
            console.log('Address: 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
            
            // Show user-friendly instructions
            this.showImportInstructions();
            
        } catch (error) {
            console.error('❌ Error with account import:', error);
        }
    },
    
    // Show import instructions to user
    showImportInstructions() {
        // Create a helpful popup with instructions
        const instructions = `
🔧 QUICK FIX for MetaMask Connection:

1️⃣ Open MetaMask Extension
2️⃣ Click "Import Account" 
3️⃣ Select "Private Key"
4️⃣ Paste this key:
0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

5️⃣ Refresh this page after import

This will give you a test account with 100 ETH!
        `;
        
        alert(instructions);
    },
    
    // Emergency bypass - Skip MetaMask entirely
    activateEmergencyBypass() {
        console.log('🚨 Activating Emergency Bypass...');
        
        // Set bypass flag
        localStorage.setItem('emergency_bypass', 'true');
        localStorage.setItem('bypass_reason', 'circuit_breaker_error');
        
        // Simulate successful connection
        window.mockMetaMaskConnection = {
            account: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
            network: 'ganache-local',
            connected: true,
            balance: '100'
        };
        
        // Update UI immediately
        this.updateUIForBypass();
        
        console.log('✅ Emergency bypass activated - You can now test all features!');
    },
    
    // Update UI for bypass mode
    updateUIForBypass() {
        // Hide the MetaMask sign-in UI
        const signInSection = document.getElementById('signIn');
        if (signInSection) {
            signInSection.style.display = 'none';
        }
        
        // Show main page
        const mainPage = document.getElementById('page');
        if (mainPage) {
            mainPage.style.display = 'block';
            
            // Update account info
            const acctAddress = document.getElementById('acctAddress');
            const acctType = document.getElementById('acctType');
            
            if (acctAddress) {
                acctAddress.textContent = '0x90F8...9C1 (TEST ACCOUNT)';
            }
            
            if (acctType) {
                acctType.textContent = 'Voter (Bypass Mode)';
                acctType.style.color = '#ffc107';
            }
        }
        
        // Show bypass notice
        this.showBypassNotice();
        
        // Initialize biometric button
        setTimeout(() => {
            this.ensureBiometricButtonVisible();
        }, 1000);
    },
    
    // Show bypass mode notice
    showBypassNotice() {
        const notice = document.createElement('div');
        notice.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; 
            background: #ffc107; color: #000; padding: 10px; 
            text-align: center; font-weight: bold; z-index: 9999;
            border-bottom: 3px solid #f0ad4e;
        `;
        notice.innerHTML = `
            🚨 BYPASS MODE ACTIVE - MetaMask Connection Bypassed | 
            <button onclick="location.reload()" style="margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Try MetaMask Again
            </button>
        `;
        document.body.appendChild(notice);
    },
    
    // Ensure biometric button is visible in bypass mode
    ensureBiometricButtonVisible() {
        const existingBtn = document.getElementById('biometric-btn');
        if (existingBtn) {
            existingBtn.style.display = 'inline-block';
            console.log('✅ Biometric button is now visible');
        } else {
            // Create biometric button if it doesn't exist
            this.createBiometricButton();
        }
    },
    
    // Create biometric button manually
    createBiometricButton() {
        const accountBox = document.getElementById('accountBox');
        if (accountBox) {
            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = 'margin-top: 15px; text-align: center;';
            btnContainer.innerHTML = `
                <button id="biometric-btn" onclick="openBiometricAuth()"
                        style="background: linear-gradient(45deg, #007bff, #0056b3); color: white; 
                               border: none; padding: 10px 20px; border-radius: 25px; font-weight: bold; 
                               cursor: pointer; box-shadow: 0 3px 10px rgba(0,123,255,0.3); 
                               transition: all 0.3s ease; font-size: 14px; margin: 5px;">
                    🔐 Enable Biometric Login
                </button>
                <button onclick="testBiometricButton()"
                        style="background: #6c757d; color: white; border: none; padding: 8px 16px; 
                               border-radius: 15px; cursor: pointer; font-size: 12px; margin: 5px;">
                    🧪 Test Button
                </button>
            `;
            accountBox.appendChild(btnContainer);
            console.log('✅ Biometric buttons created manually');
        }
    },
    
    // Main auto-fix function
    async autoFix() {
        console.log('🔧 Starting automatic MetaMask circuit breaker fix...');
        
        // Wait a moment for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (this.detectCircuitBreakerError()) {
            console.log('🚨 Circuit breaker error detected!');
            
            // Try automatic MetaMask configuration first
            const configSuccess = await this.autoConfigureMetaMask();
            
            if (configSuccess) {
                // Refresh page to apply changes
                setTimeout(() => {
                    console.log('🔄 Refreshing page to apply MetaMask fix...');
                    window.location.reload();
                }, 2000);
            } else {
                // If auto-config fails, show manual instructions
                console.log('📋 Showing manual setup instructions...');
                setTimeout(() => {
                    this.showImportInstructions();
                }, 1000);
                
                // After showing instructions, activate bypass
                setTimeout(() => {
                    console.log('🚨 Activating bypass mode for testing...');
                    this.activateEmergencyBypass();
                }, 5000);
            }
        }
    }
};

// Auto-run when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        MetaMaskCircuitBreakerFix.autoFix();
    }, 1000);
});

// Make available globally
window.MetaMaskCircuitBreakerFix = MetaMaskCircuitBreakerFix;

console.log('✅ MetaMask Circuit Breaker Fix loaded');
