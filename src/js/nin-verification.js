// NIN (National Identification Number) Verification Module for BLOCKELECT
// Replaces the previous biometric authentication system with NIN-based voter verification

console.log('🆔 Loading BLOCKELECT NIN Verification System...');

class NINVerifier {
    constructor() {
        this.verifiedVoters = new Map();
        this.ninDatabase = new Map(); // Simulated NIN database
        this.voterRegistrations = new Map();
        
        // Initialize with some sample NIN data for testing
        this.initializeSampleNINDatabase();
        this.init();
    }

    async init() {
        try {
            console.log('✅ NIN Verification System initialized');
            this.setupNINVerificationUI();
            this.loadStoredRegistrations();
            
        } catch (error) {
            console.warn('⚠️ NIN verification system initialization failed:', error.message);
        }
    }

    initializeSampleNINDatabase() {
        // Sample NIN database for testing (in production, this would connect to official NIN API)
        const sampleNINs = [
            { nin: '12345678901', firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', state: 'Lagos' },
            { nin: '98765432109', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1985-05-15', state: 'Abuja' },
            { nin: '11111111111', firstName: 'Test', lastName: 'User', dateOfBirth: '1995-12-25', state: 'Kano' },
            { nin: '22222222222', firstName: 'Demo', lastName: 'Voter', dateOfBirth: '1988-07-10', state: 'Rivers' }
        ];

        sampleNINs.forEach(person => {
            this.ninDatabase.set(person.nin, person);
        });

        console.log(`✅ Sample NIN database loaded with ${sampleNINs.length} records`);
    }

    setupNINVerificationUI() {
        // Create NIN verification modal
        const ninModal = document.createElement('div');
        ninModal.id = 'nin-verification-modal';
        ninModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.8); z-index: 10000; display: none;
                        justify-content: center; align-items: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; 
                            max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <h2 style="color: #007bff; margin-bottom: 20px;">
                        🆔 NIN Voter Verification
                    </h2>
                    
                    <div id="nin-status" style="margin-bottom: 20px; color: #666;">
                        Enter your National Identification Number to verify your eligibility to vote
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <div style="margin: 10px 0;">
                            <label style="display: block; text-align: left; font-weight: bold; margin-bottom: 5px;">
                                NIN (11 digits):
                            </label>
                            <input type="text" id="nin-input" placeholder="Enter your 11-digit NIN" 
                                   maxlength="11" 
                                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                                          font-size: 16px; text-align: center; letter-spacing: 1px;"
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        </div>
                        
                        <div style="margin: 10px 0;">
                            <label style="display: block; text-align: left; font-weight: bold; margin-bottom: 5px;">
                                Date of Birth:
                            </label>
                            <input type="date" id="dob-input" 
                                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                                          font-size: 16px;">
                        </div>
                        
                        <div style="margin: 10px 0;">
                            <label style="display: block; text-align: left; font-weight: bold; margin-bottom: 5px;">
                                Last Name:
                            </label>
                            <input type="text" id="lastname-input" placeholder="Enter your last name" 
                                   style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                                          font-size: 16px;" oninput="this.value = this.value.replace(/[^a-zA-Z ]/g, '')">
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <button id="verify-nin-btn" 
                                style="background: #28a745; color: white; padding: 12px 24px; 
                                       border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px;
                                       font-size: 16px; min-width: 150px;">
                            ✅ Verify NIN
                        </button>
                        
                        <button id="register-voter-btn" 
                                style="background: #17a2b8; color: white; padding: 12px 24px; 
                                       border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px;
                                       font-size: 16px; min-width: 150px;" disabled>
                            📝 Register to Vote
                        </button>
                    </div>
                    
                    <div id="nin-verification-result" style="margin: 15px 0; padding: 15px; border-radius: 8px; display: none;">
                    </div>
                    
                    <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                        <button id="close-nin-modal" 
                                style="background: #6c757d; color: white; padding: 8px 16px; 
                                       border: none; border-radius: 5px; cursor: pointer;">
                            Close
                        </button>
                        
                        <button id="sample-nin-help" 
                                style="background: #ffc107; color: #000; padding: 8px 16px; 
                                       border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                            📋 Sample NINs
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(ninModal);
        this.setupNINEventListeners();
    }

    setupNINEventListeners() {
        document.getElementById('verify-nin-btn').addEventListener('click', () => {
            this.verifyNIN();
        });

        document.getElementById('register-voter-btn').addEventListener('click', () => {
            this.registerVoter();
        });

        document.getElementById('close-nin-modal').addEventListener('click', () => {
            this.closeNINVerification();
        });

        document.getElementById('sample-nin-help').addEventListener('click', () => {
            this.showSampleNINs();
        });

        // Real-time NIN input validation
        document.getElementById('nin-input').addEventListener('input', (e) => {
            const nin = e.target.value;
            const registerBtn = document.getElementById('register-voter-btn');
            
            if (nin.length === 11) {
                e.target.style.borderColor = '#28a745';
            } else {
                e.target.style.borderColor = '#ddd';
                registerBtn.disabled = true;
                registerBtn.style.opacity = '0.6';
            }
        });

        // Enter key support
        ['nin-input', 'dob-input', 'lastname-input'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.verifyNIN();
                }
            });
        });
    }

    async verifyNIN() {
        try {
            console.log('🔍 Verifying NIN...');
            
            const nin = document.getElementById('nin-input').value.trim();
            const dob = document.getElementById('dob-input').value;
            const lastName = document.getElementById('lastname-input').value.trim();
            
            // Validation
            if (!nin || nin.length !== 11) {
                this.updateNINStatus('Please enter a valid 11-digit NIN', 'error');
                return;
            }
            
            if (!dob) {
                this.updateNINStatus('Please enter your date of birth', 'error');
                return;
            }
            
            if (!lastName || lastName.length < 2) {
                this.updateNINStatus('Please enter your last name', 'error');
                return;
            }
            
            this.updateNINStatus('Verifying with National Identity Database...', 'info');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Check against NIN database
            const ninRecord = this.ninDatabase.get(nin);
            
            if (!ninRecord) {
                this.updateNINStatus('NIN not found in the National Identity Database. Please check your NIN and try again.', 'error');
                return;
            }
            
            // Verify details
            if (ninRecord.dateOfBirth !== dob) {
                this.updateNINStatus('Date of birth does not match NIN records. Please verify and try again.', 'error');
                return;
            }
            
            if (ninRecord.lastName.toLowerCase() !== lastName.toLowerCase()) {
                this.updateNINStatus('Last name does not match NIN records. Please verify and try again.', 'error');
                return;
            }
            
            // Successful verification
            this.showVerificationSuccess(ninRecord);
            
        } catch (error) {
            console.error('❌ NIN verification failed:', error);
            this.updateNINStatus('Verification failed. Please try again.', 'error');
        }
    }

    showVerificationSuccess(ninRecord) {
        const fullName = `${ninRecord.firstName} ${ninRecord.lastName}`;
        
        this.updateNINStatus(`✅ Identity verified successfully!`, 'success');
        
        // Show detailed verification result
        const resultDiv = document.getElementById('nin-verification-result');
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#d4edda';
        resultDiv.style.color = '#155724';
        resultDiv.style.border = '1px solid #c3e6cb';
        resultDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">✅ Verification Successful</h4>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>NIN:</strong> ${ninRecord.nin}</p>
            <p><strong>State:</strong> ${ninRecord.state}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #856404;">
                You are now eligible to register as a voter.
            </p>
        `;
        
        // Enable registration button
        const registerBtn = document.getElementById('register-voter-btn');
        registerBtn.disabled = false;
        registerBtn.style.opacity = '1';
        
        // Store verification data
        this.currentVerification = ninRecord;
    }

    async registerVoter() {
        try {
            if (!this.currentVerification) {
                this.updateNINStatus('Please verify your NIN first', 'error');
                return;
            }

            console.log('📝 Registering verified voter...');
            
            const nin = this.currentVerification.nin;
            const fullName = `${this.currentVerification.firstName} ${this.currentVerification.lastName}`;
            
            // Check if already registered
            if (this.voterRegistrations.has(nin)) {
                this.updateNINStatus('You are already registered to vote!', 'warning');
                return;
            }
            
            // Generate voter ID
            const voterID = this.generateVoterID();
            
            // Create voter registration
            const voterRegistration = {
                voterID: voterID,
                nin: nin,
                fullName: fullName,
                state: this.currentVerification.state,
                registrationTime: new Date().toISOString(),
                verified: true,
                hasVoted: false
            };
            
            // Store registration
            this.voterRegistrations.set(nin, voterRegistration);
            this.verifiedVoters.set(voterID, voterRegistration);
            
            // Store in localStorage for persistence
            localStorage.setItem('voter_' + voterID, JSON.stringify(voterRegistration));
            localStorage.setItem('nin_' + nin, JSON.stringify(voterRegistration));
            
            this.showRegistrationSuccess(voterRegistration);
            
        } catch (error) {
            console.error('❌ Voter registration failed:', error);
            this.updateNINStatus('Registration failed. Please try again.', 'error');
        }
    }

    showRegistrationSuccess(voterRegistration) {
        const resultDiv = document.getElementById('nin-verification-result');
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#d1ecf1';
        resultDiv.style.color = '#0c5460';
        resultDiv.style.border = '1px solid #bee5eb';
        resultDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">🎉 Registration Successful!</h4>
            <p><strong>Voter ID:</strong> ${voterRegistration.voterID}</p>
            <p><strong>Name:</strong> ${voterRegistration.fullName}</p>
            <p><strong>Registration Date:</strong> ${new Date(voterRegistration.registrationTime).toLocaleDateString()}</p>
            <p style="margin: 15px 0 0 0; font-size: 14px; font-weight: bold; color: #856404;">
                ⚠️ Please save your Voter ID: <span style="background: #fff3cd; padding: 2px 6px; border-radius: 3px;">${voterRegistration.voterID}</span>
            </p>
            <button onclick="navigator.clipboard.writeText('${voterRegistration.voterID}').then(() => alert('Voter ID copied to clipboard!'))" 
                    style="margin-top: 10px; background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                📋 Copy Voter ID
            </button>
        `;
        
        setTimeout(() => {
            this.closeNINVerification();
            this.updateVotingUI(voterRegistration);
            alert(`🎉 Voter Registration Complete!\n\nVoter ID: ${voterRegistration.voterID}\n\nYou are now registered and authenticated to vote!`);
        }, 3000);
    }

    loginExistingVoter() {
        const voterID = prompt('Enter your Voter ID:');
        if (!voterID) return;
        
        // Check in stored registrations
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('voter_')) {
                const stored = JSON.parse(localStorage.getItem(key));
                if (stored.voterID === voterID) {
                    this.updateVotingUI(stored);
                    alert(`✅ Welcome back, ${stored.fullName}!\n\nYou are now authenticated to vote.`);
                    return;
                }
            }
        }
        
        alert('❌ Voter ID not found. Please register first or check your Voter ID.');
    }

    generateVoterID() {
        return 'VTR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    }

    updateNINStatus(message, type = 'info') {
        const statusElement = document.getElementById('nin-status');
        const colors = {
            success: '#28a745',
            error: '#dc3545', 
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        statusElement.textContent = message;
        statusElement.style.color = colors[type];
    }

    showSampleNINs() {
        const sampleInfo = `
📋 Sample NINs for Testing:

• 12345678901 (John Doe, 1990-01-01)
• 98765432109 (Jane Smith, 1985-05-15)
• 11111111111 (Test User, 1995-12-25)
• 22222222222 (Demo Voter, 1988-07-10)

Note: Use the exact date of birth and last name as shown above.
        `;
        alert(sampleInfo);
    }

    updateVotingUI(voterData) {
        // Remove any existing auth status
        const existing = document.getElementById('voter-auth-status');
        if (existing) existing.remove();
        
        // Add authenticated voter status
        const authStatus = document.createElement('div');
        authStatus.id = 'voter-auth-status';
        authStatus.innerHTML = `
            <div style="position: fixed; top: 10px; left: 10px; background: #28a745; 
                        color: white; padding: 10px 15px; border-radius: 8px; 
                        font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999;">
                🆔 Verified Voter: ${voterData.fullName} (${voterData.voterID})
            </div>
        `;
        document.body.appendChild(authStatus);
        
        // Enable voting interface
        const voteButtons = document.querySelectorAll('.vote-btn, button[onclick*="vote"]');
        voteButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        
        // Store current authenticated voter
        window.currentAuthenticatedVoter = voterData;
    }

    loadStoredRegistrations() {
        // Load existing registrations from localStorage
        let loadedCount = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('voter_')) {
                try {
                    const stored = JSON.parse(localStorage.getItem(key));
                    this.verifiedVoters.set(stored.voterID, stored);
                    if (stored.nin) {
                        this.voterRegistrations.set(stored.nin, stored);
                    }
                    loadedCount++;
                } catch (e) {
                    console.warn('Failed to load stored registration:', key);
                }
            }
        }
        
        if (loadedCount > 0) {
            console.log(`✅ Loaded ${loadedCount} existing voter registrations`);
        }
    }

    closeNINVerification() {
        document.getElementById('nin-verification-modal').style.display = 'none';
        
        // Clear form
        document.getElementById('nin-input').value = '';
        document.getElementById('dob-input').value = '';
        document.getElementById('lastname-input').value = '';
        
        // Reset states
        const resultDiv = document.getElementById('nin-verification-result');
        resultDiv.style.display = 'none';
        
        const registerBtn = document.getElementById('register-voter-btn');
        registerBtn.disabled = true;
        registerBtn.style.opacity = '0.6';
        
        this.currentVerification = null;
        this.updateNINStatus('Enter your National Identification Number to verify your eligibility to vote', 'info');
    }

    showNINVerification() {
        document.getElementById('nin-verification-modal').style.display = 'flex';
    }
}

