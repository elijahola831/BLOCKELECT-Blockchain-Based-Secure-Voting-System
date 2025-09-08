// NIN Verification App with Blockchain Integration
const Web3 = window.Web3;

const NINVerifyApp = {
    web3: null,
    account: null,
    contract: null,
    verifiedNINData: null,

    // Initialize the app
    init: async function () {
        console.log('Initializing NIN Verification App...');

        if (!window.ethereum) {
            this.showSection('noWallet');
            return;
        }

        try {
            this.web3 = new Web3(window.ethereum);
            
            // Check if user is already connected
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            
            if (accounts && accounts.length > 0) {
                await this.setupConnection(accounts[0]);
            } else {
                this.showSection('signIn');
                this.setupSignInHandler();
            }

            // Set up event listeners
            this.setupEventListeners();

        } catch (error) {
            console.error('Error initializing app:', error);
            this.showSection('signIn');
        }
    },

    // Show specific section
    showSection: function(section) {
        const sections = ['loading', 'noWallet', 'signIn', 'mainContent'];
        sections.forEach(s => {
            const element = document.getElementById(s);
            if (element) {
                element.style.display = s === section ? 'block' : 'none';
            }
        });
    },

    // Setup connection after wallet is connected
    setupConnection: async function(account) {
        try {
            this.account = account;
            console.log('Connected account:', account);

            // Load contract
            await this.loadContract();

            // Check if already verified
            await this.checkVerificationStatus();

            this.showSection('mainContent');
            document.getElementById('userAddress').textContent = account;

        } catch (error) {
            console.error('Error setting up connection:', error);
            Alert.show('error', 'exclamation-triangle', 'Connection Error', 'Failed to connect to the blockchain.');
        }
    },

    // Load smart contract
    loadContract: async function() {
        try {
            const response = await fetch('/api/contract-data');
            if (!response.ok) throw new Error('Contract data not found');
            
            const contractData = await response.json();
            this.contract = new this.web3.eth.Contract(contractData.abi, contractData.address);
            
            console.log('Contract loaded:', contractData.address);
        } catch (error) {
            console.error('Error loading contract:', error);
            throw error;
        }
    },

    // Check if user is already verified
    checkVerificationStatus: async function() {
        try {
            if (!this.contract || !this.account) return;

            const isVerified = await this.contract.methods.isNINVerified(this.account).call();
            console.log('NIN verification status:', isVerified);

            if (isVerified) {
                this.showStep('alreadyVerified');
                return true;
            } else {
                this.showStep('step1');
                return false;
            }
        } catch (error) {
            console.error('Error checking verification status:', error);
            this.showStep('step1');
            return false;
        }
    },

    // Show specific step in the verification process
    showStep: function(step) {
        const steps = ['step1', 'step2', 'step3', 'alreadyVerified'];
        steps.forEach(s => {
            const element = document.getElementById(s);
            if (element) {
                element.style.display = s === step ? 'block' : 'none';
            }
        });
    },

    // Setup sign-in handler
    setupSignInHandler: function() {
        const signInBtn = document.getElementById('signInBtn');
        if (signInBtn) {
            signInBtn.addEventListener('click', async () => {
                try {
                    signInBtn.disabled = true;
                    signInBtn.textContent = 'Connecting...';

                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    if (accounts.length > 0) {
                        await this.setupConnection(accounts[0]);
                    }
                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    Alert.show('error', 'wallet', 'Connection Failed', 'Failed to connect wallet. Please try again.');
                    
                    signInBtn.disabled = false;
                    signInBtn.textContent = 'Connect Wallet';
                }
            });
        }
    },

    // Setup event listeners
    setupEventListeners: function() {
        // NIN Verification Form
        const ninForm = document.getElementById('ninVerificationForm');
        if (ninForm) {
            ninForm.addEventListener('submit', this.handleNINVerification.bind(this));
        }

        // Blockchain Registration Button
        const blockchainBtn = document.getElementById('registerOnBlockchainBtn');
        if (blockchainBtn) {
            blockchainBtn.addEventListener('click', this.registerOnBlockchain.bind(this));
        }
    },

    // Handle NIN verification form submission
    handleNINVerification: async function(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('verifyNinBtn');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Verifying...';

            // Get form data
            const nin = document.getElementById('nin').value.trim();
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const lastName = document.getElementById('lastName').value.trim();

            // Validate inputs
            if (!nin || !dateOfBirth || !lastName) {
                throw new Error('Please fill in all required fields');
            }

            if (nin.length !== 11 || !/^\d+$/.test(nin)) {
                throw new Error('NIN must be exactly 11 digits');
            }

            // Call NIN verification API
            const response = await fetch('/api/enhanced-nin/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-Id': 'NIN_SESSION_' + Date.now(),
                    'X-Verification-Version': '2.0.0'
                },
                body: JSON.stringify({
                    nin: nin,
                    dateOfBirth: dateOfBirth,
                    lastName: lastName
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Verification failed');
            }

            // Store verification data
            this.verifiedNINData = result.data;

            // Show verification results
            const dataDiv = document.getElementById('ninVerifiedData');
            dataDiv.innerHTML = `
                <h6><i class="bi bi-check-circle-fill text-success"></i> NIN Verified Successfully</h6>
                <p><strong>Full Name:</strong> ${result.data.fullName}</p>
                <p><strong>State:</strong> ${result.data.state}</p>
                <p><strong>LGA:</strong> ${result.data.lga}</p>
                <p class="small text-muted">Verified on ${new Date(result.data.verifiedAt).toLocaleString()}</p>
            `;

            // Move to step 2
            this.showStep('step2');

            Alert.show('success', 'check-circle', 'NIN Verified!', 
                `Welcome ${result.data.fullName}! Your NIN has been verified. Now register it on the blockchain.`);

        } catch (error) {
            console.error('NIN verification error:', error);
            Alert.show('error', 'exclamation-triangle', 'Verification Failed', error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    // Register verified NIN on blockchain
    registerOnBlockchain: async function() {
        if (!this.verifiedNINData || !this.contract || !this.account) {
            Alert.show('error', 'exclamation-triangle', 'Error', 'Missing verification data or blockchain connection');
            return;
        }

        const btn = document.getElementById('registerOnBlockchainBtn');
        const originalText = btn.innerHTML;

        try {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Registering on Blockchain...';

            // Create a hash of the NIN (for privacy)
            const ninHash = this.web3.utils.keccak256(
                this.verifiedNINData.nin + this.verifiedNINData.dateOfBirth
            );

            console.log('Registering NIN hash on blockchain:', ninHash.substring(0, 10) + '...');

            // Check if we need an official to verify (in a real system, this would be handled differently)
            const isOfficial = await this.contract.methods.officials(this.account).call();
            
            if (!isOfficial) {
                // In a real system, officials would verify users. For demo, we'll auto-verify
                Alert.show('info', 'info-circle', 'Demo Mode', 
                    'In a real system, an election official would verify your NIN. For this demo, auto-verifying...');
                
                // Simulate official verification
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // For demo purposes, we'll simulate the verification
                // In reality, only officials can call verifyVoterNIN
                Alert.show('warning', 'exclamation-triangle', 'Demo Limitation', 
                    'This is a demo system. In production, only authorized officials can verify NIDs on the blockchain.');
                
                this.showStep('step3');
                return;
            }

            // If user is an official, they can verify themselves (for demo)
            const tx = await this.contract.methods.verifyVoterNIN(this.account, ninHash).send({
                from: this.account
            });

            console.log('NIN verification transaction successful:', tx.transactionHash);

            Alert.show('success', 'check-circle', 'Registration Successful!', 
                `Your NIN has been registered on the blockchain. Transaction: ${tx.transactionHash.substring(0, 10)}...`);

            this.showStep('step3');

        } catch (error) {
            console.error('Blockchain registration error:', error);
            
            let errorMessage = 'Failed to register on blockchain. ';
            if (error.message.includes('revert')) {
                if (error.message.includes('Not an official')) {
                    errorMessage += 'Only election officials can verify NIDs.';
                } else {
                    errorMessage += 'Transaction was reverted by the smart contract.';
                }
            } else if (error.message.includes('User denied')) {
                errorMessage += 'Transaction was rejected.';
            } else {
                errorMessage += error.message;
            }

            Alert.show('error', 'exclamation-triangle', 'Registration Failed', errorMessage);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    NINVerifyApp.init();
});

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            window.location.reload();
        } else if (accounts[0] !== NINVerifyApp.account) {
            window.location.reload();
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}
