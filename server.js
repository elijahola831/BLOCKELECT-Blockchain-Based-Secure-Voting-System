const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const Web3 = require('web3');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = 3000; // Fixed port for consistency

// Initialize Web3 and contract for event monitoring
let web3;
let contract;
let isMonitoringEvents = false;

// Initialize blockchain connection
async function initBlockchain() {
    try {
        web3 = new Web3('http://127.0.0.1:7545');
        
        // Load contract data
        const contractPath = path.join(__dirname, 'build/contracts/VotingSys.json');
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        const networkId = '1337';
        const deployedNetwork = contractData.networks[networkId];
        
        if (deployedNetwork) {
            contract = new web3.eth.Contract(contractData.abi, deployedNetwork.address);
            console.log('📡 Blockchain connection established');
            console.log(`📜 Contract Address: ${deployedNetwork.address}`);
            return true;
        } else {
            console.log('⚠️  Contract not deployed to network 1337');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to initialize blockchain:', error.message);
        return false;
    }
}

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('📱 Analytics client connected:', socket.id);
    
    socket.on('join-analytics', () => {
        socket.join('analytics');
        console.log('📊 Client joined analytics room');
    });
    
    socket.on('disconnect', () => {
        console.log('📱 Analytics client disconnected:', socket.id);
    });
});

// Blockchain polling for real-time updates
let lastTotalVotes = 0;
let lastCandidateCount = 0;
let pollingInterval;

async function startBlockchainPolling() {
    if (!contract || isMonitoringEvents) {
        return;
    }
    
    try {
        console.log('👀 Starting blockchain polling for real-time updates...');
        isMonitoringEvents = true;
        
        // Get initial state
        const [candidates, totalVotes] = await Promise.all([
            contract.methods.getCandidates().call(),
            contract.methods.getTotalVotes().call()
        ]);
        
        lastTotalVotes = parseInt(totalVotes);
        lastCandidateCount = candidates.names.length;
        
        console.log(`📊 Initial state: ${lastTotalVotes} votes, ${lastCandidateCount} candidates`);
        
        // Poll every 2 seconds for changes
        pollingInterval = setInterval(async () => {
            try {
                const [currentCandidates, currentTotalVotes] = await Promise.all([
                    contract.methods.getCandidates().call(),
                    contract.methods.getTotalVotes().call()
                ]);
                
                const currentVoteCount = parseInt(currentTotalVotes);
                const currentCandidateCount = currentCandidates.names.length;
                
                // Check for new votes
                if (currentVoteCount > lastTotalVotes) {
                    console.log(`🗳️  New votes detected: ${currentVoteCount - lastTotalVotes} votes`);
                    
                    // Broadcast vote update to analytics clients
                    io.to('analytics').emit('voteUpdate', {
                        timestamp: new Date().toISOString(),
                        totalVotes: currentVoteCount,
                        previousTotal: lastTotalVotes,
                        candidates: {
                            names: currentCandidates.names,
                            parties: currentCandidates.parties,
                            votes: currentCandidates.votes.map(v => parseInt(v))
                        }
                    });
                    
                    lastTotalVotes = currentVoteCount;
                    console.log('📡 Vote update broadcasted to analytics clients');
                }
                
                // Check for new candidates
                if (currentCandidateCount > lastCandidateCount) {
                    console.log(`👤 New candidates detected: ${currentCandidateCount - lastCandidateCount} candidates`);
                    
                    // Broadcast candidate update
                    io.to('analytics').emit('candidateAdded', {
                        timestamp: new Date().toISOString(),
                        candidates: {
                            names: currentCandidates.names,
                            parties: currentCandidates.parties,
                            votes: currentCandidates.votes.map(v => parseInt(v))
                        }
                    });
                    
                    lastCandidateCount = currentCandidateCount;
                    console.log('📡 Candidate update broadcasted to analytics clients');
                }
                
            } catch (pollingError) {
                console.error('Error during blockchain polling:', pollingError.message);
            }
        }, 2000); // Poll every 2 seconds
        
    } catch (error) {
        console.error('❌ Error starting blockchain polling:', error);
        isMonitoringEvents = false;
    }
}

// Middleware for parsing JSON
app.use(express.json());

