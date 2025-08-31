# BLOCKELECT: Blockchain-Based Secure Voting System

## 💡 Abstract

*Traditional electoral systems exhibit critical vulnerabilities including vote manipulation, centralized points of failure, and compromised transparency that undermine democratic integrity. This research presents a decentralised blockchain-based secure voting system designed to address these challenges. The system employs Ethereum smart contracts written in Solidity to enforce immutable voting rules, Web3.js for blockchain integration, and MetaMask wallet authentication for secure voter verification. The architecture implements dual interfaces for voters and electoral commissions, with distributed consensus mechanisms ensuring real-time transaction validation. Smart contracts automatically enforce electoral rules while maintaining cryptographic immutability of voting transactions. The decentralised design eliminates single points of failure by distributing vote storage and validation across multiple nodes. System validation included unit, integration, system, and security testing. Results show prevention of vote tampering, elimination of double voting, and transparent, auditable election results. Implementation used Truffle framework, Ganache blockchain simulation, and Node.js back-end services following an Agile Prototype-based Iterative Development methodology. This work demonstrates blockchain’s feasibility in creating trustworthy electoral systems, offering a viable solution to electoral fraud and public confidence issues.*

> This software was developed as part of a final year project work at the Department of Computer Science, Plateau State University, Bokkos, titled ‘Design and Implementation of a Blockchain-Based Secure Voting System’ by Ughili Samuel Adiwu. The paper would be available here after it has been defended.

## ⚙️ Features

- Uses Web3 wallet authentication for secure, decentralised user address verification.
- Employs Ethereum smart contracts to immutably record and secure votes on-chain.
- Removes centralised databases by using blockchain’s tamper-proof distributed ledger.
- Offers a permissioned commission dashboard with role-based management controls and real-time election monitoring.
- Provides a clean UI for seamless voting, transparent candidate information, and live blockchain feedback.

## 🛠️ Requirements

The following software versions are recommended for deploying this application (other versions might work).

- Node.js `v22.14.0`
- Web3.js `v1.10.0`
- Express.js `v4.17.14`
- Solidity `v0.8.19` (solc-js)
- Truffle `v5.11.5` (core: 5.11.5)
- Ganache GUI `v2.7.1` (or Ganache CLI `v7.9.1`)
- MetaMask `v13.1.0`
- ESBuild `v0.25.9` (or Browserify + Babelify or any ES6 bundler)

## 📱 Screenshots

 ![No Wallet (Voting Page)](./views/wallet_required.png)
 ![Sign In (Voting Page)](./views/sign_in.png)
 ![Voter Detected (Electoral Commission Dashboard)](./views/voter_detected.png)
 ![Voting Page](./views/voting.png)
 ![Official Detected (Voting Page)](./views/official_detected.png)
 ![Electoral Commission Dashboard](./views/commission_dashboard.png)

## 📥 Set Up

### Prerequisites
1. **Node.js** (v22.14.0 or higher)
2. **Git** for version control
3. **MetaMask** browser extension
4. **Ganache** for local blockchain simulation

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elijahola831/BLOCKELECT-Blockchain-Based-Secure-Voting-System.git
   cd BLOCKELECT-Blockchain-Based-Secure-Voting-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Ganache (Local Blockchain):**
   ```bash
   # Option 1: Using npm script
   npm run ganache
   
   # Option 2: Using Ganache GUI
   # Download and run Ganache GUI with these settings:
   # - Port: 7545
   # - Network ID: 1337
   # - Accounts: 10
   ```

4. **Compile Smart Contracts:**
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
   ```

### MetaMask Configuration

1. Install MetaMask browser extension
2. Add local Ganache network:
   - **Network Name:** Ganache Local
   - **RPC URL:** http://127.0.0.1:7545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH
3. Import test accounts using private keys from Ganache

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