// Initialize NIN verification system
let ninVerifier;

function initializeNINVerification() {
    try {
        console.log('🆔 Initializing NIN verification system...');
        ninVerifier = new NINVerifier();
        window.ninVerifier = ninVerifier;
        
        // Setup button listeners
        setTimeout(() => {
            addNINVerificationButton();
        }, 1000);
        
        console.log('✅ NIN verification system initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing NIN verification:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNINVerification);
} else {
    initializeNINVerification();
}

// Also try after window load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.ninVerifier) {
            console.log('🔄 Retry NIN verification initialization...');
            initializeNINVerification();
        }
    }, 2000);
});

function addNINVerificationButton() {
    // Check if button already exists
    if (document.getElementById('nin-verification-btn')) {
        return;
    }
    
    // Find target element for button placement
    let targetElement = document.getElementById('accountBox') || 
                       document.getElementById('page') || 
                       document.body;
    
    // Create NIN verification button
    const ninBtn = document.createElement('button');
    ninBtn.id = 'nin-verification-btn';
    ninBtn.innerHTML = '🆔 NIN Voter Verification';
    
    // Style the button
    if (targetElement === document.body) {
        // Floating button style
        ninBtn.style.cssText = `
            position: fixed; top: 15px; right: 15px; z-index: 9999;
            padding: 12px 20px; background: linear-gradient(45deg, #28a745, #20c997);
            color: white; border: none; border-radius: 25px; font-weight: bold;
            cursor: pointer; box-shadow: 0 4px 15px rgba(40,167,69,0.3);
            transition: all 0.3s ease; font-size: 14px;
        `;
    } else {
        // Inline button style
        ninBtn.style.cssText = `
            margin: 10px; padding: 10px 20px; background: #28a745;
            color: white; border: none; border-radius: 8px; font-weight: bold;
            cursor: pointer; transition: background 0.3s ease;
        `;
    }
    
    // Add hover effects
    ninBtn.addEventListener('mouseenter', () => {
        ninBtn.style.transform = 'translateY(-2px)';
        ninBtn.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
    });
    
    ninBtn.addEventListener('mouseleave', () => {
        ninBtn.style.transform = 'translateY(0)';
        ninBtn.style.boxShadow = '0 4px 15px rgba(40,167,69,0.3)';
    });
    
    ninBtn.addEventListener('click', () => {
        console.log('🆔 Opening NIN verification...');
        if (ninVerifier) {
            ninVerifier.showNINVerification();
        } else {
            console.error('NIN verifier not initialized');
        }
    });
    
    targetElement.appendChild(ninBtn);
    console.log('✅ NIN verification button added to page');
}

// Global helper functions
window.showNINVerification = () => {
    if (window.ninVerifier) {
        window.ninVerifier.showNINVerification();
    }
};

window.loginExistingVoter = () => {
    if (window.ninVerifier) {
        window.ninVerifier.loginExistingVoter();
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NINVerifier;
}

console.log('✅ BLOCKELECT NIN Verification System loaded successfully');
console.log('🆔 Features: National ID Verification, Voter Registration, Secure Authentication');
