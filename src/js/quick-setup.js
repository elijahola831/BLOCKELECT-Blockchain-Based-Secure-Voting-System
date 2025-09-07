// BLOCKELECT Quick Setup Script
// This script helps officials quickly set up the election for testing

const QuickSetup = {
    // Set up election for immediate testing
    setupElectionNow: async function() {
        if (!App.contract || !App.account) {
            console.error('Contract or account not available');
            return false;
        }

        try {
            // Check if user is an official
            const isOfficial = await App.contract.methods.officials(App.account).call();
            if (!isOfficial) {
                console.error('Only officials can set up elections');
                Alert.show("error", "shield-x", "Access Denied", "Only officials can set up elections.");
                return false;
            }

            console.log('Setting up election for immediate voting...');
            
            // Set election dates: start now, end in 24 hours
            const now = Math.floor(Date.now() / 1000);
            const tomorrow = now + (24 * 60 * 60);
            
            await App.contract.methods.setElectionDates(now, tomorrow).send({ from: App.account });
            
            console.log('✅ Election dates set successfully');
            Alert.show("success", "calendar-check", "Election Active", "Election has been activated and is now live!");
            
            return true;

        } catch (err) {
            console.error('Error setting up election:', err);
            Alert.show("error", "exclamation-triangle", "Setup Error", `Failed to setup election: ${err.message}`);
            return false;
        }
    },

    // Add test candidates if none exist
    addTestCandidates: async function() {
        if (!App.contract || !App.account) {
            console.error('Contract or account not available');
            return false;
        }

        try {
            // Check if user is an official
            const isOfficial = await App.contract.methods.officials(App.account).call();
            if (!isOfficial) {
                console.error('Only officials can add candidates');
                Alert.show("error", "shield-x", "Access Denied", "Only officials can add candidates.");
                return false;
            }

            // Check if candidates already exist
            const result = await App.contract.methods.getCandidates().call();
            let candidateCount = 0;
            
            if (result.names) {
                candidateCount = result.names.length;
            } else if (result[0]) {
                candidateCount = result[0].length;
            }

            if (candidateCount > 0) {
                console.log(`${candidateCount} candidates already exist`);
                Alert.show("info", "info-circle", "Candidates Exist", `${candidateCount} candidates are already registered.`);
                return true;
            }

            console.log('Adding test candidates...');

            // Add 3 test candidates
            const testCandidates = [
                { name: "Alice Johnson", party: "Democratic Party" },
                { name: "Bob Smith", party: "Republican Party" },
                { name: "Carol Davis", party: "Independent" }
            ];

            for (let candidate of testCandidates) {
                await App.contract.methods.registerCandidate(candidate.name, candidate.party).send({ from: App.account });
                console.log(`✅ Added candidate: ${candidate.name} (${candidate.party})`);
            }

            Alert.show("success", "person-check", "Candidates Added", "Test candidates have been added successfully!");
            return true;

        } catch (err) {
            console.error('Error adding test candidates:', err);
            Alert.show("error", "exclamation-triangle", "Candidate Error", `Failed to add candidates: ${err.message}`);
            return false;
        }
    },

    // Full setup: candidates + election dates
    fullSetup: async function() {
        console.log('Starting full election setup...');
        
        const candidatesAdded = await this.addTestCandidates();
        if (!candidatesAdded) return false;

        // Wait a moment for transaction to settle
        await new Promise(resolve => setTimeout(resolve, 1000));

        const electionSetup = await this.setupElectionNow();
        if (!electionSetup) return false;

        console.log('✅ Full election setup completed!');
        Alert.show("success", "check-circle-fill", "Setup Complete", "Election is fully configured and ready for voting!");

        // Reload the page to show updated data
        setTimeout(() => {
            window.location.reload();
        }, 2000);

        return true;
    },

    // Check current election status
    checkElectionStatus: async function() {
        if (!App.contract) {
            console.error('Contract not available');
            return null;
        }

        try {
            // Get candidates
            const result = await App.contract.methods.getCandidates().call();
            let candidateCount = 0;
            
            if (result.names) {
                candidateCount = result.names.length;
            } else if (result[0]) {
                candidateCount = result[0].length;
            }

            // Get election dates
            const startDate = await App.contract.methods.startDate().call();
            const endDate = await App.contract.methods.endDate().call();
            const currentTime = Math.floor(Date.now() / 1000);

            const status = {
                candidateCount: candidateCount,
                startDate: Number(startDate),
                endDate: Number(endDate),
                currentTime: currentTime,
                datesSet: Number(startDate) > 0 && Number(endDate) > 0,
                electionActive: false,
                canVote: false
            };

            if (status.datesSet) {
                status.electionActive = currentTime >= Number(startDate) && currentTime <= Number(endDate);
            }

            status.canVote = status.candidateCount > 0 && status.electionActive;

            console.log('Election Status:', status);
            return status;

        } catch (err) {
            console.error('Error checking election status:', err);
            return null;
        }
    }
};

// Add a button to officials page for quick setup
if (window.location.href.includes('official.html')) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Add quick setup button to official page
            const dangerSection = document.querySelector('.danger-section');
            if (dangerSection) {
                const quickSetupSection = document.createElement('section');
                quickSetupSection.style.marginBottom = '20px';
                quickSetupSection.innerHTML = `
                    <label>
                        <h3>
                            <i class="bi bi-lightning-charge"></i>
                            Quick Setup (For Testing)
                        </h3>
                    </label>
                    <p style="color: #6c757d; margin-bottom: 15px;">
                        Quickly set up the election with test candidates and activate it for immediate voting.
                    </p>
                    <input id="quickSetupBtn" type="submit" name="submit" value="Setup Election Now" class="btn-primary" style="background: #28a745; border-color: #28a745;">
                `;
                
                dangerSection.parentNode.insertBefore(quickSetupSection, dangerSection);

                // Add event listener
                document.getElementById('quickSetupBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    QuickSetup.fullSetup();
                });
            }
        }, 1000);
    });
}

// Export for global use
window.QuickSetup = QuickSetup;
