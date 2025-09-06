// IPFS Client for BLOCKELECT
// Handles decentralized file storage for candidate profiles, manifestos, and election documents

class IPFSClient {
    constructor() {
        this.ipfs = null;
        this.initialized = false;
        this.gatewayUrl = 'https://gateway.pinata.cloud/ipfs/';
        this.localGateway = 'http://127.0.0.1:8080/ipfs/';
        
        this.init();
    }

    async init() {
        try {
            // Try to initialize IPFS client
            if (typeof window !== 'undefined' && window.IpfsHttpClient) {
                // Use HTTP client for browser
                this.ipfs = window.IpfsHttpClient.create({
                    host: '127.0.0.1',
                    port: 5001,
                    protocol: 'http'
                });
            } else {
                // Fallback to public IPFS gateway for file retrieval only
                console.warn('[IPFS] Local IPFS node not available, using gateway mode');
                this.ipfs = null;
            }
            
            // Test IPFS connection
            if (this.ipfs) {
                await this.testConnection();
            }
            
            this.initialized = true;
            console.log('[IPFS] Client initialized successfully');
        } catch (error) {
            console.warn('[IPFS] Failed to initialize client:', error.message);
            this.initialized = true; // Mark as initialized to prevent retry loops
        }
    }

    async testConnection() {
        try {
            const version = await this.ipfs.version();
            console.log('[IPFS] Connected to node version:', version.version);
            return true;
        } catch (error) {
            console.warn('[IPFS] Connection test failed:', error.message);
            return false;
        }
    }

