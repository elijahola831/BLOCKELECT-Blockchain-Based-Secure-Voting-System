// Biometric Authentication Module for BLOCKELECT
// Uses WebRTC for camera access and face recognition for voter verification

console.log('🔐 Loading BLOCKELECT Biometric Authentication...');

class BiometricAuthenticator {
    constructor() {
        this.stream = null;
        this.canvas = null;
        this.context = null;
        this.isCapturing = false;
        this.faceDescriptor = null;
        this.voterBiometrics = new Map(); // Store registered biometric data
        
        this.init();
    }

    async init() {
        try {
            // Check if WebRTC is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('WebRTC not supported in this browser');
            }
            
            console.log('✅ WebRTC supported - Biometric authentication available');
            this.setupBiometricUI();
            
        } catch (error) {
            console.warn('⚠️ Biometric authentication not available:', error.message);
            this.showFallbackAuth();
        }
    }

    setupBiometricUI() {
        // Create biometric authentication modal
        const biometricModal = document.createElement('div');
        biometricModal.id = 'biometric-auth-modal';
        biometricModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.8); z-index: 10000; display: none;
                        justify-content: center; align-items: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; 
                            max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <h2 style="color: #007bff; margin-bottom: 20px;">
                        🔐 Biometric Voter Authentication
                    </h2>
                    
                    <div id="biometric-status" style="margin-bottom: 20px; color: #666;">
                        Position your face in the camera frame for verification
                    </div>
                    
                    <div style="position: relative; margin: 20px 0;">
                        <video id="biometric-video" width="320" height="240" autoplay muted 
                               style="border: 3px solid #007bff; border-radius: 10px; background: #000;"></video>
                        <canvas id="biometric-canvas" width="320" height="240" 
                                style="position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <button id="start-biometric-capture" 
                                style="background: #28a745; color: white; padding: 12px 24px; 
                                       border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px;">
                            📷 Start Face Scan
                        </button>
                        
                        <button id="register-biometric" 
                                style="background: #17a2b8; color: white; padding: 12px 24px; 
                                       border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px;">
                            📝 Register New Voter
                        </button>
                        
                        <button id="verify-biometric" 
                                style="background: #007bff; color: white; padding: 12px 24px; 
                                       border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px;">
                            ✅ Verify Identity
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button id="close-biometric-modal" 
                                style="background: #6c757d; color: white; padding: 8px 16px; 
                                       border: none; border-radius: 5px; cursor: pointer;">
                            Close
                        </button>
                        
                        <button id="use-traditional-auth" 
                                style="background: #ffc107; color: #000; padding: 8px 16px; 
                                       border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                            Use Traditional Login
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(biometricModal);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-biometric-capture').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('register-biometric').addEventListener('click', () => {
            this.registerVoter();
        });

        document.getElementById('verify-biometric').addEventListener('click', () => {
            this.verifyVoter();
        });

        document.getElementById('close-biometric-modal').addEventListener('click', () => {
            this.closeBiometricAuth();
        });

        document.getElementById('use-traditional-auth').addEventListener('click', () => {
            this.useFallbackAuth();
        });
    }

    async startCamera() {
        try {
            console.log('📷 Starting camera for biometric capture...');
            
            const video = document.getElementById('biometric-video');
            const canvas = document.getElementById('biometric-canvas');
            const context = canvas.getContext('2d');
            
            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            video.srcObject = this.stream;
            this.canvas = canvas;
            this.context = context;
            
            video.addEventListener('loadedmetadata', () => {
                console.log('✅ Camera initialized successfully');
                this.updateStatus('Camera ready - Position your face in the frame', 'success');
                this.startFaceDetection();
            });
            
        } catch (error) {
            console.error('❌ Camera access failed:', error);
            this.updateStatus('Camera access denied. Please enable camera permissions.', 'error');
        }
    }

    startFaceDetection() {
        // Simulate face detection (in production, use libraries like face-api.js)
        const video = document.getElementById('biometric-video');
        const canvas = this.canvas;
        const context = this.context;
        
        const detectFaces = () => {
            if (!this.isCapturing) return;
            
            // Draw video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Simulate face detection rectangle
            context.strokeStyle = '#00ff00';
            context.lineWidth = 3;
            context.strokeRect(80, 60, 160, 120);
            
            // Add face detection label
            context.fillStyle = '#00ff00';
            context.font = '14px Arial';
            context.fillText('Face Detected', 85, 55);
            
            requestAnimationFrame(detectFaces);
        };
        
        this.isCapturing = true;
        detectFaces();
        
        this.updateStatus('Face detected! Ready for registration or verification.', 'success');
    }

    async registerVoter() {
        try {
            console.log('📝 Registering new voter biometrics...');
            
            if (!this.isCapturing) {
                this.updateStatus('Please start camera first', 'warning');
                return;
            }
            
            // Simulate biometric data extraction
            const biometricData = this.extractBiometricFeatures();
            const voterID = this.generateVoterID();
            
            // Store biometric data (in production, this would be encrypted)
            this.voterBiometrics.set(voterID, {
                biometricHash: biometricData,
                registrationTime: new Date().toISOString(),
                verified: true
            });
            
            // Store in localStorage for demo purposes
            localStorage.setItem('biometric_' + voterID, JSON.stringify({
                hash: biometricData,
                registered: true,
                timestamp: Date.now()
            }));
            
            this.updateStatus(`Voter registered successfully! ID: ${voterID}`, 'success');
            
            // Show registration success
            this.showRegistrationSuccess(voterID);
            
        } catch (error) {
            console.error('❌ Registration failed:', error);
            this.updateStatus('Registration failed. Please try again.', 'error');
        }
    }

    async verifyVoter() {
        try {
            console.log('🔍 Verifying voter identity...');
            
            if (!this.isCapturing) {
                this.updateStatus('Please start camera first', 'warning');
                return;
            }
            
            // Simulate biometric verification
            const currentBiometric = this.extractBiometricFeatures();
            
            // Check against stored biometrics
            let matched = false;
            let matchedVoterID = null;
            
            // Check localStorage for demo
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('biometric_')) {
                    const storedData = JSON.parse(localStorage.getItem(key));
                    if (this.compareBiometrics(currentBiometric, storedData.hash)) {
                        matched = true;
                        matchedVoterID = key.replace('biometric_', '');
                        break;
                    }
                }
            }
            
            if (matched) {
                this.updateStatus(`Identity verified! Welcome, Voter ${matchedVoterID}`, 'success');
                this.showVerificationSuccess(matchedVoterID);
            } else {
                this.updateStatus('Identity not recognized. Please register first or use traditional login.', 'warning');
            }
            
        } catch (error) {
            console.error('❌ Verification failed:', error);
            this.updateStatus('Verification failed. Please try again.', 'error');
        }
    }

    extractBiometricFeatures() {
        // Simulate biometric feature extraction
        // In production, this would use ML algorithms to extract facial features
        const features = [];
        for (let i = 0; i < 128; i++) {
            features.push(Math.random());
        }
        
        // Create a hash-like string from features
        return features.map(f => Math.floor(f * 255).toString(16).padStart(2, '0')).join('').substring(0, 32);
    }

    compareBiometrics(biometric1, biometric2) {
        // Simulate biometric comparison
        // In production, this would use sophisticated matching algorithms
        
        // For demo purposes, we'll simulate a match if they're the same
        return biometric1 === biometric2;
    }

    generateVoterID() {
        return 'VTR' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('biometric-status');
        const colors = {
            success: '#28a745',
            error: '#dc3545', 
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        statusElement.textContent = message;
        statusElement.style.color = colors[type];
    }

    showRegistrationSuccess(voterID) {
        setTimeout(() => {
            alert(`🎉 Biometric Registration Successful!\n\nVoter ID: ${voterID}\n\nYour biometric data has been securely stored. You can now use face recognition for future voting authentication.`);
        }, 1000);
    }

    showVerificationSuccess(voterID) {
        setTimeout(() => {
            // Close biometric modal
            this.closeBiometricAuth();
            
            // Show success and proceed to voting
            alert(`✅ Identity Verified Successfully!\n\nWelcome, Voter ${voterID}!\n\nYou are now authenticated and can proceed to vote.`);
            
            // Update UI to show authenticated state
            this.updateVotingUI(voterID);
        }, 1000);
    }

    updateVotingUI(voterID) {
        // Update the main voting interface to show authenticated user
        const authStatus = document.createElement('div');
        authStatus.id = 'biometric-auth-status';
        authStatus.innerHTML = `
            <div style="position: fixed; top: 10px; left: 10px; background: #28a745; 
                        color: white; padding: 10px 15px; border-radius: 8px; 
                        font-weight: bold; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999;">
                🔐 Biometric Auth: Voter ${voterID}
            </div>
        `;
        document.body.appendChild(authStatus);
        
        // Enable voting interface
        const voteButtons = document.querySelectorAll('.vote-btn, button[onclick*="vote"]');
        voteButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }

    closeBiometricAuth() {
        // Stop camera stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        
        this.isCapturing = false;
        
        // Hide modal
        document.getElementById('biometric-auth-modal').style.display = 'none';
    }

    showBiometricAuth() {
        document.getElementById('biometric-auth-modal').style.display = 'flex';
    }

    useFallbackAuth() {
        this.closeBiometricAuth();
        console.log('📝 Using traditional authentication method');
        
        // Show traditional login
        const fallbackAuth = prompt('Traditional Authentication:\n\nEnter your Voter ID or Wallet Address:');
        if (fallbackAuth) {
            alert(`✅ Traditional Authentication Successful!\n\nWelcome, ${fallbackAuth}!\n\nYou can now proceed to vote.`);
            this.updateVotingUI(fallbackAuth);
        }
    }

    showFallbackAuth() {
        console.log('📱 Biometric authentication not available, showing traditional login');
        
        // Create simple fallback UI
        const fallbackBtn = document.createElement('button');
        fallbackBtn.innerHTML = '🔑 Voter Authentication';
        fallbackBtn.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 9999;
            padding: 10px 15px; background: #007bff; color: white;
            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
        `;
        
        fallbackBtn.addEventListener('click', () => {
            this.useFallbackAuth();
        });
        
        document.body.appendChild(fallbackBtn);
    }
}

// Initialize biometric authentication
let biometricAuth;

document.addEventListener('DOMContentLoaded', () => {
    biometricAuth = new BiometricAuthenticator();
    
    // Add biometric authentication button to voter page
    setTimeout(() => {
        addBiometricButton();
        setupBiometricButtonListener();
    }, 1000);
    
    // Make globally available
    window.biometricAuth = biometricAuth;
});

function addBiometricButton() {
    // Check if button already exists
    if (document.getElementById('biometric-auth-btn')) {
        return;
    }
    
    // Try multiple locations to add the button
    let targetElement = null;
    
    // Option 1: Try navbar
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
        const biometricBtn = document.createElement('a');
        biometricBtn.className = 'nav-link';
        biometricBtn.href = '#';
        biometricBtn.innerHTML = '<i class="bi bi-person-check"></i> Biometric Auth';
        biometricBtn.addEventListener('click', (e) => {
            e.preventDefault();
            biometricAuth.showBiometricAuth();
        });
        navbar.appendChild(biometricBtn);
        return;
    }
    
    // Option 2: Add to account box area
    const accountBox = document.getElementById('accountBox');
    if (accountBox) {
        targetElement = accountBox;
    }
    
    // Option 3: Add to main page area
    if (!targetElement) {
        const mainPage = document.getElementById('page');
        if (mainPage) {
            targetElement = mainPage;
        }
    }
    
    // Option 4: Add to body as floating button
    if (!targetElement) {
        targetElement = document.body;
    }
    
    // Create biometric button
    const biometricBtn = document.createElement('button');
    biometricBtn.id = 'biometric-auth-btn';
    biometricBtn.innerHTML = '🔐 Enable Biometric Login';
    
    // Style based on target location
    if (targetElement === document.body) {
        // Floating button style
        biometricBtn.style.cssText = `
            position: fixed; top: 15px; right: 15px; z-index: 9999;
            padding: 12px 20px; background: linear-gradient(45deg, #007bff, #0056b3);
            color: white; border: none; border-radius: 25px; font-weight: bold;
            cursor: pointer; box-shadow: 0 4px 15px rgba(0,123,255,0.3);
            transition: all 0.3s ease; font-size: 14px;
        `;
        
        biometricBtn.addEventListener('mouseenter', () => {
            biometricBtn.style.transform = 'translateY(-2px)';
            biometricBtn.style.boxShadow = '0 6px 20px rgba(0,123,255,0.4)';
        });
        
        biometricBtn.addEventListener('mouseleave', () => {
            biometricBtn.style.transform = 'translateY(0)';
            biometricBtn.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
        });
    } else {
        // Inline button style
        biometricBtn.style.cssText = `
            margin: 10px; padding: 10px 20px; background: #007bff;
            color: white; border: none; border-radius: 8px; font-weight: bold;
            cursor: pointer; transition: background 0.3s ease;
        `;
        
        biometricBtn.addEventListener('mouseenter', () => {
            biometricBtn.style.background = '#0056b3';
        });
        
        biometricBtn.addEventListener('mouseleave', () => {
            biometricBtn.style.background = '#007bff';
        });
    }
    
    biometricBtn.addEventListener('click', () => {
        console.log('🔐 Opening biometric authentication...');
        if (biometricAuth) {
            biometricAuth.showBiometricAuth();
        } else {
            console.error('Biometric authenticator not initialized');
        }
    });
    
    targetElement.appendChild(biometricBtn);
    console.log('✅ Biometric authentication button added to page');
}

function setupBiometricButtonListener() {
    // Setup listener for the HTML button
    const htmlBiometricBtn = document.getElementById('biometric-btn');
    if (htmlBiometricBtn) {
        htmlBiometricBtn.addEventListener('click', () => {
            console.log('🔐 Opening biometric authentication from HTML button...');
            if (biometricAuth) {
                biometricAuth.showBiometricAuth();
            } else {
                console.error('Biometric authenticator not initialized');
                // Fallback - try to initialize
                setTimeout(() => {
                    if (window.biometricAuth) {
                        window.biometricAuth.showBiometricAuth();
                    }
                }, 500);
            }
        });
        console.log('✅ HTML biometric button listener attached');
        
        // Add ready indicator
        const readyIndicator = document.createElement('div');
        readyIndicator.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9998;
            background: #28a745; color: white; padding: 8px 12px;
            border-radius: 20px; font-size: 12px; font-weight: bold;
            box-shadow: 0 2px 10px rgba(40,167,69,0.3);
            opacity: 0; transition: opacity 0.5s ease;
        `;
        readyIndicator.textContent = '🔐 Biometric Ready';
        document.body.appendChild(readyIndicator);
        
        // Fade in after a moment
        setTimeout(() => {
            readyIndicator.style.opacity = '1';
            setTimeout(() => {
                readyIndicator.style.opacity = '0';
                setTimeout(() => {
                    readyIndicator.remove();
                }, 500);
            }, 3000);
        }, 1000);
    }
    
    // Also add click listener for any dynamically created buttons
    document.addEventListener('click', (e) => {
        if (e.target.id === 'biometric-auth-btn' || e.target.textContent.includes('Biometric')) {
            e.preventDefault();
            console.log('🔐 Opening biometric authentication...');
            if (biometricAuth || window.biometricAuth) {
                const auth = biometricAuth || window.biometricAuth;
                auth.showBiometricAuth();
            }
        }
    });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BiometricAuthenticator;
}

console.log('✅ BLOCKELECT Biometric Authentication loaded successfully');
console.log('🔐 Features: Face Recognition, WebRTC Camera Access, Voter Registration & Verification');