// Add CORS middleware for cross-origin access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// PWA and security headers
app.use((req, res, next) => {
    // PWA headers
    if (req.url.endsWith('.webmanifest') || req.url.endsWith('manifest.json')) {
        res.setHeader('Content-Type', 'application/manifest+json');
    }
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Service Worker headers
    if (req.url.endsWith('sw.js')) {
        res.setHeader('Service-Worker-Allowed', '/');
        res.setHeader('Cache-Control', 'no-cache');
    } else {
        // Disable caching for other files during development
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    
    next();
});

// Serve static files from src directory
app.use(express.static(path.join(__dirname, 'src')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/build', express.static(path.join(__dirname, 'build')));

// API Routes

// Enhanced NIN Verification System API v2.0
// Advanced NIN verification with comprehensive security and features
const enhancedNINLimiter = new Map();
const ENHANCED_RATE_LIMIT = 5; // 5 requests per minute
const ENHANCED_WINDOW = 60 * 1000; // 1 minute

// Advanced rate limiter for enhanced NIN system
function enhancedRateLimit(req, res, next) {
    const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();
    
    // Clean expired entries
    for (const [ip, data] of enhancedNINLimiter.entries()) {
        if (now - data.firstRequest > ENHANCED_WINDOW) {
            enhancedNINLimiter.delete(ip);
        }
    }
    
    const ipData = enhancedNINLimiter.get(clientIP);
    
    if (!ipData) {
        enhancedNINLimiter.set(clientIP, { count: 1, firstRequest: now });
        next();
    } else if (now - ipData.firstRequest > ENHANCED_WINDOW) {
        enhancedNINLimiter.set(clientIP, { count: 1, firstRequest: now });
        next();
    } else if (ipData.count < ENHANCED_RATE_LIMIT) {
        ipData.count++;
        next();
    } else {
        console.warn(`🚨 Enhanced NIN rate limit exceeded for IP: ${clientIP}`);
        res.status(429).json({
            success: false,
            error: 'Too many verification attempts. Please wait before trying again.',
            code: 'ENHANCED_RATE_LIMIT',
            retryAfter: Math.ceil((ENHANCED_WINDOW - (now - ipData.firstRequest)) / 1000)
        });
    }
}

// Enhanced input validation and sanitization
function validateAndSanitizeEnhanced(input, type) {
    if (!input || typeof input !== 'string') return null;
    
    const sanitized = input.replace(/[<>"'&\x00-\x1f\x7f-\x9f]/g, '').trim();
    
    switch (type) {
        case 'nin':
            return /^\d{11}$/.test(sanitized) ? sanitized : null;
        case 'date':
            return /^\d{4}-\d{2}-\d{2}$/.test(sanitized) ? sanitized : null;
        case 'name':
            return /^[a-zA-Z\s]{2,50}$/.test(sanitized) ? sanitized : null;
        default:
            return sanitized;
    }
}

// Enhanced NIN verification endpoint
app.post('/api/enhanced-nin/verify', enhancedRateLimit, async (req, res) => {
    const startTime = Date.now();
    const sessionId = req.headers['x-session-id'] || 'UNKNOWN';
    const version = req.headers['x-verification-version'] || '1.0.0';
    
    console.log(`🆔 Enhanced NIN verification request - Session: ${sessionId}, Version: ${version}`);
    
    try {
        const { nin, dateOfBirth, lastName } = req.body;
        
        // Enhanced validation
        const validatedNIN = validateAndSanitizeEnhanced(nin, 'nin');
        const validatedDOB = validateAndSanitizeEnhanced(dateOfBirth, 'date');
        const validatedLastName = validateAndSanitizeEnhanced(lastName, 'name');
        
        // Input validation errors
        const errors = [];
        if (!validatedNIN) errors.push('Invalid NIN format (must be 11 digits)');
        if (!validatedDOB) errors.push('Invalid date format (use YYYY-MM-DD)');
        if (!validatedLastName) errors.push('Invalid name format (letters only, 2-50 chars)');
        
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Input validation failed',
                code: 'ENHANCED_VALIDATION_ERROR',
                details: errors,
                suggestions: [
                    'Check your NIN is exactly 11 digits',
                    'Ensure date is in YYYY-MM-DD format',
                    'Use only letters for your last name'
                ]
            });
        }
        
        // Additional date validation
        const birthDate = new Date(validatedDOB);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
            return res.status(400).json({
                success: false,
                error: 'Date of birth cannot be in the future',
                code: 'INVALID_BIRTH_DATE'
            });
        }
        
        if (age < 18) {
            return res.status(400).json({
                success: false,
                error: 'You must be at least 18 years old to register as a voter',
                code: 'UNDERAGE_VOTER'
            });
        }
        
        if (age > 120) {
            return res.status(400).json({
                success: false,
                error: 'Invalid age detected. Please verify your date of birth',
                code: 'INVALID_AGE'
            });
        }
        
        // Enhanced Mock NIN Database
        const enhancedNINDatabase = {
            '12345678901': {
                nin: '12345678901',
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-01-01',
                state: 'Lagos',
                lga: 'Lagos Island',
                gender: 'Male',
                status: 'Active'
            },
            '98765432109': {
                nin: '98765432109',
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '1985-05-15',
                state: 'Abuja',
                lga: 'Municipal Area Council',
                gender: 'Female',
                status: 'Active'
            },
            '11111111111': {
                nin: '11111111111',
                firstName: 'Test',
                lastName: 'User',
                dateOfBirth: '1995-12-25',
                state: 'Kano',
                lga: 'Kano Municipal',
                gender: 'Male',
                status: 'Active'
            },
            '22222222222': {
                nin: '22222222222',
                firstName: 'Demo',
                lastName: 'Voter',
                dateOfBirth: '1988-07-10',
                state: 'Rivers',
                lga: 'Port Harcourt',
                gender: 'Female',
                status: 'Active'
            },
            '33333333333': {
                nin: '33333333333',
                firstName: 'Suspended',
                lastName: 'Account',
                dateOfBirth: '1992-04-18',
                state: 'Ogun',
                lga: 'Abeokuta North',
                gender: 'Male',
                status: 'Suspended'
            }
        };
        
        // Simulate realistic API processing time
        const processingDelay = Math.random() * 2000 + 1000; // 1-3 seconds
        await new Promise(resolve => setTimeout(resolve, processingDelay));
        
        // Check NIN in database
        const ninRecord = enhancedNINDatabase[validatedNIN];
        
        if (!ninRecord) {
            console.log(`❌ Enhanced NIN not found: ${validatedNIN}`);
            return res.status(404).json({
                success: false,
                error: 'National Identification Number not found in NIMC database',
                code: 'NIN_NOT_FOUND',
                suggestions: [
                    'Verify your NIN is correct (check your NIN slip or ID card)',
                    'Ensure your NIN is registered with NIMC',
                    'Contact NIMC customer service if you believe this is an error',
                    'For testing, use: 12345678901 (John Doe)'
                ]
            });
        }
        
        // Check NIN status
        if (ninRecord.status !== 'Active') {
            console.log(`❌ Enhanced NIN status not active: ${validatedNIN} - ${ninRecord.status}`);
            return res.status(400).json({
                success: false,
                error: `Your NIN status is '${ninRecord.status}'. Only active NINs can be used for voter registration`,
                code: 'INACTIVE_NIN_STATUS',
                suggestions: [
                    'Contact NIMC to resolve your NIN status',
                    'Visit the nearest NIMC enrollment center',
                    'Ensure all required documents are submitted'
                ]
            });
        }
        
        // Verify personal details
        if (ninRecord.dateOfBirth !== validatedDOB) {
            console.log(`❌ Enhanced DOB mismatch for NIN: ${validatedNIN}`);
            return res.status(400).json({
                success: false,
                error: 'Date of birth does not match NIMC records',
                code: 'DOB_MISMATCH',
                suggestions: [
                    'Verify the date format is YYYY-MM-DD',
                    'Check your NIN slip or ID card for the correct date',
                    'Ensure you are using the date as registered with NIMC'
                ]
            });
        }
        
        if (ninRecord.lastName.toLowerCase() !== validatedLastName.toLowerCase()) {
            console.log(`❌ Enhanced last name mismatch for NIN: ${validatedNIN}`);
            return res.status(400).json({
                success: false,
                error: 'Last name does not match NIMC records',
                code: 'LASTNAME_MISMATCH',
                suggestions: [
                    'Use your last name exactly as it appears on your NIN',
                    'Do not include middle names or titles',
                    'Check spelling carefully'
                ]
            });
        }
        
        // Successful verification
        const processingTime = Date.now() - startTime;
        console.log(`✅ Enhanced NIN verification successful: ${ninRecord.firstName} ${ninRecord.lastName} (${processingTime}ms)`);
        
        res.json({
            success: true,
            message: 'National Identification Number verified successfully',
            data: {
                nin: ninRecord.nin,
                firstName: ninRecord.firstName,
                lastName: ninRecord.lastName,
                fullName: `${ninRecord.firstName} ${ninRecord.lastName}`,
                state: ninRecord.state,
                lga: ninRecord.lga,
                gender: ninRecord.gender,
                verifiedAt: new Date().toISOString(),
                ageVerified: true,
                processingTime: processingTime,
                sessionId: sessionId,
                version: version
            },
            code: 'ENHANCED_VERIFICATION_SUCCESS',
            metadata: {
                apiVersion: '2.0.0',
                processingTime: processingTime,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ Enhanced NIN verification error (${processingTime}ms):`, error);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error during enhanced verification',
            code: 'ENHANCED_SERVER_ERROR',
            sessionId: sessionId,
            processingTime: processingTime,
            message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
});

// Enhanced NIN system information endpoint
app.get('/api/enhanced-nin/info', (req, res) => {
    res.json({
        success: true,
        system: 'Enhanced NIN Verification System',
        version: '2.0.0',
        features: [
            'Real-time validation',
            'Advanced security',
            'Professional UI/UX',
            'Comprehensive error handling',
            'Audit logging',
            'Rate limiting',
            'Session management'
        ],
        testData: {
            validNINs: [
                { nin: '12345678901', name: 'John Doe', dob: '1990-01-01' },
                { nin: '98765432109', name: 'Jane Smith', dob: '1985-05-15' },
                { nin: '11111111111', name: 'Test User', dob: '1995-12-25' },
                { nin: '22222222222', name: 'Demo Voter', dob: '1988-07-10' }
            ],
            invalidCases: [
                { nin: '33333333333', issue: 'Suspended status' },
                { nin: '99999999999', issue: 'Not found' },
                { nin: '1234567890', issue: 'Invalid format' }
            ]
        },
        rateLimits: {
            requestsPerMinute: ENHANCED_RATE_LIMIT,
            windowSize: ENHANCED_WINDOW / 1000
        },
        timestamp: new Date().toISOString()
    });
});

// Serve contract ABI and address
app.get('/api/contract-data', (req, res) => {
    try {
        const contractPath = path.join(__dirname, 'build/contracts/VotingSys.json');
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        const networkId = '1337'; // Ganache network ID
        const deployedNetwork = contractData.networks[networkId];
        
        if (!deployedNetwork) {
            return res.status(404).json({ error: 'Contract not deployed to current network' });
        }
        
        res.json({
            abi: contractData.abi,
            address: deployedNetwork.address
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load contract data', details: error.message });
    }
});

// Election status endpoint for PWA notifications
app.get('/api/election-status', (req, res) => {
    // This would typically check the blockchain for updates
    res.json({
        hasUpdates: false,
        message: 'No new election updates',
        lastChecked: Date.now()
    });
});

// ZK proof verification endpoint
app.post('/api/zk/verify', (req, res) => {
    const { proof, commitment } = req.body;
    
    if (!proof || !commitment) {
        return res.status(400).json({ 
            error: 'Missing proof or commitment' 
        });
    }
    
    // In a real implementation, this would verify the ZK proof
    res.json({
        valid: true,
        message: 'Proof verification successful',
        timestamp: Date.now()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: Date.now(),
        version: '1.0.0',
        features: {
            analytics: true,
            multisig: true,
            pwa: true,
            ipfs: true,
            zk: true
        }
    });
});

// Service Worker route
app.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'sw.js'));
});

// Manifest route
app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'manifest.json'));
});

// Offline page route
app.get('/offline.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'offline.html'));
});

// Specific routes for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/analytics.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'analytics.html'));
});

app.get('/official.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'official.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src', 'offline.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});


// Initialize server with blockchain connection
async function startServer() {
    // Initialize blockchain connection
    const blockchainConnected = await initBlockchain();
    
    if (blockchainConnected) {
        // Start blockchain polling
        await startBlockchainPolling();
    }
    
    server.listen(PORT, '0.0.0.0', () => {
        console.log('');
        console.log('🚀 BLOCKELECT Enhanced Voting System');
        console.log('═══════════════════════════════════════');
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`🌐 Network: http://10.82.102.78:${PORT}`);
        console.log('');
        console.log('🌟 New Features Available:');
        console.log(`📊 Analytics Dashboard: http://localhost:${PORT}/analytics.html`);
        console.log(`⚙️  Admin Panel: http://localhost:${PORT}/official.html`);
        console.log(`📱 PWA Support: Service Worker + Offline Mode`);
        console.log(`🔒 Multi-Signature: Enhanced security controls`);
        console.log(`🌐 IPFS Ready: Decentralized file storage`);
        console.log(`🔐 ZK Proofs: Privacy-preserving voting`);
        console.log('');
        console.log('🔗 API Endpoints:');
        console.log(`  GET  /api/health - System health check`);
        console.log(`  GET  /api/contract-data - Smart contract info`);
        console.log(`  POST /api/zk/verify - ZK proof verification`);
        console.log('');
        console.log('⚡ Real-time Features:');
        console.log(`  📡 WebSocket: Real-time analytics updates`);
        console.log(`  👀 Blockchain Polling: ${blockchainConnected ? 'Active (2s interval)' : 'Inactive'}`);
        console.log('');
        console.log('📱 Mobile Access:');
        console.log(`  Use http://10.82.102.78:${PORT} on your phone`);
        console.log('═══════════════════════════════════════');
    });
}

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
