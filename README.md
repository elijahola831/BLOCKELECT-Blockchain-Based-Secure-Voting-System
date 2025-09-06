# 🚀 BLOCKELECT: Enterprise-Grade Blockchain Voting System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![Ethereum](https://img.shields.io/badge/blockchain-Ethereum-blue)](https://ethereum.org/)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple)](https://web.dev/progressive-web-apps/)
[![Status](https://img.shields.io/badge/status-production--ready-green)](https://github.com/elijahola831/BLOCKELECT-Blockchain-Based-Secure-Voting-System)

## 💡 Project Overview

**BLOCKELECT** is a cutting-edge, enterprise-grade blockchain voting system that transforms traditional electoral processes through advanced decentralized technologies. This isn't just a basic voting application—it's a comprehensive election management platform featuring **5 major advanced technologies** that demonstrate mastery of modern blockchain, web3, and progressive web development.

*Traditional electoral systems exhibit critical vulnerabilities including vote manipulation, centralized points of failure, and compromised transparency that undermine democratic integrity. BLOCKELECT addresses these challenges through an advanced blockchain-based architecture that employs multiple layers of security, privacy, and decentralization.*

### 🎓 Academic Excellence
> This software was developed as part of a final year project at the Department of Computer Science, Olusegun Agagu University of Science and Technology, Ondo State, titled **'Development of a Secure E-voting System using Blockchain Technology'** by **Ughili Samuel Adiwu**.

---

## 🌟 **ENTERPRISE FEATURES** (What Makes This Project Unique)

### 🚀 **5 Advanced Technology Implementations:**

#### 1. 📊 **Real-Time Analytics Dashboard**
- **Interactive Charts**: Live vote distribution and activity monitoring using Chart.js
- **Real-Time Metrics**: Voter turnout, candidate rankings, time remaining
- **Export Functionality**: CSV export for election data analysis
- **Mobile Responsive**: Professional dashboard accessible on all devices
- **Live Activity Feed**: Real-time blockchain transaction monitoring

#### 2. 🔒 **Multi-Signature Security Controls** 
- **Enhanced Smart Contract**: Proposal-based multi-signature system
- **Distributed Authority**: 2-of-3 or 3-of-5 signature requirements for critical operations
- **Proposal System**: Democratic approval process for election management
- **Audit Trail**: Complete history of all administrative actions
- **Security Model**: Used by major DeFi protocols like Gnosis Safe

#### 3. 📱 **Progressive Web App (PWA)**
- **Installable Application**: Works like native mobile app
- **Offline Functionality**: Vote queuing and cached data access
- **Push Notifications**: Real-time election updates
- **Background Sync**: Automatic vote submission when connection restored
- **Service Worker**: Advanced caching and offline capabilities

#### 4. 🌐 **IPFS Decentralized Storage**
- **Candidate Profiles**: Decentralized storage for photos and manifestos
- **Document Management**: Upload and manage election-related files
- **Gateway Fallback**: Works with local IPFS nodes or public gateways
- **File Validation**: Automatic type and size validation
- **Censorship Resistance**: Immutable file storage on IPFS network

#### 5. 🔐 **Zero-Knowledge Proof Privacy**
- **Anonymous Voting**: Vote choices remain private but verifiable
- **Cryptographic Proofs**: Mathematical guarantees of vote validity
- **Nullifier System**: Prevents double voting while maintaining privacy
- **Vote Encryption**: Secure vote storage with selective disclosure
- **Cutting-Edge Technology**: Implements ZK-SNARKs concepts

---

## ✨ **Core Blockchain Features**

### 🔐 **Security & Authentication**
- **Web3 Wallet Integration**: MetaMask authentication for secure voter verification
- **Smart Contract Security**: Immutable voting rules enforced on-chain
- **Multi-Signature Controls**: Enhanced security requiring multiple approvals
- **Cryptographic Privacy**: Zero-knowledge proofs for anonymous voting

### 🌐 **Decentralized Architecture**
- **Ethereum Blockchain**: Distributed consensus and tamper-proof storage
- **IPFS Integration**: Decentralized file storage for candidate profiles
- **No Central Database**: Eliminates single points of failure
- **Distributed Validation**: Real-time transaction validation across nodes

### 📈 **Advanced Monitoring**
- **Real-Time Analytics**: Live election monitoring and statistics
- **Blockchain Events**: Real-time transaction and vote tracking
- **Audit Capabilities**: Complete election transparency and verification
- **Export Functions**: Data export for analysis and reporting

---

## 🛠️ **Technology Stack & Requirements**

### **Core Technologies:**
- **Blockchain**: Ethereum, Solidity ^0.8.0, Web3.js
- **Backend**: Node.js ^22.0.0, Express.js ^4.21.0
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Chart.js ^4.4.0
- **Smart Contracts**: Truffle ^5.11.5, Ganache
- **Security**: MetaMask wallet integration
- **Storage**: IPFS for decentralized file storage
- **PWA**: Service Workers, Web App Manifest

### **Enhanced Dependencies:**
- **Analytics**: Chart.js for real-time visualizations
- **IPFS**: ipfs-http-client for decentralized storage
- **Privacy**: snarkjs, circomlib for zero-knowledge proofs
- **PWA**: Service Workers for offline functionality
- **Security**: Multi-signature smart contract controls

### **Recommended Versions:**
- Node.js `v22.14.0` or higher
- Web3.js `v1.10.0`
- Express.js `v4.21.0`
- Solidity `v0.8.19`
- Truffle `v5.11.5`
- Ganache `v2.7.1`
- MetaMask `v13.1.0`
- Chart.js `v4.4.0`

---

## 🌐 **Access Your Enhanced System**

Once running, explore all the advanced features:

### 📱 **Main Interfaces:**
1. **🗳️ Voting Interface**: http://localhost:3000
2. **📊 Analytics Dashboard**: http://localhost:3000/analytics.html ⭐
3. **⚙️ Admin Panel**: http://localhost:3000/official.html
4. **🔍 System Health**: http://localhost:3000/api/health

### 📱 **Progressive Web App Features:**
- **Install the App**: Look for install prompt in your browser
- **Offline Mode**: Works without internet connection
- **Push Notifications**: Real-time election updates
- **Mobile Optimized**: Responsive design for all devices

### 📈 **API Endpoints:**
- `GET /api/health` - System status and feature availability
- `GET /api/contract-data` - Smart contract ABI and address
- `POST /api/zk/verify` - Zero-knowledge proof verification
- `GET /api/election-status` - Current election status

---

## 📱 **Screenshots & Interface Previews**

| Feature | Preview |
|---------|----------|
| **Analytics Dashboard** | Real-time charts and metrics |
| **PWA Installation** | Installable like native app |
| **Voting Interface** | Clean, intuitive voting experience |
| **Multi-Signature Admin** | Enhanced security controls |
| **Offline Mode** | Works without internet |

![Voting Interface](./views/voting.png)
![Analytics Dashboard](./views/commission_dashboard.png)
![Wallet Integration](./views/wallet_required.png)

---

## 🚀 **Quick Start Guide**

### **Prerequisites:**
- **Node.js** v22.14.0+ - [Download here](https://nodejs.org/)
- **MetaMask** browser extension - [Install here](https://metamask.io/)
- **Git** (optional) - For cloning repository
- **Modern Browser** - Chrome, Firefox, Edge, Safari

### **⚡ Instant Setup (Recommended)**

#### **Option 1: Download & Run**
```bash
# 1. Download from GitHub (or git clone)
# 2. Extract and navigate to folder
# 3. Install and start:

npm install
npm start

# 🎉 Your enhanced BLOCKELECT is now running!
# 📊 Visit: http://localhost:3000/analytics.html
```

#### **Option 2: Full Development Setup**
```bash
# Clone the repository
git clone https://github.com/elijahola831/BLOCKELECT-Blockchain-Based-Secure-Voting-System.git
cd BLOCKELECT-Blockchain-Based-Secure-Voting-System

# Install dependencies
npm install

# Start Ganache blockchain (Terminal 1)
npm run ganache

# Compile & deploy contracts (Terminal 2)
npm run compile
npm run migrate

# Bundle frontend assets
npm run bundle

# Start the enhanced server
npm start
```

### **🌟 Enhanced Features Ready!**
Once running, immediately access:
- **📊 Analytics Dashboard**: http://localhost:3000/analytics.html
- **📱 Install PWA**: Look for install prompt
- **🔒 Multi-Sig Admin**: Enhanced security controls
- **🌐 IPFS Storage**: Decentralized file management
- **🔐 ZK Privacy**: Anonymous voting capabilities

### 📋 Manual Setup (Step by Step)

If you prefer to run each step manually:

1. **Download the project:**
   - **Option A (ZIP):** Download ZIP from GitHub, extract to your desired location
   - **Option B (Git):** `git clone https://github.com/elijahola831/BLOCKELECT-Blockchain-Based-Secure-Voting-System.git`
   - Navigate to the project folder using terminal/command prompt

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Ganache (Local Blockchain):**
   ```bash
   # Using npm script (recommended)
   npm run ganache
   
   # Wait for "Listening on 127.0.0.1:7545" message
   ```

4. **In a new terminal, compile Smart Contracts:**
   ```bash
   npm run compile
   ```

5. **Deploy Contracts to Local Network:**
   ```bash
   npm run migrate
   ```

6. **Bundle Frontend Assets:**
   ```bash
   npm run bundle
   ```

7. **Start the Application Server:**
   ```bash
   npm start
   # Server will run at http://localhost:3000
   # Also accessible from other devices on your network
   ```

### 🔗 MetaMask Configuration

**Step 1: Install MetaMask**
- Install the MetaMask browser extension from [metamask.io](https://metamask.io)

**Step 2: Add Ganache Local Network**
1. Open MetaMask → Click network dropdown → "Add Network" or "Custom RPC"
2. Enter these **exact** values:
   - **Network Name:** `Ganache Local`
   - **New RPC URL:** `http://127.0.0.1:7545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
   - **Block Explorer URL:** (leave empty)
3. Click "Save"

**Step 3: Import Test Account**
1. In MetaMask: Account menu → "Import Account"
2. Select "Private Key"
3. Enter this test private key:
   ```
   0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
   ```
4. Click "Import" - you should see ~100 ETH balance

**Step 4: Switch to Ganache Network**
1. Click network dropdown in MetaMask
2. Select "Ganache Local"
3. Verify you're connected to the imported account

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. "Failed to authenticate to MetaMask" Error**
- **Cause:** MetaMask not connected to the correct network or account
- **Solution:**
  ```bash
  # 1. Ensure Ganache is running
  npm run ganache
  
  # 2. Check MetaMask network settings match exactly:
  #    - Network: Ganache Local
  #    - RPC URL: http://127.0.0.1:7545
  #    - Chain ID: 1337
  
  # 3. Reset MetaMask connection:
  #    MetaMask → Settings → Advanced → Reset Account
  ```

**2. "Out of Gas" or "Invalid ABI" Error**
- **Cause:** Smart contracts not deployed or deployed to wrong network
- **Solution:**
  ```bash
  # 1. Restart Ganache (this creates a fresh blockchain)
  # Stop existing Ganache and run:
  npm run ganache
  
  # 2. In new terminal, redeploy contracts:
  npm run migrate
  
  # 3. Restart the web server:
  npm start
  ```

**3. Port Already in Use**
- **Cause:** Previous Ganache instance still running
- **Solution (Windows):**
  ```powershell
  # Find and kill processes using ports 7545 or 3000
  netstat -ano | findstr ":7545\|:3000"
  taskkill /PID <process_id> /F
  ```
- **Solution (Mac/Linux):**
  ```bash
  # Kill processes using the ports
  lsof -ti:7545 | xargs kill -9
  lsof -ti:3000 | xargs kill -9
  ```

**4. "Cannot find module" Errors**
- **Cause:** Dependencies not installed properly
- **Solution:**
  ```bash
  # Clean install dependencies
  rm -rf node_modules package-lock.json
  npm install
  ```

**5. MetaMask "Nonce too high" Error**
- **Cause:** MetaMask nonce mismatch with fresh Ganache blockchain
- **Solution:**
  1. MetaMask → Settings → Advanced → Reset Account
  2. This clears transaction history and resets nonce

**6. "ECONNREFUSED" Connection Error**
- **Cause:** Ganache not running or wrong port configuration
- **Solution:**
  ```bash
  # 1. Verify Ganache is running:
  npm run ganache
  
  # 2. Check if port 7545 is accessible:
  # Windows: telnet 127.0.0.1 7545
  # Mac/Linux: nc -zv 127.0.0.1 7545
  
  # 3. Verify truffle-config.js has correct port (7545)
  ```

### Quick Reset (Nuclear Option)
If all else fails, complete reset:
```bash
# 1. Stop all processes
# 2. Clear everything and restart
rm -rf node_modules build dist/app.bundle.js
npm install
npm run setup
npm start
```

### **📚 Additional Documentation**
- **ENHANCED_FEATURES.md** - Comprehensive guide to all 5 advanced features
- **PROJECT_COMPLETION.md** - Setup instructions and troubleshooting
- **FINAL_STATUS.md** - Current project status and quick reference

### **🆘 Getting Help**
- Check browser console for detailed error messages
- Verify MetaMask is connected to Ganache Local network
- Ensure sufficient ETH in MetaMask (test account has ~100 ETH)
- Use `npm start` for quick setup
- Visit `/api/health` to check system status

---

## 🏆 **Why This Project Stands Out**

### **🚀 Technical Excellence**
- **Enterprise-Grade Architecture**: Multi-signature security, real-time analytics
- **Cutting-Edge Technologies**: Zero-knowledge proofs, IPFS, PWA
- **Production-Ready**: Scalable design with comprehensive error handling
- **Mobile-First**: Responsive design with offline capabilities

### **📚 Academic Value**
- **Multiple Complex Systems**: Successfully integrates 5 advanced technologies
- **Real-World Applications**: Solves actual problems in digital voting
- **Advanced Concepts**: Demonstrates deep blockchain understanding
- **Professional Documentation**: Comprehensive guides and API documentation

### **🌟 Innovation Highlights**
1. **Privacy-Preserving Voting**: ZK-proofs for anonymous but verifiable elections
2. **Decentralized Infrastructure**: IPFS storage eliminates single points of failure
3. **Real-Time Transparency**: Live analytics for complete election monitoring
4. **Enhanced Security**: Multi-signature controls prevent unauthorized actions
5. **Progressive Technology**: PWA with offline voting and push notifications

---

## 📝 **Project Documentation**

### **📁 File Structure**
```
BLOCKELECT/
├── src/
│   ├── analytics.html          # 📊 Real-time analytics dashboard
│   ├── js/
│   │   ├── analytics.js         # Chart.js visualizations
│   │   ├── ipfs-client.js       # 🌐 IPFS integration
│   │   └── zk-voting.js         # 🔐 Zero-knowledge proofs
│   ├── manifest.json           # 📱 PWA configuration
│   ├── sw.js                   # Service Worker
│   └── offline.html            # Offline page
├── contracts/
│   └── VotingSys.sol           # 🔒 Enhanced multi-sig contract
├── server.js                   # ⚙️ Enhanced Express server
└── docs/
    ├── ENHANCED_FEATURES.md     # Feature documentation
    ├── PROJECT_COMPLETION.md    # Setup guide
    └── FINAL_STATUS.md          # Status summary
```

### **🔍 API Reference**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System status and feature availability |
| `/api/contract-data` | GET | Smart contract ABI and address |
| `/api/zk/verify` | POST | Zero-knowledge proof verification |
| `/api/election-status` | GET | Current election status for PWA |

---

## 🎆 **Future Enhancements**

### **🔄 Potential Additions**
- **Identity Verification**: KYC/AML integration for voter validation
- **Advanced Analytics**: Machine learning for voting pattern analysis
- **Multi-Chain Support**: Deploy on Polygon, BSC, or other networks
- **Mobile App**: React Native companion application
- **Advanced ZK Circuits**: Custom circuits for specific voting scenarios

---

## 🤝 **Contributing**

Contributions are welcome! This project demonstrates advanced blockchain concepts and welcomes improvements in:
- Enhanced ZK-proof implementations
- Additional IPFS features
- Advanced analytics capabilities
- Mobile app development
- Security enhancements

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Ethereum Foundation** - For blockchain technology
- **IPFS Team** - For decentralized storage solutions
- **Chart.js Community** - For visualization libraries
- **Web3 Community** - For decentralized web technologies
- **Department of Computer Science, OAUSTECH** - For academic support

---

## 📞 **Contact & Support**

**Developer**: Ughili Samuel Adiwu  
**Institution**: Department of Computer Science, Olusegun Agagu University of Science and Technology  
**Project**: Final Year Project - Blockchain-Based Secure Voting System

### **🔗 Links**
- **GitHub Repository**: [BLOCKELECT](https://github.com/elijahola831/BLOCKELECT-Blockchain-Based-Secure-Voting-System)
- **Live Demo**: Available after running `npm start`
- **Documentation**: See `/docs` folder for comprehensive guides

---

<div align="center">

**⭐ If you found this project impressive, please give it a star! ⭐**

**🚀 BLOCKELECT: Transforming Digital Democracy Through Blockchain Innovation 🚀**

*Made with ❤️ by Samuel Ughili | Powered by Ethereum & Advanced Web Technologies*

</div>

## 🚀 Deployment

### Development Mode
```bash
# Start with auto-restart on file changes
npm run dev
```

### Testing
```bash
# Ensure Ganache is running first
npm test
```

### Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Ethereum Testnet/Mainnet:**
   - Update `truffle-config.js` with your network configuration
   - Add your private key and Infura/Alchemy endpoint
   - Run migrations:
     ```bash
     truffle migrate --network <network_name>
     ```

3. **Deploy the web server:**
   - The application can be deployed to any Node.js hosting platform
   - Ensure all environment variables are properly configured
   - Update contract addresses in the frontend if deployed to different networks

### Usage Instructions

**For Voters:**
1. Visit http://localhost:3000
2. Connect MetaMask wallet
3. Select a candidate from the list
4. Cast your vote (requires gas fee)

**For Electoral Officials:**
1. Visit http://localhost:3000/official.html
2. Connect MetaMask wallet (must be the contract deployer)
3. Register candidates
4. Set election start/end dates
5. Monitor election progress
6. Reset election if needed

## 📂 Structure

The project directory is organised as follows:

```
BLOCKELECT (Prototype)              # Project root directory
|
├── build/                          # Contract build artifacts
│   └── contracts/
│       └── VotingSys.json
├── contracts/                      # Solidity smart contracts
│   └── VotingSys.sol
├── dist/                           # Bundled/compiled frontend files for deployment
│   └── app.bundle.js
├── migrations/                     # Truffle migration scripts
│   └── 1_deploy_contracts.js
├── node_modules/                   # NPM dependencies
├── src/                            # Application source files
│   ├── assets/                     # Media assets
│   │   ├── blockchain.mp4
│   │   ├── favicon.svg
│   │   └── logo.svg
│   ├── css/                        # UI stylesheets
│   │   ├── alert.css
│   │   ├── index.css
│   │   └── official.css
│   ├── icons/                      # Bootstrap icon set
│   │   ├── fonts/
│   │   └── bootstrap-icons.css
│   ├── js/                         # JavaScript logic files
│   │   ├── alert.js
│   │   └── app.js
│   ├── sounds/                     # Sound effects
│   │   ├── error.wav
│   │   ├── info.wav
│   │   ├── success.wav
│   │   └── warning.wav
│   ├── index.html                  # Voter-facing interface
│   └── official.html               # Official (admin) interface
├── views/                          # UI screenshots for documentation
│   ├── commission_dashboard.png
│   ├── official_detected.png
│   ├── sign_in.png
│   ├── voter_detected.png
│   ├── voting.png
│   └── wallet_required.png
├── LICENSE                         # Project license file
├── package-lock.json               # Locked versions of Node.js dependencies
├── package.json                    # Project metadata & Node.js package configuration
├── README.md                       # Project documentation
├── server.js                       # Backend server (Node.js application entry-point)
└── truffle-config.js               # Truffle configuration file
```

## ⚖️ License

This project is licensed under the MIT License―you are free to use, modify, and distribute of it, with attribution, but without warranty. To see a full breakdown of this license, click [here](./LICENSE).

**Attribution**

All the sound effects included in this project are from Microsoft Windows, which are the property of Microsoft Corporation. These sounds are used for demonstration purposes only and remain subject to Microsoft’s copyright and licensing terms.

---

Give this repository a ⭐ if you like it.