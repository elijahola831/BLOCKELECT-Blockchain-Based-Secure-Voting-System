import Web3 from "web3";
import VotingSysJSON from "../../build/contracts/VotingSys.json";

const App = {
  web3: null,
  account: null,
  contract: null,
  selectedCandidate: null,

  init: async function () {
    if (window.ethereum) {
      App.web3 = new Web3(window.ethereum);

      try {
        // Modern way to request accounts
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        if (accounts.length === 0) throw new Error("No accounts found. Please connect MetaMask.");
        App.account = accounts[0];
        document.getElementById("acctAddress").innerText = App.account;

        const networkId = await App.web3.eth.net.getId();
        const chainId = await App.web3.eth.getChainId();
        console.log("NetworkId:", networkId);
        console.log("chainId:", chainId);
        console.log("VotingSysJSON networks:", VotingSysJSON.networks);
        const deployedNetwork = VotingSysJSON.networks[networkId];
        if (chainId !== 1337n) {
          throw new Error(`Wrong network detected. Please switch to Ganache (Chain ID 1337).`);
        }

        if (!deployedNetwork) throw new Error(`Contract not deployed on this network (ID: ${networkId})`);

        App.contract = new App.web3.eth.Contract(VotingSysJSON.abi, deployedNetwork.address);
        console.log("Contract initialized:", App.contract.options.address);
        console.log("Contract methods available:", Object.keys(App.contract.methods));

        Alert.show("success", "check-circle-fill", "Welcome!", "You signed in successfully!");

        // Check role
        await App.checkRole();

        // Load candidates and election dates for voters
        if (!window.location.href.includes("official.html")) {
          console.log("Loading data for voter page...");
          await App.loadCandidates();
          await App.loadElectionDates(); // Added this missing function call

        } else {
          // Setup event listeners for official page
          App.setupOfficialEventListeners();
          
          // Load current election data for officials
          await App.loadOfficialData();
        }
      } catch (err) {
        Alert.show(
          "error",
          "arrows-angle-contract",
          "Smart Contract Error!",
          `Please reload the page and connect to your MetaMask wallet. ${err.message}`
        );
      }

      // Handle network changes
      window.ethereum.on('chainChanged', () => {
        Alert.show(
          "info",
          "wifi",
          "Network Changed!",
          "You switched networks. Reloading page to reconnect BLOCKELECT Voting System contract..."
        );
        setTimeout(() => window.location.reload(), 2000);
      });

      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          Alert.show(
            "warning",
            "box-arrow-right",
            "Citizen Signed Out!",
            "You signed out of BLOCKELECT. Reconnect to MetaMask wallet and reload to sign in again."
          );
        } else {
          Alert.show(
            "info",
            "arrow-repeat",
            "Account Changed!",
            `You're now interacting with the blockchain as: ${accounts[0]}. Reloading to reconnect...`
          );
          setTimeout(() => window.location.reload(), 2000);
        }
      });

    } else {
      Alert.show(
        "error",
        "wallet-filled",
        "Wallet Required!",
        "Please install MetaMask wallet and reload this page to verify you're a citizen."
      );
    }
  },

  // Load data for official dashboard
  loadOfficialData: async function () {
    if (!App.contract) return;

    try {
      // Load current candidates for display
      const result = await App.contract.methods.getCandidates().call();
      let names, parties, votes;
      
      if (result.names && result.parties && result.votes) {
        names = result.names;
        parties = result.parties;
        votes = result.votes;
      } else if (result[0] && result[1] && result[2]) {
        names = result[0];
        parties = result[1];
        votes = result[2];
      } else {
        names = [];
        parties = [];
        votes = [];
      }

      // Display current election statistics
      const statsContainer = document.getElementById("electionStats");
      if (statsContainer) {
        const totalVotes = votes.reduce((sum, vote) => sum + Number(vote), 0);
        statsContainer.innerHTML = `<p class="info"><b>Election Status |</b> ${names.length} candidates declared, ${totalVotes} votes casted</p>`;
      }

      // Display current candidates
      const candidatesContainer = document.getElementById("currentCandidates");
      if (candidatesContainer) {
        if (names.length === 0) {
          candidatesContainer.innerHTML = "<p>No candidates registered</p>";
        } else {
          let candidatesHTML = "<ul style='margin-bottom: 56px'>";
          for (let i = 0; i < names.length; i++) {
            candidatesHTML += `
              <li>
                <span>${names[i]}</span> (${parties[i]}) - ${votes[i]} votes
                <button class="btn btn-danger btn-sm" onclick="App.removeCandidate(${i})">Remove</button>
              </li>
            `;
          }
          candidatesHTML += "</ul>";
          candidatesContainer.innerHTML = candidatesHTML;
        }
      }

    } catch (err) {
      console.error("Error loading official data:", err);
    }
  },

  // Setup event listeners for official page
  setupOfficialEventListeners: function () {
    // Candidate registration
    const addCandidateBtn = document.getElementById("addCandidate");
    if (addCandidateBtn) {
      addCandidateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const party = document.getElementById("party").value.trim();
        
        if (!name || !party) {
          Alert.show("warning", "question-circle-fill", "Missing Information", "Please enter both candidate name and party.");
          return;
        }
        
        await App.registerCandidate(name, party);
        
        // Clear form and reload official data
        document.getElementById("name").value = "";
        document.getElementById("party").value = "";
        await App.loadOfficialData();
      });
    }

    // Election date setting
    const addDateBtn = document.getElementById("addDate");
    if (addDateBtn) {
      addDateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        
        if (!startDate || !endDate) {
          Alert.show("warning", "calendar-minus-fill", "Missing Dates!", "Please select both start and end dates.");
          return;
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
          Alert.show("warning", "slash-circle-fill", "Invalid Dates!", "Start date must be before end date.");
          return;
        }
        
        // Allow today's date - only reject dates that are clearly in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for comparison
        
        if (start < today) {
          Alert.show("warning", "hourglass-bottom", "Past Date!", "Start date cannot be in the past. You can select today's date or future dates.");
          return;
        }
        
        await App.setElectionDates(startDate, endDate);
        
        // Clear form after successful setting
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
      });
    }

    // Reset Election button - now calls resetElection directly
    const resetElectionBtn = document.getElementById("resetElection");
    if (resetElectionBtn) {
      resetElectionBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await App.resetElection();
      });
    }
  },

  // Check if connected wallet is official or voter
  checkRole: async function () {
    if (!App.contract || !App.account) return;

    try {
      const isOfficial = await App.contract.methods.officials(App.account).call();

      if (isOfficial) {
        document.getElementById("acctType").innerText = 'Official';
        if (!window.location.href.includes("official.html")) {
          document.getElementById("page").style.display = 'none';
          document.getElementById("accessDenied").style.display = 'block';
          setTimeout(() => {
            window.location.href = "/official.html";
          }, 5000);
        }
      } else {
        document.getElementById("acctType").innerText = 'Voter';
        // If they're on the official page but not an official, redirect to voting page
        if (window.location.href.includes("official.html")) {
          document.getElementById("page").style.display = 'none';
          document.getElementById("accessDenied").style.display = 'block';
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        }
      }
    } catch (err) {
      Alert.show("error", "exclamation-triangle-fill", "Role Check Error!", err.message);
    }
  },

  // NEW FUNCTION: Load election dates for display
  loadElectionDates: async function () {
    console.log("Loading election dates...");
    
    if (!App.contract) {
      console.error("Contract not initialized for loading dates");
      return;
    }

    try {
      console.log("Calling startDate and endDate from contract...");
      const startDate = await App.contract.methods.startDate().call();
      const endDate = await App.contract.methods.endDate().call();
      
      console.log("Raw dates from contract:", { startDate, endDate });
      
      const datesElement = document.getElementById("dates");
      if (!datesElement) {
        console.log("Dates element not found, probably not on voting page");
        return; // If we're not on the voting page
      }
      
      // Check if dates are set (not 0)
      if (startDate && endDate && startDate != '0' && endDate != '0') {
        const startDateObj = new Date(parseInt(startDate) * 1000);
        const endDateObj = new Date(parseInt(endDate) * 1000);
        
        console.log("Parsed dates:", { startDateObj, endDateObj });
        
        const formatDate = (date) => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        
        const formattedDates = `${formatDate(startDateObj)} - ${formatDate(endDateObj)}`;
        datesElement.textContent = formattedDates;
        console.log("Election dates set to:", formattedDates);
      } else {
        datesElement.textContent = "Not set yet!";
        console.log("Not set yet!");
      }
    } catch (err) {
      console.error("Error loading election dates:", err);
      const datesElement = document.getElementById("dates");
      if (datesElement) {
        datesElement.textContent = "Unable to load election dates";
      }
    }
  },

  // Load candidates for voters
  loadCandidates: async function () {
    console.log("Loading candidates...");
    
    if (!App.contract) {
      console.error("Contract not initialized");
      return;
    }

    const box = document.getElementById("boxCandidate");
    if (!box) {
      console.log("Not on voting page, skipping candidate load");
      return; // If we're not on the voting page
    }

    try {
      console.log("Calling getCandidates() from contract...");
      const result = await App.contract.methods.getCandidates().call();
      console.log("Contract call result:", result);
      
      // Handle the result properly - it might be an object with named properties
      let names, parties, votes;
      
      if (result.names && result.parties && result.votes) {
        // If result has named properties
        names = result.names;
        parties = result.parties;
        votes = result.votes;
      } else if (Array.isArray(result) && result.length >= 3) {
        // If result is an array
        [names, parties, votes] = result;
      } else if (result[0] && result[1] && result[2]) {
        // If result is object with numeric indices
        names = result[0];
        parties = result[1];
        votes = result[2];
      } else {
        throw new Error("Unexpected result format from getCandidates()");
      }
      
      console.log("Parsed candidates:", { names, parties, votes });
      
      box.innerHTML = "";

      if (!names || names.length === 0) {
        console.log("No candidates found");
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="3" style="text-align: center;">No candidates registered yet</td>`;
        box.appendChild(row);
        
        // Hide vote section if no candidates
        const voteSection = document.getElementById("vote");
        const cantVoteSection = document.getElementById("cantVote");
        const voteButton = document.getElementById("voteButton");
        
        if (voteSection) voteSection.style.display = "none";
        if (cantVoteSection) cantVoteSection.style.display = "block";
        if (voteButton) voteButton.disabled = true;
        return;
      }

      console.log(`Found ${names.length} candidates`);
      
      // Show vote section if candidates exist
      const cantVoteSection = document.getElementById("cantVote");
      if (cantVoteSection) cantVoteSection.style.display = "none";
      
      for (let i = 0; i < names.length; i++) {
        console.log(`Adding candidate ${i}: ${names[i]} (${parties[i]}) - ${votes[i]} votes`);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${names[i]}</td>
          <td>${parties[i]}</td>
          <td>${votes[i]}</td>
        `;
        row.onclick = () => {
          App.selectCandidate(i, names[i], parties[i]);
        };
        row.style.cursor = "pointer";
        row.classList.add("candidate-row");
        box.appendChild(row);
      }
      
      console.log("Candidates loaded successfully");
      
    } catch (err) {
      console.error("Error loading candidates:", err);
      console.error("Error details:", err.message);
      console.error("Error stack:", err.stack);
      
      // Show error message to user
      const box = document.getElementById("boxCandidate");
      if (box) {
        box.innerHTML = `<tr><td colspan="3" style="text-align: center; color: red;">Error loading candidates: ${err.message}</td></tr>`;
      }
      
      const voteSection = document.getElementById("vote");
      const cantVoteSection = document.getElementById("cantVote");
      const voteButton = document.getElementById("voteButton");
      
      if (voteSection) voteSection.style.display = "none";
      if (cantVoteSection) cantVoteSection.style.display = "block";
      if (voteButton) voteButton.disabled = true;
      
      // Also show an alert to the user
      Alert.show("error", "exclamation-triangle-fill", "Error Loading Candidates", `Failed to load candidates: ${err.message}`);
    }
  },

  selectCandidate: function (index, name, party) {
    App.selectedCandidate = index;
    
    // Remove previous selections
    const rows = document.querySelectorAll("#boxCandidate tr");
    rows.forEach(row => row.classList.remove("selected"));
    
    // Highlight selected row
    rows[index].classList.add("selected");
    
    // Show vote section and enable button
    document.getElementById("vote").style.display = "block";
    document.getElementById("cantVote").style.display = "none";
    document.getElementById("voteButton").disabled = false;

    Alert.show(
      "info",
      "hand-index-fill",
      "Candidate Selected!",
      `You selected ${name} of the ${party} political party.`
    );
  },

  vote: async function () {
    if (!App.contract || !App.account) {
      Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
      return;
    }
    if (App.selectedCandidate === null) {
      Alert.show("warning", "person-fill-x", "No Candidate Selected!", "Please select a candidate before voting.");
      return;
    }

    // Pre-flight checks before voting
    try {
      console.log("Performing pre-flight checks...");
      
      // Check if already voted
      const hasVoted = await App.contract.methods.hasVoted(App.account).call();
      console.log("Has already voted:", hasVoted);
      
      if (hasVoted) {
        Alert.show("warning", "check-circle-fill", "Already Voted!", "You have already cast your vote in this election.");
        return;
      }
      
      // Check election dates
      const startDate = await App.contract.methods.startDate().call();
      const endDate = await App.contract.methods.endDate().call();
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log("Election timing:", {
        startDate: Number(startDate),
        endDate: Number(endDate),
        currentTime: currentTime,
        electionStarted: currentTime >= Number(startDate),
        electionEnded: currentTime > Number(endDate)
      });
      
      if (currentTime < Number(startDate)) {
        const startDateObj = new Date(Number(startDate) * 1000);
        Alert.show("warning", "calendar-x", "Election Not Started!", `The election has not started yet. It begins on ${startDateObj.toLocaleDateString()}.`);
        return;
      }
      
      if (currentTime > Number(endDate)) {
        const endDateObj = new Date(Number(endDate) * 1000);
        Alert.show("warning", "calendar-x-fill", "Election Ended!", `The election has ended. It ended on ${endDateObj.toLocaleDateString()}.`);
        return;
      }
      
      // Check candidate index validity
      const result = await App.contract.methods.getCandidates().call();
      let names;
      
      if (result.names) {
        names = result.names;
      } else if (result[0]) {
        names = result[0];
      } else {
        throw new Error("Unable to get candidates list");
      }
      
      if (App.selectedCandidate >= names.length) {
        Alert.show("warning", "person-fill-x", "Invalid Candidate!", "Selected candidate is invalid. Please refresh and try again.");
        return;
      }
      
      console.log("All pre-flight checks passed. Proceeding with vote...");
      
    } catch (err) {
      console.error("Pre-flight check error:", err);
      Alert.show("error", "exclamation-triangle-fill", "Pre-flight Check Failed!", `Error checking voting eligibility: ${err.message}`);
      return;
    }

    Alert.show("info", "clock-history", "Voting...", "Submitting your vote to the blockchain.");
    try {
      console.log(`Voting for candidate index: ${App.selectedCandidate}`);
      
      // Send the transaction without gas estimation to avoid BigInt issues
      const receipt = await App.contract.methods.vote(App.selectedCandidate).send({ 
        from: App.account
        // Let MetaMask/Web3 handle gas estimation automatically
      });
      
      console.log("Vote transaction receipt:", receipt);
      
      Alert.show("success", "check-circle-fill", "Voted!", "Your vote has been cast successfully!");
      await App.loadCandidates();
      
      // Reset selection after voting
      App.selectedCandidate = null;
      document.getElementById("vote").style.display = "none";
      document.getElementById("voteButton").disabled = true;
      
    } catch (err) {
      console.error("Voting error:", err);
      console.error("Error details:", err.message);
      console.error("Error data:", err.data);
      
      let errorMessage = err.message;
      
      // Try to decode common error reasons
      if (err.message.includes("revert")) {
        if (err.message.includes("Already voted")) {
          errorMessage = "You have already voted in this election.";
        } else if (err.message.includes("Election not active")) {
          errorMessage = "The election is not currently active.";
        } else if (err.message.includes("Invalid candidate")) {
          errorMessage = "The selected candidate is invalid.";
        } else {
          errorMessage = "Transaction was reverted by the smart contract.";
        }
      } else if (err.message.includes("User denied")) {
        errorMessage = "You rejected the transaction in MetaMask.";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient funds to pay for gas fees.";
      }
      
      Alert.show("error", "exclamation-triangle-fill", "Voting Error!", errorMessage);
    }
  },

  registerCandidate: async function (name, party) {
    if (!App.contract || !App.account) {
      Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
      return;
    }

    Alert.show("info", "clock-history", "Registering Candidate", `${name} (${party}) is being registered...`);
    try {
      await App.contract.methods.registerCandidate(name, party).send({ from: App.account });
      Alert.show("success", "check-circle-fill", "Candidate Registered!", `${name} (${party}) successfully registered.`);
    } catch (err) {
      Alert.show("error", "exclamation-triangle-fill", "Registration Error!", err.message);
    }
  },

  setElectionDates: async function (start, end) {
    if (!App.contract || !App.account) {
      Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "You signed out of BLOCKELECT. Reconnect to MetaMask wallet to sign in again.");
      return;
    }

    const startTS = Math.floor(new Date(start).getTime() / 1000);
    const endTS = Math.floor(new Date(end).getTime() / 1000);

    Alert.show("info", "clock-history", "Setting Dates", `Election starts ${start} and ends ${end}...`);
    try {
      await App.contract.methods.setElectionDates(startTS, endTS).send({ from: App.account });
      Alert.show("success", "calendar-check-fill", "Dates Set!", `Election dates set successfully.`);
    } catch (err) {
      Alert.show("error", "calendar-x-fill", "Date Error!", err.message);
    }
  },

  resetElection: async function () {
    if (!App.contract || !App.account) {
      Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "Please reconnect your MetaMask wallet.");
      return;
    }

    if (!confirm("Are you sure you want to cancel the entire election? This will clear all candidates, votes, and voting records.")) {
      return;
    }

    Alert.show("info", "clock-history", "Resetting Election", "Resetting election... Please wait.");
    try {
      await App.contract.methods.resetElection().send({ from: App.account });
      Alert.show("success", "check-circle-fill", "Election Cancelled!", "The election has been cancelled successfully.");
      await App.loadOfficialData();
    } catch (err) {
      Alert.show("error", "exclamation-triangle-fill", "Error Resetting Election", err.message);
    }
  },

  removeCandidate: async function (candidateIndex) {
    if (!App.contract || !App.account) {
      Alert.show("warning", "box-arrow-right", "Citizen Signed Out!", "Please reconnect your MetaMask wallet.");
      return;
    }

    if (!confirm("Are you sure you want to remove this candidate? This action cannot be undone.")) {
      return;
    }

    Alert.show("info", "clock-history", "Removing Candidate", "Removing candidate... Please wait.");
    try {
      await App.contract.methods.removeCandidate(candidateIndex).send({ from: App.account });
      Alert.show("success", "check-circle-fill", "Candidate Removed!", "Candidate removed successfully.");
      await App.loadOfficialData();
    } catch (err) {
      Alert.show("error", "exclamation-triangle-fill", "Error Removing Candidate", err.message);
    }
  }
};

window.App = App;
App.init();