// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSys {
    struct Candidate {
        string name;
        string party;
        uint votes;
    }
    
    struct Proposal {
        uint id;
        ProposalType proposalType;
        bytes data;
        address proposer;
        uint confirmations;
        bool executed;
        mapping(address => bool) confirmed;
        uint timestamp;
    }
    
    enum ProposalType {
        ADD_CANDIDATE,
        SET_ELECTION_DATES,
        RESET_ELECTION,
        ADD_OFFICIAL,
        REMOVE_OFFICIAL
    }

    address public owner;
    mapping(address => bool) public officials;
    address[] public officialsList;
    Candidate[] public candidates;
    
    // Multi-signature functionality
    uint public requiredConfirmations;
    uint public proposalCount;
    mapping(uint => Proposal) public proposals;
    uint[] public pendingProposals;

    uint public startDate;
    uint public endDate;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public ninVerified; // Track NIN-verified accounts
    mapping(address => string) public voterNIN; // Store verified NIN for each voter
    address[] public votersList; // Track all voters for reset functionality

    constructor() {
        owner = msg.sender;
        officials[msg.sender] = true;
        officialsList.push(msg.sender);
        requiredConfirmations = 1; // Start with 1, can be updated
    }
    
    // Events for multi-signature operations
    event ProposalCreated(uint indexed proposalId, ProposalType proposalType, address indexed proposer);
    event ProposalConfirmed(uint indexed proposalId, address indexed official);
    event ProposalExecuted(uint indexed proposalId);
    event OfficialAdded(address indexed official);
    event OfficialRemoved(address indexed official);
    event RequiredConfirmationsChanged(uint newRequiredConfirmations);
    event VoterNINVerified(address indexed voter, string ninHash);

    modifier onlyOfficial() {
        require(officials[msg.sender], "Not an official");
        _;
    }

    modifier electionActive() {
        require(
            block.timestamp >= startDate && block.timestamp <= endDate,
            "Election not active"
        );
        _;
    }

    modifier onlyNINVerified() {
        require(ninVerified[msg.sender], "NIN verification required");
        _;
    }

    function registerCandidate(
        string memory _name,
        string memory _party
    ) external onlyOfficial {
        candidates.push(Candidate(_name, _party, 0));
    }

    function setElectionDates(uint _start, uint _end) external onlyOfficial {
        require(_start < _end, "Invalid dates");
        startDate = _start;
        endDate = _end;
    }

    // Function for officials to verify voter NIN
    function verifyVoterNIN(address _voter, string memory _ninHash) external onlyOfficial {
        require(_voter != address(0), "Invalid voter address");
        require(bytes(_ninHash).length > 0, "NIN hash cannot be empty");
        
        ninVerified[_voter] = true;
        voterNIN[_voter] = _ninHash;
        
        emit VoterNINVerified(_voter, _ninHash);
    }

    function vote(uint _candidateIndex) external electionActive onlyNINVerified {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");

        candidates[_candidateIndex].votes += 1;
        hasVoted[msg.sender] = true;

        // Track voter for reset functionality
        votersList.push(msg.sender);
    }

    // New function: Reset election - clears all candidates, votes, and voting records
    function resetElection() external onlyOfficial {
        // Clear all candidates
        delete candidates;

        // Reset all voters' voting status and NIN verifications
        for (uint i = 0; i < votersList.length; i++) {
            hasVoted[votersList[i]] = false;
            ninVerified[votersList[i]] = false;
            voterNIN[votersList[i]] = "";
        }

        // Clear voters list
        delete votersList;

        // Reset election dates
        startDate = 0;
        endDate = 0;
    }

    // New function: Remove specific candidate (alternative to full reset)
    function removeCandidate(uint _candidateIndex) external onlyOfficial {
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        // Move the last candidate to the deleted position
        candidates[_candidateIndex] = candidates[candidates.length - 1];

        // Remove the last candidate
        candidates.pop();
    }

    // Return separate arrays to avoid Web3 decoding errors
    function getCandidates()
        external
        view
        returns (
            string[] memory names,
            string[] memory parties,
            uint[] memory votes
        )
    {
        names = new string[](candidates.length);
        parties = new string[](candidates.length);
        votes = new uint[](candidates.length);

        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            votes[i] = candidates[i].votes;
        }
    }

    // Get total number of candidates
    function getCandidateCount() external view returns (uint) {
        return candidates.length;
    }

    // Get total number of votes cast
    function getTotalVotes() external view returns (uint) {
        return votersList.length;
    }

    // Check if voter is NIN verified
    function isNINVerified(address _voter) external view returns (bool) {
        return ninVerified[_voter];
    }

    // Get voter's NIN hash (only returns if verified)
    function getVoterNINHash(address _voter) external view returns (string memory) {
        require(ninVerified[_voter], "Voter not NIN verified");
        return voterNIN[_voter];
    }
    
    // ============ MULTI-SIGNATURE FUNCTIONS ============
    
    // Update required confirmations (only by owner)
    function updateRequiredConfirmations(uint _required) external {
        require(msg.sender == owner, "Only owner can update");
        require(_required > 0 && _required <= officialsList.length, "Invalid confirmation count");
        requiredConfirmations = _required;
        emit RequiredConfirmationsChanged(_required);
    }
    
    // Add new official
    function addOfficial(address _official) external {
        require(msg.sender == owner, "Only owner can add officials");
        require(!officials[_official], "Already an official");
        require(_official != address(0), "Invalid address");
        
        officials[_official] = true;
        officialsList.push(_official);
        emit OfficialAdded(_official);
    }
    
    // Propose to add candidate (multi-sig version)
    function proposeAddCandidate(string memory _name, string memory _party) external onlyOfficial {
        bytes memory data = abi.encode(_name, _party);
        uint proposalId = _createProposal(ProposalType.ADD_CANDIDATE, data);
        
        // Auto-confirm own proposal
        _confirmProposal(proposalId);
    }
    
    // Propose to set election dates (multi-sig version)
    function proposeSetElectionDates(uint _start, uint _end) external onlyOfficial {
        require(_start < _end, "Invalid dates");
        bytes memory data = abi.encode(_start, _end);
        uint proposalId = _createProposal(ProposalType.SET_ELECTION_DATES, data);
        
        // Auto-confirm own proposal
        _confirmProposal(proposalId);
    }
    
    // Propose to reset election (multi-sig version)
    function proposeResetElection() external onlyOfficial {
        bytes memory data = abi.encode("reset");
        uint proposalId = _createProposal(ProposalType.RESET_ELECTION, data);
        
        // Auto-confirm own proposal
        _confirmProposal(proposalId);
    }
    
    // Confirm a proposal
    function confirmProposal(uint _proposalId) external onlyOfficial {
        _confirmProposal(_proposalId);
    }
    
    // Internal function to create proposal
    function _createProposal(ProposalType _type, bytes memory _data) internal returns (uint) {
        uint proposalId = proposalCount++;
        
        proposals[proposalId].id = proposalId;
        proposals[proposalId].proposalType = _type;
        proposals[proposalId].data = _data;
        proposals[proposalId].proposer = msg.sender;
        proposals[proposalId].confirmations = 0;
        proposals[proposalId].executed = false;
        proposals[proposalId].timestamp = block.timestamp;
        
        pendingProposals.push(proposalId);
        
        emit ProposalCreated(proposalId, _type, msg.sender);
        return proposalId;
    }
    
    // Internal function to confirm proposal
    function _confirmProposal(uint _proposalId) internal {
        require(_proposalId < proposalCount, "Proposal does not exist");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(!proposals[_proposalId].confirmed[msg.sender], "Already confirmed");
        
        proposals[_proposalId].confirmed[msg.sender] = true;
        proposals[_proposalId].confirmations += 1;
        
        emit ProposalConfirmed(_proposalId, msg.sender);
        
        // Execute if enough confirmations
        if (proposals[_proposalId].confirmations >= requiredConfirmations) {
            _executeProposal(_proposalId);
        }
    }
    
    // Execute proposal
    function _executeProposal(uint _proposalId) internal {
        require(!proposals[_proposalId].executed, "Already executed");
        
        proposals[_proposalId].executed = true;
        
        if (proposals[_proposalId].proposalType == ProposalType.ADD_CANDIDATE) {
            (string memory name, string memory party) = abi.decode(proposals[_proposalId].data, (string, string));
            candidates.push(Candidate(name, party, 0));
            
        } else if (proposals[_proposalId].proposalType == ProposalType.SET_ELECTION_DATES) {
            (uint start, uint end) = abi.decode(proposals[_proposalId].data, (uint, uint));
            startDate = start;
            endDate = end;
            
        } else if (proposals[_proposalId].proposalType == ProposalType.RESET_ELECTION) {
            // Clear all candidates
            delete candidates;
            
            // Reset all voters' voting status and NIN verifications
            for (uint i = 0; i < votersList.length; i++) {
                hasVoted[votersList[i]] = false;
                ninVerified[votersList[i]] = false;
                voterNIN[votersList[i]] = "";
            }
            
            // Clear voters list
            delete votersList;
            
            // Reset election dates
            startDate = 0;
            endDate = 0;
        }
        
        // Remove from pending proposals
        for (uint i = 0; i < pendingProposals.length; i++) {
            if (pendingProposals[i] == _proposalId) {
                pendingProposals[i] = pendingProposals[pendingProposals.length - 1];
                pendingProposals.pop();
                break;
            }
        }
        
        emit ProposalExecuted(_proposalId);
    }
    
    // Get proposal details
    function getProposal(uint _proposalId) external view returns (
        uint id,
        ProposalType proposalType,
        address proposer,
        uint confirmations,
        bool executed,
        uint timestamp
    ) {
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposalType,
            proposal.proposer,
            proposal.confirmations,
            proposal.executed,
            proposal.timestamp
        );
    }
    
    // Get pending proposals
    function getPendingProposals() external view returns (uint[] memory) {
        return pendingProposals;
    }
    
    // Get officials list
    function getOfficials() external view returns (address[] memory) {
        return officialsList;
    }
    
    // Check if address has confirmed a proposal
    function hasConfirmed(uint _proposalId, address _official) external view returns (bool) {
        return proposals[_proposalId].confirmed[_official];
    }
}