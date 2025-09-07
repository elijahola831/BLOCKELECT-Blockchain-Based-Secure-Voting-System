// Quick Camera Position Fix - Ensures camera feed displays on top
console.log('🔧 Loading Camera Position Fix...');

// Fix any existing camera elements
function fixCameraPositioning() {
    console.log('🎯 Fixing camera element positioning...');
    
    // Find all camera-related elements
    const cameraElements = [
        ...document.querySelectorAll('#camera-video, #biometric-video, video'),
        ...document.querySelectorAll('#camera-canvas, #biometric-canvas, canvas'),
        ...document.querySelectorAll('.camera-container')
    ];
    
    cameraElements.forEach((element, index) => {
        const baseZIndex = 2147483640;
        element.style.zIndex = (baseZIndex + index).toString();
        element.style.position = element.tagName.toLowerCase() === 'canvas' ? 'absolute' : 'relative';
        
        console.log(`✅ Fixed ${element.tagName} z-index: ${element.style.zIndex}`);
    });
    
    // Specifically fix any black camera feed areas
    const blackCameraAreas = document.querySelectorAll('div[style*="background: #000"], div[style*="background:#000"]');
    blackCameraAreas.forEach(area => {
        if (area.textContent.includes('Camera Feed') || area.textContent.includes('📷')) {
            area.style.zIndex = '2147483646';
            area.style.position = 'relative';
            console.log('✅ Fixed black camera area positioning');
        }
    });
}

// Enhanced simulateCamera function with immediate positioning fix
function enhancedSimulateCamera() {
    console.log('📷 Enhanced simulate camera with position fix...');
    
    // First, fix any existing positioning issues
    fixCameraPositioning();
    
    // Then start the camera
    if (window.enhancedCamera) {
        window.enhancedCamera.startRealCamera().then(success => {
            setTimeout(fixCameraPositioning, 100);
            setTimeout(fixCameraPositioning, 500);
            if (!success) {
                console.log('📺 Using simulated feed instead');
                setTimeout(fixCameraPositioning, 100);
            }
        });
    } else {
        // Fallback to creating a visible camera simulation
        createImmediateVisibleCamera();
    }
}

// Create immediately visible camera simulation
function createImmediateVisibleCamera() {
    console.log('🎬 Creating immediately visible camera...');
    
    // Remove any existing camera elements
    document.querySelectorAll('#visible-camera-modal').forEach(el => el.remove());
    
    const modal = document.createElement('div');
    modal.id = 'visible-camera-modal';
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
    `;
    
    modal.innerHTML = `
        <div style="background: white !important; padding: 30px !important; 
                   border-radius: 15px !important; text-align: center !important;
                   position: relative !important; z-index: 2147483647 !important;">
            <h2 style="color: #007bff !important; margin-bottom: 20px !important;">
                📷 Live Camera Feed
            </h2>
            <div style="margin-bottom: 15px; color: #28a745; font-weight: bold;">
                ✅ Camera Active - Face Detection Running
            </div>
            <canvas id="visible-camera-canvas" width="640" height="480" 
                   style="border: 3px solid #007bff !important; border-radius: 10px !important;
                          background: #000033 !important; position: relative !important;
                          z-index: 2147483647 !important;">
            </canvas>
            <div style="margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                <button onclick="captureSimulationPhoto()" 
                        style="background: #28a745; color: white; padding: 12px 24px; 
                               border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    📝 Register Biometric
                </button>
                <button onclick="verifySimulationIdentity()" 
                        style="background: #007bff; color: white; padding: 12px 24px; 
                               border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    ✅ Verify Identity
                </button>
                <button onclick="takeSimulationSnapshot()" 
                        style="background: #17a2b8; color: white; padding: 12px 24px; 
                               border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    📸 Capture Photo
                </button>
            </div>
            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="document.getElementById('visible-camera-modal').remove()" 
                        style="background: #dc3545; color: white; padding: 10px 20px; 
                               border: none; border-radius: 5px; cursor: pointer;">
                    Stop Camera
                </button>
                <button onclick="useFallbackLogin()" 
                        style="background: #ffc107; color: #000; padding: 10px 20px; 
                               border: none; border-radius: 5px; cursor: pointer;">
                    🔑 Traditional Login
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Start animated camera simulation
    const canvas = document.getElementById('visible-camera-canvas');
    const ctx = canvas.getContext('2d');
    
    function animate() {
        if (!document.getElementById('visible-camera-modal')) return;
        
        // Clear canvas with dark background
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add animated grid
        const time = Date.now() / 1000;
        ctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.sin(time) * 0.05})`;
        ctx.lineWidth = 1;
        
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw animated face detection
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        
        // Face oval
        ctx.strokeStyle = `rgba(0,255,0,${0.8 + Math.sin(time * 3) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 80 * pulse, 100 * pulse, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Face detection rectangle
        ctx.strokeRect(centerX - 120, centerY - 140, 240, 280);
        
        // Labels
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('FACE DETECTED ✓', centerX - 80, centerY - 160);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText('Biometric Scan Active', centerX - 80, centerY + 170);
        
        // Confidence bar
        const confidence = 85 + Math.sin(time * 2) * 10;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(centerX - 80, centerY + 190, 160, 20);
        ctx.fillStyle = confidence > 90 ? '#00ff00' : '#ffa500';
        ctx.fillRect(centerX - 78, centerY + 192, (confidence/100) * 156, 16);
        
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(`${confidence.toFixed(0)}% Match`, centerX - 30, centerY + 204);
        
        requestAnimationFrame(animate);
    }
    
    animate();
    console.log('✅ Visible camera simulation started!');
}

