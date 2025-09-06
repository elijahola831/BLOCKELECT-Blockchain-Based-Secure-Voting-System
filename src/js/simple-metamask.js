// Simple MetaMask Connection Helper
console.log('🔧 Loading simple MetaMask helper...');

// Simple connection function that bypasses complex logic
window.simpleMetaMaskConnect = async function() {
    try {
        console.log('🦊 Attempting simple MetaMask connection...');
        
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask first!\n\nDownload from: https://metamask.io/download/');
            return false;
        }
        
        // Step 1: Request accounts
        console.log('📋 Step 1: Requesting accounts...');
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length === 0) {
            alert('No accounts found. Please create an account in MetaMask.');
            return false;
        }
        
        console.log('✅ Connected to account:', accounts[0]);
        
        // Step 2: Check network
        console.log('🌐 Step 2: Checking network...');
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        });
        
        console.log('Current network:', parseInt(chainId, 16));
        
        // Step 3: Switch to Ganache if needed
        if (chainId !== '0x539') { // 1337 in hex
            console.log('🔄 Step 3: Switching to Ganache network...');
            
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x539' }]
                });
                console.log('✅ Switched to Ganache network');
            } catch (switchError) {
                if (switchError.code === 4902) {
                    // Network doesn't exist, add it
                    console.log('➕ Adding Ganache network...');
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x539',
                            chainName: 'Ganache Local',
                            rpcUrls: ['http://127.0.0.1:7545'],
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18
                            }
                        }]
                    });
                    console.log('✅ Added Ganache network');
                }
            }
        }
        
        // Step 4: Initialize Web3
        console.log('🌐 Step 4: Initializing Web3...');
        window.web3 = new Web3(window.ethereum);
        
        // Success!
        console.log('🎉 MetaMask connection successful!');
        alert('✅ MetaMask connected successfully!\n\nAccount: ' + accounts[0].slice(0, 8) + '...\nNetwork: Ganache (1337)');
        
        // Update UI
        const connectBtns = document.querySelectorAll('#wallet-btn, .connect-btn');
        connectBtns.forEach(btn => {
            btn.innerHTML = '✅ Connected';
            btn.style.background = '#28a745';
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        
        if (error.code === 4001) {
            alert('🚫 Connection rejected by user.\n\nPlease click "Connect" in MetaMask to proceed.');
        } else {
            alert('❌ MetaMask connection failed!\n\nError: ' + error.message + '\n\n🔧 Try these steps:\n1. Close and reopen MetaMask\n2. Refresh this page\n3. Restart your browser');
        }
        
        return false;
    }
};

// Add connect button to page if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Add a simple connect button
        if (!document.querySelector('#simple-connect-btn')) {
            const connectBtn = document.createElement('button');
            connectBtn.id = 'simple-connect-btn';
            connectBtn.innerHTML = '🦊 Connect MetaMask (Simple)';
            connectBtn.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                background: #f6851b;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            
            connectBtn.addEventListener('click', window.simpleMetaMaskConnect);
            document.body.appendChild(connectBtn);
        }
    }, 1000);
});

console.log('✅ Simple MetaMask helper loaded. Use window.simpleMetaMaskConnect() to connect.');
