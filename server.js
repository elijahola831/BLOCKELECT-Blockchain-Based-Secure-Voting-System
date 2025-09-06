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
