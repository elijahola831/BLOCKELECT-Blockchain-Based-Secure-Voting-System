const VotingSys = artifacts.require("VotingSys");

contract("VotingSys", accounts => {
    let votingSys;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    beforeEach(async () => {
        votingSys = await VotingSys.new({ from: owner });
    });

    it("should set the deployer as owner and official", async () => {
        const contractOwner = await votingSys.owner();
        const isOfficial = await votingSys.officials(owner);
        
        assert.equal(contractOwner, owner, "Owner should be the deployer");
        assert.equal(isOfficial, true, "Deployer should be an official");
    });

    it("should allow officials to register candidates", async () => {
        await votingSys.registerCandidate("John Doe", "Party A", { from: owner });
        
        const result = await votingSys.getCandidates();
        const names = result[0];
        const parties = result[1];
        const votes = result[2];
        
        assert.equal(names.length, 1, "Should have one candidate");
        assert.equal(names[0], "John Doe", "Candidate name should match");
        assert.equal(parties[0], "Party A", "Party should match");
        assert.equal(votes[0].toNumber(), 0, "Initial votes should be 0");
    });

    it("should allow officials to set election dates", async () => {
        const startDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const endDate = startDate + 86400; // 24 hours later

        await votingSys.setElectionDates(startDate, endDate, { from: owner });
        
        const contractStartDate = await votingSys.startDate();
        const contractEndDate = await votingSys.endDate();
        
        assert.equal(contractStartDate.toNumber(), startDate, "Start date should match");
        assert.equal(contractEndDate.toNumber(), endDate, "End date should match");
    });

    it("should prevent non-officials from registering candidates", async () => {
        try {
            await votingSys.registerCandidate("Jane Doe", "Party B", { from: voter1 });
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert(error.message.includes("Not an official"), "Should reject non-officials");
        }
    });

    it("should allow voters to vote during active election", async () => {
        // Register a candidate
        await votingSys.registerCandidate("John Doe", "Party A", { from: owner });
        
        // Set election dates (current time to make it active)
        const startDate = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
        const endDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        
        await votingSys.setElectionDates(startDate, endDate, { from: owner });
        
        // Vote
        await votingSys.vote(0, { from: voter1 });
        
        // Check results
        const result = await votingSys.getCandidates();
        const votes = result[2];
        const hasVoted = await votingSys.hasVoted(voter1);
        
        assert.equal(votes[0].toNumber(), 1, "Candidate should have 1 vote");
        assert.equal(hasVoted, true, "Voter should be marked as having voted");
    });

    it("should prevent double voting", async () => {
        // Setup
        await votingSys.registerCandidate("John Doe", "Party A", { from: owner });
        
        const startDate = Math.floor(Date.now() / 1000) - 60;
        const endDate = Math.floor(Date.now() / 1000) + 3600;
        await votingSys.setElectionDates(startDate, endDate, { from: owner });
        
        // First vote
        await votingSys.vote(0, { from: voter1 });
        
        // Try to vote again
        try {
            await votingSys.vote(0, { from: voter1 });
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert(error.message.includes("Already voted"), "Should prevent double voting");
        }
    });

    it("should allow officials to reset election", async () => {
        // Setup
        await votingSys.registerCandidate("John Doe", "Party A", { from: owner });
        const startDate = Math.floor(Date.now() / 1000) - 60;
        const endDate = Math.floor(Date.now() / 1000) + 3600;
        await votingSys.setElectionDates(startDate, endDate, { from: owner });
        
        // Vote
        await votingSys.vote(0, { from: voter1 });
        
        // Reset
        await votingSys.resetElection({ from: owner });
        
        // Check reset state
        const result = await votingSys.getCandidates();
        const names = result[0];
        const hasVoted = await votingSys.hasVoted(voter1);
        const contractStartDate = await votingSys.startDate();
        const contractEndDate = await votingSys.endDate();
        
        assert.equal(names.length, 0, "Should have no candidates after reset");
        assert.equal(hasVoted, false, "Voter should not be marked as having voted");
        assert.equal(contractStartDate.toNumber(), 0, "Start date should be reset");
        assert.equal(contractEndDate.toNumber(), 0, "End date should be reset");
    });
});
