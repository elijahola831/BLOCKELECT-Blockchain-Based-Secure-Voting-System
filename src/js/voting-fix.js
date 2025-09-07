// BLOCKELECT Simple Voting Fix Script
// Provides immediate solutions for common voting issues

window.VotingFix = {
    
    // Check and fix common voting issues
    checkAndFix: async function() {
        console.log("🔧 BLOCKELECT Voting Fix - Checking system...");
        
        // 1. Check if App is loaded
        if (typeof App === 'undefined') {
            console.error("❌ App not loaded. Please refresh the page and wait for full load.");
            return false;
        }
        
        // 2. Check MetaMask connection
        if (!App.account) {
            console.warn("⚠️  Not connected to MetaMask. Attempting connection...");
            try {
                await App.connectWallet();
                console.log("✅ MetaMask connection initiated");
            } catch (err) {
                console.error("❌ MetaMask connection failed:", err.message);
                return false;
            }
        }
        
        // 3. Check contract
        if (!App.contract) {
            console.error("❌ Contract not initialized. Please check if contracts are deployed.");
            return false;
        }
        
        // 4. Check election dates
        try {
            const startDate = await App.contract.methods.startDate().call();
            const endDate = await App.contract.methods.endDate().call();
            const now = Math.floor(Date.now() / 1000);
            
            console.log("📅 Election Status:");
            console.log("   Start Date:", Number(startDate) === 0 ? "Not Set" : new Date(Number(startDate) * 1000));
            console.log("   End Date:", Number(endDate) === 0 ? "Not Set" : new Date(Number(endDate) * 1000));
            console.log("   Current Time:", new Date(now * 1000));
            
            if (Number(startDate) === 0 || Number(endDate) === 0) {
                console.error("❌ Election dates not set!");
                console.log("💡 SOLUTION: Ask an official to:");
                console.log("   1. Go to http://localhost:3000/official.html");
                console.log("   2. Click 'Setup Election Now' button");
                console.log("   3. Or manually set election dates");
                return false;
            }
            
            if (now < Number(startDate)) {
                console.error("❌ Election hasn't started yet!");
                const startTime = new Date(Number(startDate) * 1000);
                console.log(`💡 Election starts at: ${startTime}`);
                return false;
            }
            
            if (now > Number(endDate)) {
                console.error("❌ Election has ended!");
                const endTime = new Date(Number(endDate) * 1000);
                console.log(`💡 Election ended at: ${endTime}`);
                return false;
            }
            
            console.log("✅ Election is currently active");
            
        } catch (err) {
            console.error("❌ Error checking election dates:", err);
            return false;
        }
        
        // 5. Check if already voted
        try {
            const hasVoted = await App.contract.methods.hasVoted(App.account).call();
            if (hasVoted) {
                console.warn("⚠️  You have already voted in this election");
                return false;
            }
            console.log("✅ You haven't voted yet");
        } catch (err) {
            console.error("❌ Error checking vote status:", err);
            return false;
        }
        
        // 6. Check candidates
        try {
            const result = await App.contract.methods.getCandidates().call();
            let candidateCount = 0;
            
            if (result.names) {
                candidateCount = result.names.length;
            } else if (result[0]) {
                candidateCount = result[0].length;
            }
            
            if (candidateCount === 0) {
                console.error("❌ No candidates registered!");
                console.log("💡 SOLUTION: Ask an official to register candidates first");
                return false;
            }
            
            console.log(`✅ ${candidateCount} candidates available`);
            
        } catch (err) {
            console.error("❌ Error checking candidates:", err);
            return false;
        }
        
        // 7. Check gas balance
        try {
            const balance = await App.web3.eth.getBalance(App.account);
            const balanceEth = parseFloat(App.web3.utils.fromWei(balance, 'ether'));
            
            if (balanceEth < 0.001) {
                console.warn("⚠️  Low gas balance:", balanceEth, "ETH");
                console.log("💡 SOLUTION: Get more ETH from Ganache");
                // Don't return false, might still work
            } else {
                console.log("✅ Sufficient gas balance:", balanceEth, "ETH");
            }
        } catch (err) {
            console.error("❌ Error checking gas balance:", err);
        }
        
        console.log("🎉 All checks passed! You should be able to vote now.");
        console.log("📋 To vote: 1) Select a candidate 2) Click 'Cast Vote' 3) Confirm in MetaMask");
        
        return true;
    },
    
    // Quick status check
    quickStatus: function() {
        const status = {
            app: typeof App !== 'undefined',
            connected: App?.account ? true : false,
            contract: App?.contract ? true : false,
            metamask: typeof window.ethereum !== 'undefined',
            selectedCandidate: App?.selectedCandidate
        };
        
        console.log("📊 Quick Status:", status);
        return status;
    },
    
    // Force reload candidates and dates
    refresh: async function() {
        console.log("🔄 Refreshing election data...");
        if (App && App.loadCandidates) {
            await App.loadCandidates();
            console.log("✅ Candidates refreshed");
        }
        if (App && App.loadElectionDates) {
            await App.loadElectionDates();
            console.log("✅ Election dates refreshed");
        }
    }
};

// Auto-load and provide helpful commands
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log("🔧 Voting Fix Helper loaded!");
        console.log("Commands available:");
        console.log("  VotingFix.checkAndFix() - Full diagnosis and fix attempt");
        console.log("  VotingFix.quickStatus() - Quick status check");
        console.log("  VotingFix.refresh() - Refresh election data");
        console.log("  debugVoting() - Simple debug info");
    }, 2000);
});
