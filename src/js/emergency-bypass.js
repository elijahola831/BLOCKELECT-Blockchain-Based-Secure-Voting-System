// Emergency MetaMask Circuit Breaker Bypass
console.log('🚨 Loading emergency MetaMask bypass...');

// Create emergency connection button
function createEmergencyButton() {
    const existingBtn = document.querySelector('#emergency-connect');
    if (existingBtn) existingBtn.remove();

    const button = document.createElement('div');
    button.id = 'emergency-connect';
    button.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    z-index: 99999; background: white; padding: 30px; border-radius: 15px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; max-width: 500px;">
            <h2 style="color: #f6851b; margin-bottom: 20px;">🚨 MetaMask Connection Issue Detected</h2>
            
            <p style="margin-bottom: 20px; color: #333;">
                MetaMask's security system is blocking automatic connections. Please follow these manual steps:
            </p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                <strong>Step 1:</strong> Open MetaMask extension<br>
                <strong>Step 2:</strong> Manually connect to this site<br>
                <strong>Step 3:</strong> Make sure you're on "Ganache Local" network<br>
                <strong>Step 4:</strong> Click "Manual Connect" below
            </div>
            
            <button onclick="manualConnect()" 
                    style="background: #f6851b; color: white; padding: 12px 24px; 
                           border: none; border-radius: 8px; font-weight: bold; 
                           cursor: pointer; margin: 10px;">
                🔗 Manual Connect
            </button>
            
            <button onclick="bypassMetaMask()" 
                    style="background: #28a745; color: white; padding: 12px 24px; 
                           border: none; border-radius: 8px; font-weight: bold; 
                           cursor: pointer; margin: 10px;">
                ⚡ Direct Connection (No MetaMask)
            </button>
            
            <br><br>
            <button onclick="this.closest('#emergency-connect').remove()" 
                    style="background: #6c757d; color: white; padding: 8px 16px; 
                           border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(button);
}

// Manual connection that waits for user action
window.manualConnect = async function() {
    try {
        console.log('🔄 Attempting manual MetaMask connection...');
        
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask not found! Please install MetaMask first.');
            return;
        }
        
        // Simple request without circuit breaker triggers
        const accounts = await window.ethereum.request({
            method: 'eth_accounts'
        });
        
        if (accounts.length === 0) {
            alert('Please connect your MetaMask wallet manually first!\n\n1. Click the MetaMask extension\n2. Click "Connect" for this site\n3. Then click "Manual Connect" again');
            return;
        }
        
        // Initialize Web3
        window.web3 = new Web3(window.ethereum);
        
        // Update UI
        document.querySelector('#emergency-connect').remove();
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 99999; 
                        background: #28a745; color: white; padding: 15px 20px; 
                        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                ✅ MetaMask Connected Successfully!<br>
                Account: ${accounts[0].slice(0, 8)}...
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.remove(), 5000);
        
        console.log('✅ Manual connection successful!');
        
    } catch (error) {
        console.error('❌ Manual connection failed:', error);
        alert('Connection failed: ' + error.message);
    }
};

// Direct blockchain connection without MetaMask
window.bypassMetaMask = function() {
    try {
        console.log('⚡ Setting up direct blockchain connection...');
        
        // Connect directly to Ganache
        window.web3 = new Web3('http://127.0.0.1:7545');
        
        // Remove emergency dialog
        document.querySelector('#emergency-connect').remove();
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 99999; 
                        background: #17a2b8; color: white; padding: 15px 20px; 
                        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                ⚡ Direct Blockchain Connection Active!<br>
                Connected to Ganache at 127.0.0.1:7545
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.remove(), 5000);
        
        console.log('✅ Direct connection established!');
        
    } catch (error) {
        console.error('❌ Direct connection failed:', error);
        alert('Direct connection failed. Make sure Ganache is running on port 7545.');
    }
};

// Auto-detect circuit breaker and show emergency button
document.addEventListener('DOMContentLoaded', () => {
    // Check for circuit breaker after 3 seconds
    setTimeout(() => {
        if (typeof window.ethereum !== 'undefined') {
            // Test for circuit breaker
            window.ethereum.request({ method: 'eth_accounts' })
                .catch(error => {
                    if (error.message && error.message.includes('circuit breaker')) {
                        console.log('🚨 Circuit breaker detected, showing emergency options...');
                        createEmergencyButton();
                    }
                });
        }
    }, 3000);
    
    // Also show if no web3 after 5 seconds
    setTimeout(() => {
        if (!window.web3) {
            console.log('🚨 No Web3 connection detected, showing emergency options...');
            createEmergencyButton();
        }
    }, 5000);
});

console.log('✅ Emergency bypass script loaded');