    // Upload file to IPFS
    async uploadFile(file, options = {}) {
        if (!this.ipfs) {
            throw new Error('IPFS not available. Please run a local IPFS node.');
        }

        try {
            console.log('[IPFS] Uploading file:', file.name);
            
            const result = await this.ipfs.add(file, {
                progress: options.onProgress || (() => {}),
                pin: true,
                ...options
            });

            const hash = result.cid.toString();
            console.log('[IPFS] File uploaded successfully:', hash);

            // Pin the file to ensure it stays available
            await this.pinFile(hash);

            return {
                hash,
                name: file.name,
                size: file.size,
                type: file.type,
                url: this.getFileUrl(hash),
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('[IPFS] Upload failed:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    // Upload JSON data to IPFS
    async uploadJSON(data, filename = 'data.json') {
        if (!this.ipfs) {
            throw new Error('IPFS not available. Please run a local IPFS node.');
        }

        try {
            console.log('[IPFS] Uploading JSON data:', filename);
            
            const jsonString = JSON.stringify(data, null, 2);
            const buffer = new TextEncoder().encode(jsonString);
            
            const result = await this.ipfs.add(buffer, {
                path: filename,
                pin: true
            });

            const hash = result.cid.toString();
            console.log('[IPFS] JSON uploaded successfully:', hash);

            return {
                hash,
                name: filename,
                size: buffer.length,
                type: 'application/json',
                url: this.getFileUrl(hash),
                data,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('[IPFS] JSON upload failed:', error);
            throw new Error(`Failed to upload JSON: ${error.message}`);
        }
    }

    // Retrieve file from IPFS
    async getFile(hash) {
        try {
            if (this.ipfs) {
                // Use local IPFS node if available
                console.log('[IPFS] Retrieving file from local node:', hash);
                
                const chunks = [];
                for await (const chunk of this.ipfs.cat(hash)) {
                    chunks.push(chunk);
                }
                
                return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
            } else {
                // Fallback to HTTP gateway
                console.log('[IPFS] Retrieving file from gateway:', hash);
                
                const response = await fetch(this.getFileUrl(hash));
                if (!response.ok) {
                    throw new Error(`Gateway response: ${response.status}`);
                }
                
                return new Uint8Array(await response.arrayBuffer());
            }
        } catch (error) {
            console.error('[IPFS] File retrieval failed:', error);
            throw new Error(`Failed to retrieve file: ${error.message}`);
        }
    }

    // Retrieve JSON data from IPFS
    async getJSON(hash) {
        try {
            const data = await this.getFile(hash);
            const jsonString = new TextDecoder().decode(data);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('[IPFS] JSON retrieval failed:', error);
            throw new Error(`Failed to retrieve JSON: ${error.message}`);
        }
    }

    // Pin file to local IPFS node
    async pinFile(hash) {
        if (!this.ipfs) return false;

        try {
            await this.ipfs.pin.add(hash);
            console.log('[IPFS] File pinned:', hash);
            return true;
        } catch (error) {
            console.warn('[IPFS] Pin failed:', error.message);
            return false;
        }
    }

    // Unpin file from local IPFS node
    async unpinFile(hash) {
        if (!this.ipfs) return false;

        try {
            await this.ipfs.pin.rm(hash);
            console.log('[IPFS] File unpinned:', hash);
            return true;
        } catch (error) {
            console.warn('[IPFS] Unpin failed:', error.message);
            return false;
        }
    }

    // Get file URL (uses gateway)
    getFileUrl(hash, useLocalGateway = false) {
        const gateway = useLocalGateway ? this.localGateway : this.gatewayUrl;
        return `${gateway}${hash}`;
    }

    // Check if file exists on IPFS
    async fileExists(hash) {
        try {
            if (this.ipfs) {
                const stat = await this.ipfs.files.stat(`/ipfs/${hash}`);
                return stat !== null;
            } else {
                const response = await fetch(this.getFileUrl(hash), { method: 'HEAD' });
                return response.ok;
            }
        } catch (error) {
            return false;
        }
    }

    // Get file stats
    async getFileStats(hash) {
        try {
            if (this.ipfs) {
                const stat = await this.ipfs.files.stat(`/ipfs/${hash}`);
                return {
                    hash,
                    size: stat.size,
                    blocks: stat.blocks,
                    type: stat.type
                };
            } else {
                const response = await fetch(this.getFileUrl(hash), { method: 'HEAD' });
                if (!response.ok) {
                    throw new Error(`File not found: ${hash}`);
                }
                
                return {
                    hash,
                    size: parseInt(response.headers.get('content-length')) || 0,
                    type: response.headers.get('content-type') || 'unknown'
                };
            }
        } catch (error) {
            console.error('[IPFS] Failed to get file stats:', error);
            throw error;
        }
    }

    // List pinned files
    async listPinnedFiles() {
        if (!this.ipfs) return [];

        try {
            const pins = [];
            for await (const pin of this.ipfs.pin.ls()) {
                pins.push({
                    hash: pin.cid.toString(),
                    type: pin.type
                });
            }
            return pins;
        } catch (error) {
            console.error('[IPFS] Failed to list pinned files:', error);
            return [];
        }
    }

    // Utility: Create candidate profile
    async createCandidateProfile(candidateData, photoFile = null, manifestoFile = null) {
        try {
            const profile = {
                ...candidateData,
                createdAt: Date.now(),
                version: '1.0'
            };

            // Upload photo if provided
            if (photoFile) {
                const photoResult = await this.uploadFile(photoFile);
                profile.photo = {
                    hash: photoResult.hash,
                    url: photoResult.url,
                    name: photoResult.name,
                    size: photoResult.size
                };
            }

            // Upload manifesto if provided
            if (manifestoFile) {
                const manifestoResult = await this.uploadFile(manifestoFile);
                profile.manifesto = {
                    hash: manifestoResult.hash,
                    url: manifestoResult.url,
                    name: manifestoResult.name,
                    size: manifestoResult.size
                };
            }

            // Upload the complete profile
            const profileResult = await this.uploadJSON(profile, `candidate-${candidateData.name.toLowerCase().replace(/\s+/g, '-')}.json`);

            return {
                profileHash: profileResult.hash,
                profileUrl: profileResult.url,
                profile
            };
        } catch (error) {
            console.error('[IPFS] Failed to create candidate profile:', error);
            throw error;
        }
    }

    // Utility: Create election manifest
    async createElectionManifest(electionData, documents = []) {
        try {
            const manifest = {
                ...electionData,
                documents: [],
                createdAt: Date.now(),
                version: '1.0'
            };

            // Upload documents
            for (const doc of documents) {
                const docResult = await this.uploadFile(doc);
                manifest.documents.push({
                    hash: docResult.hash,
                    url: docResult.url,
                    name: docResult.name,
                    size: docResult.size,
                    type: docResult.type
                });
            }

            // Upload the manifest
            const manifestResult = await this.uploadJSON(manifest, 'election-manifest.json');

            return {
                manifestHash: manifestResult.hash,
                manifestUrl: manifestResult.url,
                manifest
            };
        } catch (error) {
            console.error('[IPFS] Failed to create election manifest:', error);
            throw error;
        }
    }

    // Check IPFS availability
    isAvailable() {
        return this.initialized && this.ipfs !== null;
    }

    // Get client status
    getStatus() {
        return {
            initialized: this.initialized,
            connected: this.ipfs !== null,
            gatewayUrl: this.gatewayUrl,
            localGateway: this.localGateway
        };
    }
}

// File type validators
const FileValidators = {
    image: (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid image type. Allowed: JPEG, PNG, GIF, WebP');
        }
        
        if (file.size > maxSize) {
            throw new Error('Image too large. Maximum size: 5MB');
        }
        
        return true;
    },
    
    document: (file) => {
        const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid document type. Allowed: PDF, TXT, DOC, DOCX');
        }
        
        if (file.size > maxSize) {
            throw new Error('Document too large. Maximum size: 10MB');
        }
        
        return true;
    }
};

// Export for browser usage
if (typeof window !== 'undefined') {
    window.IPFSClient = IPFSClient;
    window.FileValidators = FileValidators;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IPFSClient, FileValidators };
}