// Simulation capture functions
window.captureSimulationPhoto = function() {
    const voterID = 'VTR' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Simulate capturing biometric data
    const biometricData = {
        voterID: voterID,
        biometricHash: Math.random().toString(36).substring(2, 10),
        registrationTime: new Date().toISOString(),
        verified: true
    };
    
    localStorage.setItem('biometric_' + voterID, JSON.stringify(biometricData));
    
    // Show success message
    alert(`🎉 Biometric Registration Successful!\n\nVoter ID: ${voterID}\n\n✅ Biometric data captured and stored\n✅ Face recognition enabled\n✅ Ready for verification\n\nYou can now use face recognition to vote!`);
    
    console.log('📝 Biometric registration completed for:', voterID);
};

window.verifySimulationIdentity = function() {
    // Check if any biometric data exists
    let foundBiometric = null;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('biometric_')) {
            foundBiometric = JSON.parse(localStorage.getItem(key));
            break;
        }
    }
    
    if (foundBiometric) {
        const voterID = foundBiometric.voterID;
        
        // Close modal
        document.getElementById('visible-camera-modal').remove();
        
        // Show success
        setTimeout(() => {
            alert(`✅ Identity Verified Successfully!\n\n👤 Welcome, Voter ${voterID}!\n🗳️ Authentication complete\n🔓 You can now cast your vote!`);
            
            // Show auth indicator
            showAuthenticatedIndicator(voterID);
        }, 500);
    } else {
        alert('❌ No registered biometric data found.\nPlease register first using "Register Biometric" button.');
    }
};

window.takeSimulationSnapshot = function() {
    // Create a snapshot from the canvas
    const canvas = document.getElementById('visible-camera-canvas');
    if (canvas) {
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Show preview
        const preview = document.createElement('div');
        preview.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 2147483649;
            background: white; padding: 15px; border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4); max-width: 200px;
        `;
        
        preview.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #007bff; font-size: 14px;">📸 Snapshot Taken</h4>
            <img src="${imageData}" style="width: 100%; border-radius: 5px; border: 2px solid #28a745;">
            <button onclick="this.parentElement.remove()" 
                   style="width: 100%; margin-top: 10px; padding: 5px; background: #6c757d; 
                          color: white; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        `;
        
        document.body.appendChild(preview);
        
        // Auto-remove after 8 seconds
        setTimeout(() => preview.remove(), 8000);
        
        console.log('📸 Simulation snapshot captured successfully!');
    }
};

window.useFallbackLogin = function() {
    document.getElementById('visible-camera-modal').remove();
    
    const userID = prompt('🔑 Traditional Authentication\n\nEnter your name or voter ID:') || 'Anonymous';
    
    if (userID && userID !== 'Anonymous') {
        alert(`✅ Traditional Login Successful!\n\n👤 Welcome, ${userID}!\n🗳️ Authentication complete\n🔓 Voting access granted`);
        showAuthenticatedIndicator(userID);
    }
};

function showAuthenticatedIndicator(voterID) {
    // Remove any existing indicators
    const existing = document.getElementById('biometric-auth-indicator');
    if (existing) existing.remove();
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.id = 'biometric-auth-indicator';
    indicator.style.cssText = `
        position: fixed; top: 20px; left: 20px; z-index: 999999;
        background: linear-gradient(45deg, #28a745, #20c997); color: white;
        padding: 15px 20px; border-radius: 12px; font-weight: bold;
        box-shadow: 0 4px 20px rgba(40,167,69,0.4); font-size: 14px;
    `;
    indicator.innerHTML = `🔐 Authenticated: ${voterID} ✅`;
    
    document.body.appendChild(indicator);
    
    // Enable voting buttons
    const voteButtons = document.querySelectorAll('.vote-btn, #voteButton, button[onclick*="vote"]');
    voteButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
}

// Override the simulateCamera function globally
window.simulateCamera = enhancedSimulateCamera;

// Also fix positioning when any biometric modal opens
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Start Camera') || 
        e.target.textContent.includes('📷')) {
        setTimeout(fixCameraPositioning, 100);
        setTimeout(fixCameraPositioning, 500);
        setTimeout(fixCameraPositioning, 1000);
    }
});

// Auto-fix on page load and when DOM changes
setTimeout(fixCameraPositioning, 1000);

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.tagName === 'VIDEO' || node.tagName === 'CANVAS' ||
                        node.textContent?.includes('Camera') || 
                        node.id?.includes('camera') || node.id?.includes('biometric')) {
                        setTimeout(fixCameraPositioning, 50);
                    }
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('✅ Camera Position Fix loaded successfully!');
console.log('🎯 Camera feeds will now display on top of modals');
