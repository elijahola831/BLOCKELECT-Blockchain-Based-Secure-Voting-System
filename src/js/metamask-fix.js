// Enhanced MetaMask Connection Handler with Comprehensive Error Handling
console.log('🦊 Loading enhanced MetaMask handler...');

class MetaMaskHandler {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.networkId = null;
        this.isConnected = false;
        this.ganacheUrl = 'http://127.0.0.1:7545';
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing MetaMask handler...');
        
        if (typeof window.ethereum !== 'undefined') {
            console.log('🦊 MetaMask detected!');
            await this.setupWeb3();
            await this.setupEventListeners();
            await this.checkConnection();
        } else {
            console.warn('⚠️ MetaMask not detected. Setting up fallback connection...');
            await this.setupFallbackWeb3();
        }
    }

    async setupWeb3() {
        try {
            this.web3 = new Web3(window.ethereum);
            console.log('✅ Web3 initialized with MetaMask provider');
        } catch (error) {
            console.error('❌ Error setting up Web3 with MetaMask:', error);
            await this.setupFallbackWeb3();
        }
    }

    async setupFallbackWeb3() {
        try {
            // Test if Ganache is running
            const testProvider = new Web3.providers.HttpProvider(this.ganacheUrl);
            const testWeb3 = new Web3(testProvider);
            await testWeb3.eth.getBlockNumber();
            
            this.web3 = testWeb3;
            console.log('✅ Fallback Web3 initialized with Ganache provider');
            return true;
        } catch (error) {
            console.error('❌ Ganache not accessible:', error);
            this.showConnectionError();
            return false;
        }
    }

    async setupEventListeners() {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('👤 Accounts changed:', accounts);
                this.handleAccountChange(accounts);
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log('🔗 Chain changed:', chainId);
                this.handleChainChange(chainId);
            });

            window.ethereum.on('connect', (connectInfo) => {
                console.log('🔌 Connected to network:', connectInfo);
                this.isConnected = true;
                this.updateConnectionStatus(true);
            });

            window.ethereum.on('disconnect', (error) => {
                console.log('🔌 Disconnected from network:', error);
                this.isConnected = false;
                this.account = null;
                this.updateConnectionStatus(false);
            });
        }
    }

    async checkConnection() {
        try {
            // Add delay to avoid MetaMask circuit breaker
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                this.account = accounts[0];
                this.isConnected = true;
                console.log('✅ Already connected to account:', this.account);
                
                // Check and switch network if needed
                await this.ensureCorrectNetwork();
                this.updateConnectionStatus(true);
            } else {
                console.log('👤 No accounts connected');
                this.updateConnectionStatus(false);
            }
        } catch (error) {
            console.error('❌ Error checking connection:', error);
            if (error.message && error.message.includes('circuit breaker')) {
                this.showCircuitBreakerError();
            }
            this.updateConnectionStatus(false);
        }
    }

    async connectWallet(retryCount = 0) {
        if (typeof window.ethereum === 'undefined') {
            this.showInstallPrompt();
            throw new Error('MetaMask not installed');
        }

        try {
            console.log('🔗 Requesting wallet connection...');
            
            // Add delay to avoid circuit breaker
            if (retryCount > 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                this.account = accounts[0];
                this.isConnected = true;
                console.log('✅ Connected to account:', this.account);
                
                // Ensure correct network
                await this.ensureCorrectNetwork();
                this.updateConnectionStatus(true);
                
                return this.account;
            }
        } catch (error) {
            if (error.code === 4001) {
                console.log('👤 User rejected connection request');
                this.showUserRejectionMessage();
                throw new Error('User rejected connection');
            } else if (error.message && error.message.includes('circuit breaker') && retryCount < 2) {
                console.log(`🔄 MetaMask circuit breaker detected, retrying... (${retryCount + 1}/3)`);
                return this.connectWallet(retryCount + 1);
            } else if (error.message && error.message.includes('circuit breaker')) {
                this.showCircuitBreakerError();
                throw error;
            } else {
                console.error('❌ Error connecting wallet:', error);
                throw error;
            }
        }
    }

    async ensureCorrectNetwork() {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const currentChainId = parseInt(chainId, 16);
            
            if (currentChainId !== 1337) {
                console.log(`🔄 Switching from network ${currentChainId} to Ganache (1337)`);
                await this.switchToGanache();
            } else {
                console.log('✅ Already on correct network (Ganache 1337)');
            }
        } catch (error) {
            console.error('❌ Error ensuring correct network:', error);
        }
    }

    async switchToGanache() {
        try {
            // Try to switch to Ganache network (Chain ID 1337)
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x539' }], // 1337 in hex
            });
            console.log('✅ Switched to Ganache network');
        } catch (switchError) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
                console.log('➕ Adding Ganache network to MetaMask...');
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x539', // 1337 in hex
                            chainName: 'Ganache Local Testnet',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: [this.ganacheUrl],
                            blockExplorerUrls: null,
                        }],
                    });
                    console.log('✅ Added and switched to Ganache network');
                } catch (addError) {
                    console.error('❌ Error adding network:', addError);
                    this.showNetworkError();
                    throw addError;
                }
            } else if (switchError.code === 4001) {
                console.log('👤 User rejected network switch');
                this.showNetworkError();
            } else {
                console.error('❌ Error switching network:', switchError);
                throw switchError;
            }
        }
    }

    handleAccountChange(accounts) {
        if (accounts.length === 0) {
            console.log('👤 Please connect to MetaMask.');
            this.account = null;
            this.isConnected = false;
            this.updateConnectionStatus(false);
        } else if (accounts[0] !== this.account) {
            this.account = accounts[0];
            console.log('👤 Account changed to:', this.account);
            this.updateConnectionStatus(true);
            // Show account change notification
            this.showNotification('Account changed successfully', 'success');
            // Refresh page to update UI with new account
            setTimeout(() => window.location.reload(), 2000);
        }
    }

    handleChainChange(chainId) {
        const networkId = parseInt(chainId, 16);
        console.log('🔗 Network changed to:', networkId);
        
        if (networkId === 1337) {
            console.log('✅ Connected to Ganache network');
            this.updateConnectionStatus(true);
            this.showNotification('Connected to Ganache network', 'success');
        } else {
            console.log('⚠️ Wrong network detected');
            this.updateConnectionStatus(false);
            this.showNotification('Please switch to Ganache network (1337)', 'warning');
        }
        
        // Refresh page to ensure proper network connection
        setTimeout(() => window.location.reload(), 2000);
    }

    updateConnectionStatus(connected) {
        // Update connection status in UI if elements exist
        const statusElements = document.querySelectorAll('.connection-status, #wallet-status, #connection-indicator');
        statusElements.forEach(element => {
            if (connected && this.account) {
                element.innerHTML = `✅ Connected: ${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
                element.className = element.className.replace('disconnected', 'connected');
            } else {
                element.textContent = '❌ Disconnected';
                element.className = element.className.replace('connected', 'disconnected');
            }
        });

        // Update navbar wallet status
        const walletBtn = document.querySelector('#wallet-btn');
        if (walletBtn) {
            if (connected && this.account) {
                walletBtn.innerHTML = `<i class="bi bi-wallet2"></i> ${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
                walletBtn.className = walletBtn.className.replace('btn-outline-light', 'btn-success');
            } else {
                walletBtn.innerHTML = '<i class="bi bi-wallet2"></i> Connect Wallet';
                walletBtn.className = walletBtn.className.replace('btn-success', 'btn-outline-light');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.metamask-notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'metamask-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideInFromRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);
    }

    showUserRejectionMessage() {
        this.showModal({
            title: '🚫 Connection Rejected',
            message: 'You rejected the connection request. Please connect your wallet to use this application.',
            buttons: [
                {
                    text: 'Try Again',
                    onclick: 'window.metaMaskHandler.connectWallet(); this.closest(".metamask-modal").remove();',
                    style: 'primary'
                },
                {
                    text: 'Cancel',
                    onclick: 'this.closest(".metamask-modal").remove()',
                    style: 'secondary'
                }
            ]
        });
    }

    showInstallPrompt() {
        this.showModal({
            title: '🦊 MetaMask Required',
            message: 'This application requires MetaMask to interact with the blockchain. Please install MetaMask and refresh the page.',
            buttons: [
                {
                    text: 'Install MetaMask',
                    href: 'https://metamask.io/download/',
                    target: '_blank',
                    style: 'primary'
                },
                {
                    text: 'Continue with Limited Features',
                    onclick: 'this.closest(".metamask-modal").remove()',
                    style: 'secondary'
                }
            ]
        });
    }

    showNetworkError() {
        this.showModal({
            title: '🔗 Network Configuration Required',
            message: 'Please switch to the Ganache Local Testnet (Chain ID: 1337) to interact with this application. Use the details below:',
            extraContent: `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                    <strong>Network Details:</strong><br>
                    <code>Network Name: Ganache Local Testnet</code><br>
                    <code>RPC URL: http://127.0.0.1:7545</code><br>
                    <code>Chain ID: 1337</code><br>
                    <code>Currency Symbol: ETH</code>
                </div>
            `,
            buttons: [
                {
                    text: 'Try Again',
                    onclick: 'window.metaMaskHandler.ensureCorrectNetwork(); this.closest(".metamask-modal").remove();',
                    style: 'primary'
                },
                {
                    text: 'Close',
                    onclick: 'this.closest(".metamask-modal").remove()',
                    style: 'secondary'
                }
            ]
        });
    }

    showConnectionError() {
        this.showModal({
            title: '❌ Connection Error',
            message: 'Cannot connect to Ganache blockchain. Please ensure Ganache is running on http://127.0.0.1:7545',
            buttons: [
                {
                    text: 'Retry',
                    onclick: 'window.location.reload()',
                    style: 'primary'
                },
                {
                    text: 'Close',
                    onclick: 'this.closest(".metamask-modal").remove()',
                    style: 'secondary'
                }
            ]
        });
    }

    showCircuitBreakerError() {
        this.showModal({
            title: '⚠️ MetaMask Security Block',
            message: 'MetaMask has temporarily blocked connections due to security policy. This is normal and will resolve automatically.',
            extraContent: `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                    <strong>🛁 Quick Fix Steps:</strong><br>
                    1. Close and reopen MetaMask extension<br>
                    2. Wait 30 seconds, then refresh this page<br>
                    3. Try connecting again<br>
                    4. If it persists, restart your browser
                </div>
            `,
            buttons: [
                {
                    text: 'Refresh Page',
                    onclick: 'window.location.reload()',
                    style: 'primary'
                },
                {
                    text: 'Try Again',
                    onclick: 'setTimeout(() => { window.metaMaskHandler.connectWallet(); this.closest(".metamask-modal").remove(); }, 2000);',
                    style: 'secondary'
                },
                {
                    text: 'Close',
                    onclick: 'this.closest(".metamask-modal").remove()',
                    style: 'secondary'
                }
            ]
        });
    }

    showModal({ title, message, extraContent = '', buttons }) {
        // Remove any existing modals
        const existingModals = document.querySelectorAll('.metamask-modal');
        existingModals.forEach(modal => modal.remove());

        const modal = document.createElement('div');
        modal.className = 'metamask-modal';
        
        const buttonsHtml = buttons.map(btn => {
            if (btn.href) {
                return `<a href="${btn.href}" target="${btn.target || '_self'}" class="btn btn-${btn.style || 'primary'}">${btn.text}</a>`;
            } else {
                return `<button onclick="${btn.onclick}" class="btn btn-${btn.style || 'primary'}">${btn.text}</button>`;
            }
        }).join('');
        
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h2>${title}</h2>
                    <p>${message}</p>
                    ${extraContent}
                    <div class="modal-buttons">
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
            <style>
                .metamask-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10001;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .modal-overlay {
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideInUp 0.3s ease-out;
                    margin: 20px;
                }
                @keyframes slideInUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .modal-content h2 {
                    margin: 0 0 1rem 0;
                    color: #333;
                    font-size: 1.5rem;
                }
                .modal-content p {
                    margin: 0 0 1.5rem 0;
                    color: #666;
                    line-height: 1.4;
                }
                .modal-content code {
                    background: #e9ecef;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }
                .modal-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-primary {
                    background: #f6851b;
                    color: white;
                }
                .btn-primary:hover {
                    background: #e2761b;
                    transform: translateY(-1px);
                }
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                .btn-secondary:hover {
                    background: #5a6268;
                    transform: translateY(-1px);
                }
            </style>
        `;
        
        document.body.appendChild(modal);
    }

    getAccount() {
        return this.account;
    }

    getWeb3() {
        return this.web3;
    }

    isWalletConnected() {
        return this.isConnected && this.account !== null;
    }

    async getNetworkId() {
        try {
            if (this.web3) {
                return await this.web3.eth.getChainId();
            }
            return null;
        } catch (error) {
            console.error('Error getting network ID:', error);
            return null;
        }
    }
}

// Global MetaMask handler instance
let metaMaskHandler;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    metaMaskHandler = new MetaMaskHandler();
    
    // Make it globally available
    window.metaMaskHandler = metaMaskHandler;
    
    // Add click handler for connect wallet button
    const walletBtn = document.querySelector('#wallet-btn');
    if (walletBtn) {
        walletBtn.addEventListener('click', async () => {
            try {
                await metaMaskHandler.connectWallet();
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        });
    }
});

// Utility functions for other scripts
window.connectMetaMask = async () => {
    if (metaMaskHandler) {
        return await metaMaskHandler.connectWallet();
    } else {
        throw new Error('MetaMask handler not initialized');
    }
};

window.getWeb3 = () => {
    return metaMaskHandler ? metaMaskHandler.getWeb3() : null;
};

window.getCurrentAccount = () => {
    return metaMaskHandler ? metaMaskHandler.getAccount() : null;
};

window.isWalletConnected = () => {
    return metaMaskHandler ? metaMaskHandler.isWalletConnected() : false;
};

console.log('✅ Enhanced MetaMask handler loaded successfully');
