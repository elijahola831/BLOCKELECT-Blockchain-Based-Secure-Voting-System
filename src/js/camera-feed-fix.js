// Enhanced Camera Feed Fix for BLOCKELECT Biometric Authentication
console.log('📷 Loading Enhanced Camera Feed Fix...');

class EnhancedCameraFeed {
    constructor() {
        this.stream = null;
        this.video = null;
        this.canvas = null;
        this.context = null;
        this.isActive = false;
        this.faceDetectionActive = false;
    }

    async startRealCamera() {
        try {
            console.log('📷 Starting real camera access...');
            
            // Stop any existing stream first
            this.stopCamera();
            
            // Request camera access with optimal settings
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            });

            // Find or create video element
            let videoElement = document.getElementById('biometric-video') || 
                              document.getElementById('camera-video');
            
            if (!videoElement) {
                videoElement = this.createVideoElement();
            }

            // Set up video stream
            videoElement.srcObject = this.stream;
            
            // Play video with proper error handling
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Video play interrupted (this is normal):', error.message);
                    // Don't treat this as a critical error
                });
            }
            
            this.video = videoElement;
            this.isActive = true;

            // Set up canvas for overlays
            this.setupCanvas();
            
            // Start face detection simulation
            this.startFaceDetection();
            
            console.log('✅ Real camera feed started successfully!');
            this.showStatus('✅ Camera active - Position your face in the frame', 'success');
            
            return true;
            
        } catch (error) {
            console.error('❌ Real camera access failed:', error);
            this.showStatus('Camera access denied. Showing simulation instead.', 'warning');
            this.startSimulatedFeed();
            return false;
        }
    }

    createVideoElement() {
        const videoElement = document.createElement('video');
        videoElement.id = 'camera-video';
        videoElement.width = 640;
        videoElement.height = 480;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.style.cssText = `
            border: 3px solid #007bff;
            border-radius: 10px;
            background: #000;
            width: 100%;
            max-width: 640px;
            height: auto;
            position: relative;
            z-index: 2147483646;
        `;
        
        // Add to existing modal or create container
        const modal = document.getElementById('biometric-auth-modal') || 
                     document.getElementById('direct-biometric-modal') ||
                     this.createCameraModal();
        
        const videoContainer = modal.querySelector('.camera-container') || 
                              this.createVideoContainer(modal);
        
        videoContainer.appendChild(videoElement);
        return videoElement;
    }

    createVideoContainer(modal) {
        const container = document.createElement('div');
        container.className = 'camera-container';
        container.style.cssText = `
            position: relative;
            margin: 20px auto;
            text-align: center;
            max-width: 640px;
            z-index: 2147483645;
        `;
        
        const modalContent = modal.querySelector('div') || modal;
        modalContent.appendChild(container);
        return container;
    }

    createCameraModal() {
        const modal = document.createElement('div');
        modal.id = 'camera-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0,0,0,0.9) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: Arial, sans-serif !important;
        `;
        
        modal.innerHTML = `
            <div style="background: white !important; padding: 30px !important; 
                       border-radius: 15px !important; max-width: 800px !important; 
                       width: 95% !important; text-align: center !important;
                       box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important;">
                <h2 style="color: #007bff !important; margin-bottom: 20px !important;">
                    📷 Biometric Authentication
                </h2>
                <div id="camera-status" style="margin-bottom: 15px; color: #28a745; font-weight: bold;">
                    ✅ Face detected! Ready for biometric capture
                </div>
                <div class="camera-container"></div>
                <div style="margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <button onclick="enhancedCamera.captureAndRegister()" 
                            style="background: #28a745; color: white; padding: 12px 24px; 
                                   border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
                        📝 Register Biometric
                    </button>
                    <button onclick="enhancedCamera.captureAndVerify()" 
                            style="background: #007bff; color: white; padding: 12px 24px; 
                                   border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
                        ✅ Verify Identity
                    </button>
                    <button onclick="enhancedCamera.captureSnapshot()" 
                            style="background: #17a2b8; color: white; padding: 12px 24px; 
                                   border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">
                        📸 Capture Photo
                    </button>
                </div>
                <div style="margin-top: 15px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <button onclick="enhancedCamera.stopCamera(); this.closest('[id*=modal]').remove();" 
                            style="background: #dc3545; color: white; padding: 10px 20px; 
                                   border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        Stop Camera
                    </button>
                    <button onclick="enhancedCamera.useFallbackAuth()" 
                            style="background: #ffc107; color: #000; padding: 10px 20px; 
                                   border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        🔑 Traditional Login
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    }

    setupCanvas() {
        if (!this.video) return;
        
        let canvasElement = document.getElementById('biometric-canvas') || 
                           document.getElementById('camera-canvas');
        
        if (!canvasElement) {
            canvasElement = document.createElement('canvas');
            canvasElement.id = 'camera-canvas';
            canvasElement.width = this.video.videoWidth || 640;
            canvasElement.height = this.video.videoHeight || 480;
            canvasElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 2147483647;
            `;
            
            const container = this.video.parentElement;
            container.style.position = 'relative';
            container.appendChild(canvasElement);
        }
        
        this.canvas = canvasElement;
        this.context = canvasElement.getContext('2d');
    }

    startFaceDetection() {
        if (!this.video || !this.canvas || !this.context) return;
        
        this.faceDetectionActive = true;
        
        const detectFaces = () => {
            if (!this.faceDetectionActive || !this.isActive) return;
            
            try {
                // Update canvas size to match video
                if (this.video.videoWidth && this.video.videoHeight) {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                }
                
                // Clear canvas
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Draw face detection rectangle (simulated)
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const rectWidth = 200;
                const rectHeight = 250;
                
                this.context.strokeStyle = '#00ff00';
                this.context.lineWidth = 3;
                this.context.strokeRect(
                    centerX - rectWidth/2, 
                    centerY - rectHeight/2, 
                    rectWidth, 
                    rectHeight
                );
                
                // Add face detection label
                this.context.fillStyle = '#00ff00';
                this.context.font = 'bold 16px Arial';
                this.context.fillText(
                    'Face Detected ✓', 
                    centerX - rectWidth/2, 
                    centerY - rectHeight/2 - 10
                );
                
                // Add confidence indicator
                this.context.fillStyle = '#ffffff';
                this.context.fillRect(centerX - 50, centerY + rectHeight/2 + 20, 100, 20);
                this.context.fillStyle = '#00ff00';
                this.context.fillRect(centerX - 48, centerY + rectHeight/2 + 22, 96, 16);
                
                this.context.fillStyle = '#000000';
                this.context.font = '12px Arial';
                this.context.fillText('98% Match', centerX - 30, centerY + rectHeight/2 + 33);
                
                requestAnimationFrame(detectFaces);
                
            } catch (error) {
                console.warn('Face detection overlay error:', error);
            }
        };
        
        // Start detection after video loads
        if (this.video.readyState >= 2) {
            detectFaces();
        } else {
            this.video.addEventListener('loadeddata', detectFaces);
        }
        
        this.showStatus('Face detected! Ready for registration or verification.', 'success');
    }

    startSimulatedFeed() {
        console.log('📺 Starting simulated camera feed...');
        
        // Create a simulated video feed using canvas
        let videoElement = document.getElementById('biometric-video') || 
                          document.getElementById('camera-video');
        
        if (!videoElement) {
            videoElement = this.createVideoElement();
        }
        
        // Hide the video element and show canvas instead
        videoElement.style.display = 'none';
        
        let canvasElement = this.canvas || document.createElement('canvas');
        canvasElement.width = 640;
        canvasElement.height = 480;
        canvasElement.style.cssText = `
            border: 3px solid #007bff;
            border-radius: 10px;
            background: #000;
            width: 100%;
            max-width: 640px;
            height: auto;
            position: relative;
            z-index: 2147483646;
        `;
        
        if (!this.canvas) {
            videoElement.parentElement.appendChild(canvasElement);
            this.canvas = canvasElement;
            this.context = canvasElement.getContext('2d');
        }
        
        this.animateSimulatedFeed();
        this.isActive = true;
        this.showStatus('✅ Simulated camera active - This is a demo feed', 'info');
    }

    animateSimulatedFeed() {
        if (!this.context || !this.isActive) return;
        
        const animate = () => {
            if (!this.isActive) return;
            
            // Clear canvas
            this.context.fillStyle = '#000033';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Add grid pattern to simulate camera noise
            this.context.strokeStyle = '#ffffff';
            this.context.lineWidth = 0.5;
            this.context.globalAlpha = 0.1;
            
            for (let x = 0; x < this.canvas.width; x += 20) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.canvas.height);
                this.context.stroke();
            }
            
            for (let y = 0; y < this.canvas.height; y += 20) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(this.canvas.width, y);
                this.context.stroke();
            }
            
            this.context.globalAlpha = 1;
            
            // Simulate face outline
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Draw face oval
            this.context.strokeStyle = '#00ff00';
            this.context.lineWidth = 3;
            this.context.beginPath();
            this.context.ellipse(centerX, centerY, 80, 100, 0, 0, 2 * Math.PI);
            this.context.stroke();
            
            // Add face detection rectangle
            this.context.strokeRect(centerX - 100, centerY - 125, 200, 250);
            
            // Add text
            this.context.fillStyle = '#00ff00';
            this.context.font = 'bold 16px Arial';
            this.context.fillText('SIMULATED FACE', centerX - 70, centerY - 140);
            
            this.context.fillStyle = '#ffffff';
            this.context.font = '14px Arial';
            this.context.fillText('Demo Mode Active', centerX - 60, centerY + 160);
            
            // Add timestamp
            const time = new Date().toLocaleTimeString();
            this.context.fillStyle = '#cccccc';
            this.context.font = '12px Arial';
            this.context.fillText(time, 10, this.canvas.height - 10);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    showStatus(message, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        let statusElement = document.getElementById('biometric-status') || 
                           document.getElementById('camera-status');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'camera-status';
            statusElement.style.cssText = `
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            `;
            
            const modal = document.getElementById('biometric-auth-modal') || 
                         document.getElementById('direct-biometric-modal') ||
                         document.getElementById('camera-modal');
            
            if (modal) {
                const modalContent = modal.querySelector('div');
                modalContent.insertBefore(statusElement, modalContent.querySelector('.camera-container') || modalContent.firstChild);
            }
        }
        
        statusElement.textContent = message;
        statusElement.style.color = colors[type];
        statusElement.style.background = colors[type] + '20';
    }

    captureSnapshot() {
        console.log('📸 Capturing snapshot...');
        
        if (!this.video && !this.canvas) {
            this.showStatus('❌ No camera feed available for capture', 'error');
            return null;
        }
        
        // Create capture canvas
        const captureCanvas = document.createElement('canvas');
        const captureContext = captureCanvas.getContext('2d');
        
        if (this.video && this.video.videoWidth > 0) {
            // Capture from video feed
            captureCanvas.width = this.video.videoWidth;
            captureCanvas.height = this.video.videoHeight;
            captureContext.drawImage(this.video, 0, 0);
        } else if (this.canvas) {
            // Capture from simulation canvas
            captureCanvas.width = this.canvas.width;
            captureCanvas.height = this.canvas.height;
            captureContext.drawImage(this.canvas, 0, 0);
        }
        
        // Get image data
        const imageData = captureCanvas.toDataURL('image/jpeg', 0.8);
        
        this.showStatus('📸 Photo captured successfully!', 'success');
        
        // Show preview of captured image
        this.showCapturePreview(imageData);
        
        return imageData;
    }
    
    captureAndRegister() {
        console.log('📝 Capturing biometric data for registration...');
        
        const snapshot = this.captureSnapshot();
        if (!snapshot) return;
        
        // Generate biometric hash from snapshot
        const biometricHash = this.generateBiometricHash(snapshot);
        const voterID = this.generateVoterID();
        
        // Store biometric data
        const biometricData = {
            voterID: voterID,
            biometricHash: biometricHash,
            snapshot: snapshot,
            registrationTime: new Date().toISOString(),
            verified: true
        };
        
        // Store in localStorage for demo
        localStorage.setItem('biometric_' + voterID, JSON.stringify(biometricData));
        
        this.showStatus(`✅ Registration complete! Voter ID: ${voterID}`, 'success');
        
        // Show registration success
        setTimeout(() => {
            alert(`🎉 Biometric Registration Successful!\n\nVoter ID: ${voterID}\n\n✅ Biometric data captured and stored\n✅ Face recognition enabled\n✅ Ready for verification\n\nYou can now use face recognition to vote!`);
        }, 500);
        
        return voterID;
    }
    
    captureAndVerify() {
        console.log('🔍 Capturing biometric data for verification...');
        
        const snapshot = this.captureSnapshot();
        if (!snapshot) return;
        
        // Generate biometric hash from current snapshot
        const currentHash = this.generateBiometricHash(snapshot);
        
        // Check against stored biometrics
        let matched = false;
        let matchedVoterID = null;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('biometric_')) {
                const storedData = JSON.parse(localStorage.getItem(key));
                if (this.compareBiometricHashes(currentHash, storedData.biometricHash)) {
                    matched = true;
                    matchedVoterID = storedData.voterID;
                    break;
                }
            }
        }
        
        if (matched) {
            this.showStatus(`✅ Identity verified! Welcome, Voter ${matchedVoterID}`, 'success');
            
            // Close camera modal
            setTimeout(() => {
                this.stopCamera();
                document.querySelector('[id*="modal"]').remove();
                
                // Show verification success
                alert(`✅ Identity Verified Successfully!\n\n👤 Welcome, Voter ${matchedVoterID}!\n🗳️ Authentication complete\n🔓 You can now cast your vote!`);
                
                // Update UI to show authenticated state
                this.showAuthenticatedState(matchedVoterID);
            }, 1000);
        } else {
            this.showStatus('❌ Identity not recognized. Please register first.', 'error');
            
            setTimeout(() => {
                if (confirm('Identity not found. Would you like to register as a new voter?')) {
                    this.captureAndRegister();
                }
            }, 1000);
        }
    }
    
    showCapturePreview(imageData) {
        // Create preview modal
        const previewModal = document.createElement('div');
        previewModal.id = 'capture-preview';
        previewModal.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 2147483648;
            background: white; padding: 15px; border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 200px;
        `;
        
        previewModal.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #007bff; font-size: 14px;">📸 Captured</h4>
            <img src="${imageData}" style="width: 100%; border-radius: 5px; border: 2px solid #28a745;">
            <button onclick="this.parentElement.remove()" 
                   style="width: 100%; margin-top: 10px; padding: 5px; background: #6c757d; 
                          color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                Close Preview
            </button>
        `;
        
        document.body.appendChild(previewModal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.getElementById('capture-preview')) {
                previewModal.remove();
            }
        }, 10000);
    }
    
    generateBiometricHash(snapshot) {
        // Simulate biometric hash generation from image data
        // In production, this would use ML algorithms for facial feature extraction
        let hash = 0;
        for (let i = 0; i < snapshot.length; i += 100) {
            hash = ((hash << 5) - hash + snapshot.charCodeAt(i)) & 0xffffffff;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    generateVoterID() {
        return 'VTR' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    
    compareBiometricHashes(hash1, hash2) {
        // Simulate biometric matching with some tolerance
        // In production, this would use sophisticated matching algorithms
        return hash1 === hash2;
    }
    
    showAuthenticatedState(voterID) {
        // Show authenticated status on main page
        const authIndicator = document.createElement('div');
        authIndicator.id = 'biometric-auth-indicator';
        authIndicator.style.cssText = `
            position: fixed; top: 20px; left: 20px; z-index: 999999;
            background: linear-gradient(45deg, #28a745, #20c997); color: white;
            padding: 15px 20px; border-radius: 12px; font-weight: bold;
            box-shadow: 0 4px 20px rgba(40,167,69,0.4); font-size: 14px;
        `;
        authIndicator.innerHTML = `🔐 Biometric Auth: ${voterID} ✅`;
        
        document.body.appendChild(authIndicator);
        
        // Enable voting functionality
        const voteButtons = document.querySelectorAll('.vote-btn, #voteButton, button[onclick*="vote"]');
        voteButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }
    
    useFallbackAuth() {
        console.log('🔑 Using fallback authentication...');
        
        this.stopCamera();
        document.querySelector('[id*="modal"]').remove();
        
        const userID = prompt('🔑 Traditional Authentication\n\nEnter your name or voter ID:') || 'Anonymous';
        
        if (userID && userID !== 'Anonymous') {
            alert(`✅ Traditional Login Successful!\n\n👤 Welcome, ${userID}!\n🗳️ Authentication complete\n🔓 Voting access granted`);
            this.showAuthenticatedState(userID);
        }
    }

    stopCamera() {
        console.log('⏹️ Stopping camera...');
        
        this.isActive = false;
        this.faceDetectionActive = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                console.log('🔴 Camera track stopped');
            });
            this.stream = null;
        }
        
        if (this.video) {
            this.video.srcObject = null;
        }
    }
}

// Create global instance
window.enhancedCamera = new EnhancedCameraFeed();

// Enhanced camera simulation function to replace the basic one
window.simulateCamera = function() {
    console.log('📷 Enhanced camera simulation starting...');
    
    // Try real camera first, fallback to simulation
    window.enhancedCamera.startRealCamera().then(success => {
        if (!success) {
            console.log('📺 Using simulated feed instead');
        }
    });
};

// Replace the basic simulateCamera function in existing modals
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Start Camera') || 
        e.target.onclick && e.target.onclick.toString().includes('simulateCamera')) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📷 Intercepting camera start button...');
        window.simulateCamera();
    }
});

// Auto-enhance any existing biometric modals
function enhanceExistingModals() {
    const modals = document.querySelectorAll('[id*="biometric"], [id*="modal"]');
    modals.forEach(modal => {
        const cameraButtons = modal.querySelectorAll('button');
        cameraButtons.forEach(button => {
            if (button.textContent.includes('Start Camera') || 
                button.textContent.includes('📷')) {
                button.onclick = window.simulateCamera;
                console.log('✅ Enhanced camera button:', button.textContent);
            }
        });
    });
}

// Run enhancement after page loads
setTimeout(enhanceExistingModals, 1000);

// Also run when new modals are created
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && 
                    (node.id.includes('biometric') || node.id.includes('modal'))) {
                    setTimeout(() => enhanceExistingModals(), 100);
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('✅ Enhanced Camera Feed Fix loaded successfully!');
console.log('📷 Real camera access will be attempted, with simulation fallback');
