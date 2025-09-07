// BLOCKELECT Voting Debug Helper
// This script provides comprehensive debugging for voting issues

const VotingDebug = {
    // Debug flag
    enabled: true,

    log: function(message, data = null) {
        if (this.enabled) {
            console.log(`[VOTING DEBUG] ${message}`, data || '');
        }
    },

    error: function(message, error = null) {
        if (this.enabled) {
            console.error(`[VOTING DEBUG ERROR] ${message}`, error || '');
        }
    },

    // Check all voting prerequisites
    checkVotingPrerequisites: async function() {
        const checks = {
            walletConnected: false,
            contractInitialized: false,
            candidateSelected: false,
            hasVoted: null,
            electionActive: null,
            gasBalance: null,
            networkCorrect: false
        };

        try {
            // 1. Check wallet connection
            if (window.ethereum && App.account) {
                checks.walletConnected = true;
                this.log("✅ Wallet connected", App.account);
            } else {
                this.error("❌ Wallet not connected");
            }

            // 2. Check contract initialization
            if (App.contract) {
                checks.contractInitialized = true;
                this.log("✅ Contract initialized", App.contract.options.address);
            } else {
                this.error("❌ Contract not initialized");
            }

            // 3. Check candidate selection
            if (App.selectedCandidate !== null && App.selectedCandidate >= 0) {
                checks.candidateSelected = true;
                this.log("✅ Candidate selected", App.selectedCandidate);
            } else {
                this.error("❌ No candidate selected");
            }

            // 4. Check if already voted
            if (App.contract && App.account) {
                try {
                    checks.hasVoted = await App.contract.methods.hasVoted(App.account).call();
                    if (checks.hasVoted) {
                        this.error("❌ User has already voted");
                    } else {
                        this.log("✅ User has not voted yet");
                    }
                } catch (err) {
                    this.error("Error checking voting status", err);
                }
            }

            // 5. Check election timing
            if (App.contract) {
                try {
                    const startDate = await App.contract.methods.startDate().call();
                    const endDate = await App.contract.methods.endDate().call();
                    const currentTime = Math.floor(Date.now() / 1000);

                    this.log("Election timing", {
                        startDate: Number(startDate),
                        endDate: Number(endDate),
                        currentTime: currentTime,
                        startDateReadable: new Date(Number(startDate) * 1000).toString(),
                        endDateReadable: new Date(Number(endDate) * 1000).toString()
                    });

                    if (Number(startDate) === 0 || Number(endDate) === 0) {
                        this.error("❌ Election dates not set");
                        checks.electionActive = false;
                    } else if (currentTime < Number(startDate)) {
                        this.error("❌ Election not started yet");
                        checks.electionActive = false;
                    } else if (currentTime > Number(endDate)) {
                        this.error("❌ Election has ended");
                        checks.electionActive = false;
                    } else {
                        this.log("✅ Election is active");
                        checks.electionActive = true;
                    }
                } catch (err) {
                    this.error("Error checking election dates", err);
                }
            }

            // 6. Check gas balance
            if (App.web3 && App.account) {
                try {
                    const balance = await App.web3.eth.getBalance(App.account);
                    const balanceEth = App.web3.utils.fromWei(balance, 'ether');
                    checks.gasBalance = parseFloat(balanceEth);
                    
                    if (checks.gasBalance > 0.001) {
                        this.log("✅ Sufficient gas balance", `${balanceEth} ETH`);
                    } else {
                        this.error("❌ Low gas balance", `${balanceEth} ETH`);
                    }
                } catch (err) {
                    this.error("Error checking gas balance", err);
                }
            }

            // 7. Check network
            if (App.web3) {
                try {
                    const chainId = await App.web3.eth.getChainId();
                    if (Number(chainId) === 1337) {
                        checks.networkCorrect = true;
                        this.log("✅ On correct network (Ganache)", chainId);
                    } else {
                        this.error("❌ Wrong network", `Chain ID: ${chainId}, Expected: 1337`);
                    }
                } catch (err) {
                    this.error("Error checking network", err);
                }
            }

        } catch (err) {
            this.error("Error during prerequisite checks", err);
        }

        return checks;
    },

    // Test vote transaction (dry run)
    testVoteTransaction: async function(candidateIndex = null) {
        if (candidateIndex === null) {
            candidateIndex = App.selectedCandidate;
        }

        if (!App.contract || !App.account) {
            this.error("Contract or account not available");
            return false;
        }

        try {
            this.log("Testing vote transaction", { candidateIndex });

            // Try to estimate gas
            const gasEstimate = await App.contract.methods.vote(candidateIndex).estimateGas({
                from: App.account
            });

            this.log("Gas estimate successful", gasEstimate);

            // Try to call the method (read-only)
            await App.contract.methods.vote(candidateIndex).call({
                from: App.account
            });

            this.log("✅ Vote transaction test passed");
            return true;

        } catch (err) {
            this.error("❌ Vote transaction test failed", err);
            
            // Decode common error messages
            if (err.message.includes('revert')) {
                if (err.message.includes('Already voted')) {
                    this.error("Reason: User has already voted");
                } else if (err.message.includes('Election not active')) {
                    this.error("Reason: Election is not active");
                } else if (err.message.includes('Invalid candidate')) {
                    this.error("Reason: Invalid candidate index");
                } else {
                    this.error("Reason: Contract revert", err.message);
                }
            }
            
            return false;
        }
    },

    // Get comprehensive system status
    getSystemStatus: async function() {
        this.log("=".repeat(50));
        this.log("BLOCKELECT VOTING SYSTEM STATUS");
        this.log("=".repeat(50));

        const checks = await this.checkVotingPrerequisites();
        
        this.log("Summary:");
        Object.keys(checks).forEach(key => {
            const status = checks[key];
            const icon = status === true ? "✅" : status === false ? "❌" : "⚠️";
            this.log(`${icon} ${key}: ${status}`);
        });

        // Test vote if possible
        if (checks.walletConnected && checks.contractInitialized && checks.candidateSelected) {
            this.log("Testing vote transaction...");
            await this.testVoteTransaction();
        }

        this.log("=".repeat(50));
    },

    // Quick fix suggestions
    getSuggestions: async function() {
        const checks = await this.checkVotingPrerequisites();
        const suggestions = [];

        if (!checks.walletConnected) {
            suggestions.push("Connect your MetaMask wallet");
        }

        if (!checks.networkCorrect) {
            suggestions.push("Switch to Ganache network (Chain ID 1337)");
        }

        if (checks.gasBalance !== null && checks.gasBalance < 0.001) {
            suggestions.push("Get more ETH from Ganache for gas fees");
        }

        if (!checks.candidateSelected) {
            suggestions.push("Select a candidate before voting");
        }

        if (checks.hasVoted === true) {
            suggestions.push("You have already voted in this election");
        }

        if (checks.electionActive === false) {
            suggestions.push("Ask an official to set proper election dates");
        }

        if (suggestions.length === 0) {
            suggestions.push("All prerequisites look good! Try voting again.");
        }

        this.log("Suggestions:", suggestions);
        return suggestions;
    }
};

// Auto-run debug on page load if there are issues
window.addEventListener('load', () => {
    // Wait for App to initialize
    setTimeout(() => {
        if (typeof App !== 'undefined' && VotingDebug.enabled) {
            VotingDebug.log("Debug helper loaded. Use VotingDebug.getSystemStatus() to diagnose issues.");
        }
    }, 2000);
});

// Export for global use
window.VotingDebug = VotingDebug;
