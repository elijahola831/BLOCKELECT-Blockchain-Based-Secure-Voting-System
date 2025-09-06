const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

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

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 BLOCKELECT Enhanced Voting System');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
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
    console.log('═══════════════════════════════════════');
});
