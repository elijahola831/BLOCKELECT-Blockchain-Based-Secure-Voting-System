// Analytics Dashboard JavaScript
class AnalyticsDashboard {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.updateInterval = null;
        this.charts = {};
        this.previousVoteCount = 0;
        this.activityHistory = [];
        this.socket = null;
        this.isRealTimeEnabled = false;
        
        this.init();
    }

    async init() {
        try {
            await this.initWeb3();
            await this.initContract();
            await this.initCharts();
            await this.initWebSocket();
            await this.loadInitialData();
            this.startRealTimeUpdates();
            
            this.updateConnectionStatus('connected');
            this.addActivityItem('System connected to blockchain network', 'success');
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.updateConnectionStatus('disconnected');
            this.addActivityItem('Failed to connect to blockchain network', 'error');
        }
    }

    async initWeb3() {
        if (typeof window.ethereum !== 'undefined') {
            this.web3 = new Web3(window.ethereum);
        } else if (typeof window.web3 !== 'undefined') {
            this.web3 = new Web3(window.web3.currentProvider);
        } else {
            this.web3 = new Web3('http://127.0.0.1:7545');
        }
    }

    async initContract() {
        try {
            const response = await fetch('/api/contract-data');
            if (!response.ok) {
                throw new Error('Failed to fetch contract data');
            }
            
            const contractData = await response.json();
            this.contract = new this.web3.eth.Contract(
                contractData.abi,
                contractData.address
            );
            console.log('📜 Smart contract initialized successfully');
        } catch (error) {
            console.error('Contract initialization failed:', error);
            throw error;
        }
    }

    async initWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.host;
            
            this.socket = io(`${window.location.protocol}//${host}`, {
                transports: ['websocket', 'polling']
            });
            
            this.socket.on('connect', () => {
                console.log('📡 WebSocket connected for real-time updates');
                this.socket.emit('join-analytics');
                this.isRealTimeEnabled = true;
                this.addActivityItem('Real-time updates enabled', 'success');
            });
            
            this.socket.on('disconnect', () => {
                console.log('📡 WebSocket disconnected');
                this.isRealTimeEnabled = false;
                this.addActivityItem('Real-time updates disabled', 'warning');
            });
            
            // Listen for vote updates
            this.socket.on('voteUpdate', (data) => {
                console.log('🗳️ Real-time vote update received:', data);
                this.handleRealTimeVoteUpdate(data);
            });
            
            // Listen for election events
            this.socket.on('electionStarted', (data) => {
                console.log('🚀 Election started event:', data);
                this.addActivityItem('Election has started!', 'success');
                // Refresh data to get updated election dates
                setTimeout(() => this.loadInitialData(), 1000);
            });
            
            // Listen for candidate updates
            this.socket.on('candidateAdded', (data) => {
                console.log('👤 Candidate added event:', data);
                this.addActivityItem(`New candidate added: ${data.candidateName} (${data.party})`, 'info');
                this.updateCandidateData(data.candidates);
            });
            
            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                this.addActivityItem('Failed to establish real-time connection', 'error');
            });
            
        } catch (error) {
            console.error('WebSocket initialization failed:', error);
            this.addActivityItem('Real-time updates unavailable', 'warning');
        }
    }

    initCharts() {
        // Vote Distribution Chart
        const ctx1 = document.getElementById('voteDistributionChart').getContext('2d');
        this.charts.voteDistribution = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} votes (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '65%',
                animation: {
                    animateScale: true,
                    duration: 1000
                }
            }
        });

        // Voting Activity Chart (Line chart showing vote trends)
        const ctx2 = document.getElementById('votingActivityChart').getContext('2d');
        this.charts.votingActivity = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Votes Cast',
                    data: [],
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: { size: 10 }
                        }
                    }
                },
                animation: { duration: 300 }
            }
        });
    }

    async loadInitialData() {
        try {
            const [candidates, totalVotes, electionDates] = await Promise.all([
                this.contract.methods.getCandidates().call(),
                this.contract.methods.getTotalVotes().call(),
                this.getElectionDates()
            ]);

            this.updateMetrics({
                totalVotes: totalVotes,
                candidateCount: candidates.names.length,
                startDate: electionDates.startDate,
                endDate: electionDates.endDate
            });

            this.updateVoteDistributionChart(candidates);
            this.updateResultsTable(candidates);
            
            // Initialize activity chart with current data
            this.initActivityChart(totalVotes);

        } catch (error) {
            console.error('Error loading initial data:', error);
            this.addActivityItem('Error loading election data', 'error');
        }
    }

    async getElectionDates() {
        try {
            const [startDate, endDate] = await Promise.all([
                this.contract.methods.startDate().call(),
                this.contract.methods.endDate().call()
            ]);
            return { 
                startDate: parseInt(startDate), 
                endDate: parseInt(endDate) 
            };
        } catch (error) {
            console.error('Error getting election dates:', error);
            return { startDate: 0, endDate: 0 };
        }
    }

    updateMetrics(data) {
        // Total Votes
        document.getElementById('total-votes').textContent = data.totalVotes || '0';
        
        // Vote change indicator
        const voteChange = data.totalVotes - this.previousVoteCount;
        if (voteChange > 0) {
            document.getElementById('votes-change').innerHTML = 
                `<i class="bi bi-arrow-up"></i> +${voteChange} since last update`;
            document.getElementById('votes-change').className = 'metric-change positive';
        }

        // Turnout Rate (assuming 1000 registered voters for demo)
        const registeredVoters = 1000;
        const turnoutRate = ((data.totalVotes / registeredVoters) * 100).toFixed(1);
        document.getElementById('turnout-rate').textContent = `${turnoutRate}%`;

        // Candidate Count
        document.getElementById('total-candidates').textContent = data.candidateCount || '0';

        // Time Remaining
        this.updateTimeRemaining(data.startDate, data.endDate);

        // Update last updated time
        document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
    }

    updateTimeRemaining(startDate, endDate) {
        const now = Math.floor(Date.now() / 1000);
        const timeRemainingEl = document.getElementById('time-remaining');
        const statusEl = document.getElementById('election-status');

        if (startDate === 0 && endDate === 0) {
            timeRemainingEl.textContent = '--';
            statusEl.textContent = 'Election not scheduled';
            return;
        }

        if (now < startDate) {
            const timeToStart = startDate - now;
            timeRemainingEl.textContent = this.formatTimeRemaining(timeToStart);
            statusEl.textContent = 'Election not started';
        } else if (now >= startDate && now <= endDate) {
            const timeToEnd = endDate - now;
            timeRemainingEl.textContent = this.formatTimeRemaining(timeToEnd);
            statusEl.textContent = 'Election active';
            statusEl.className = 'metric-change positive';
        } else {
            timeRemainingEl.textContent = 'Ended';
            statusEl.textContent = 'Election completed';
            statusEl.className = 'metric-change';
        }
    }

    formatTimeRemaining(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    updateVoteDistributionChart(candidates) {
        if (!candidates || !candidates.names.length) {
            this.charts.voteDistribution.data.labels = ['No candidates'];
            this.charts.voteDistribution.data.datasets[0].data = [1];
            this.charts.voteDistribution.update();
            return;
        }

        this.charts.voteDistribution.data.labels = candidates.names.map((name, index) => 
            `${name} (${candidates.parties[index]})`
        );
        this.charts.voteDistribution.data.datasets[0].data = candidates.votes.map(vote => parseInt(vote));
        this.charts.voteDistribution.update('active');
    }

    initActivityChart(currentVotes) {
        const now = new Date();
        const labels = [];
        const data = [];

        // Generate last 12 time points (every 5 minutes)
        for (let i = 11; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 5 * 60 * 1000));
            labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            // Simulate activity leading up to current total
            data.push(Math.max(0, currentVotes - Math.floor(Math.random() * (i + 1))));
        }

        this.charts.votingActivity.data.labels = labels;
        this.charts.votingActivity.data.datasets[0].data = data;
        this.charts.votingActivity.update();
    }

    updateActivityChart(newVoteCount) {
        const chart = this.charts.votingActivity;
        const now = new Date();
        
        // Add new data point
        chart.data.labels.push(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        chart.data.datasets[0].data.push(newVoteCount);
        
        // Keep only last 12 data points
        if (chart.data.labels.length > 12) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update('none');
    }

    updateResultsTable(candidates) {
        const tbody = document.getElementById('resultsTableBody');
        
        if (!candidates || !candidates.names.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-5">
                        <i class="bi bi-info-circle fs-3"></i><br>
                        No candidates registered yet
                    </td>
                </tr>
            `;
            return;
        }

        // Calculate total votes and create candidate objects
        const totalVotes = candidates.votes.reduce((sum, votes) => sum + parseInt(votes), 0);
        const candidateData = candidates.names.map((name, index) => ({
            name,
            party: candidates.parties[index],
            votes: parseInt(candidates.votes[index]),
            percentage: totalVotes > 0 ? ((parseInt(candidates.votes[index]) / totalVotes) * 100).toFixed(1) : 0
        }));

        // Sort by votes (descending)
        candidateData.sort((a, b) => b.votes - a.votes);

        tbody.innerHTML = candidateData.map((candidate, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
            
            return `
                <tr>
                    <td>
                        <span class="rank-badge ${rankClass}">${rank}</span>
                    </td>
                    <td>
                        <div class="fw-bold">${candidate.name}</div>
                    </td>
                    <td>
                        <span class="badge bg-secondary">${candidate.party}</span>
                    </td>
                    <td>
                        <span class="fw-bold">${candidate.votes.toLocaleString()}</span>
                    </td>
                    <td>
                        <span class="fw-bold">${candidate.percentage}%</span>
                    </td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${candidate.percentage}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateConnectionStatus(status) {
        const statusEl = document.getElementById('connection-status');
        statusEl.className = `status-indicator ${status}`;
        statusEl.innerHTML = status === 'connected' 
            ? '<i class="bi bi-circle-fill"></i><span>Connected</span>'
            : '<i class="bi bi-circle-fill"></i><span>Disconnected</span>';
    }

    addActivityItem(message, type = 'info') {
        const feed = document.getElementById('activityFeed');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const icons = {
            success: 'bi-check-circle text-success',
            error: 'bi-exclamation-circle text-danger',
            warning: 'bi-exclamation-triangle text-warning',
            info: 'bi-info-circle text-info'
        };

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item fade-in';
        activityItem.innerHTML = `
            <div class="activity-time">${time}</div>
            <div class="activity-content">
                <i class="bi ${icons[type] || icons.info}"></i>
                ${message}
            </div>
        `;

        // Add to beginning of feed
        if (feed.children.length > 0) {
            feed.insertBefore(activityItem, feed.firstChild);
        } else {
            feed.appendChild(activityItem);
        }

        // Keep only last 10 items
        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    startRealTimeUpdates() {
        // Use longer polling interval when WebSocket is active for efficiency
        const pollingInterval = this.isRealTimeEnabled ? 30000 : 5000; // 30s with WebSocket, 5s without
        
        this.updateInterval = setInterval(async () => {
            try {
                // Skip if real-time updates are working
                if (this.isRealTimeEnabled) {
                    // Only update election dates and time remaining for polling when WebSocket is active
                    const electionDates = await this.getElectionDates();
                    this.updateTimeRemaining(electionDates.startDate, electionDates.endDate);
                    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
                    return;
                }
                
                // Full update when WebSocket is not available
                const [candidates, totalVotes, electionDates] = await Promise.all([
                    this.contract.methods.getCandidates().call(),
                    this.contract.methods.getTotalVotes().call(),
                    this.getElectionDates()
                ]);

                const currentVoteCount = parseInt(totalVotes);
                
                // Check for new votes
                if (currentVoteCount > this.previousVoteCount) {
                    const newVotes = currentVoteCount - this.previousVoteCount;
                    this.addActivityItem(`${newVotes} new vote${newVotes > 1 ? 's' : ''} cast`, 'success');
                    this.updateActivityChart(currentVoteCount);
                }

                this.previousVoteCount = currentVoteCount;

                this.updateMetrics({
                    totalVotes: currentVoteCount,
                    candidateCount: candidates.names.length,
                    startDate: electionDates.startDate,
                    endDate: electionDates.endDate
                });

                this.updateVoteDistributionChart(candidates);
                this.updateResultsTable(candidates);

            } catch (error) {
                console.error('Error updating dashboard:', error);
                this.addActivityItem('Error updating data from blockchain', 'error');
            }
        }, pollingInterval);
        
        console.log(`🔄 Polling started with ${pollingInterval/1000}s interval (WebSocket: ${this.isRealTimeEnabled ? 'enabled' : 'disabled'})`);
    }

    handleRealTimeVoteUpdate(data) {
        try {
            // Update metrics
            this.updateMetrics({
                totalVotes: data.totalVotes,
                candidateCount: data.candidates.names.length
            });
            
            // Update charts with new data
            this.updateVoteDistributionChart(data.candidates);
            this.updateResultsTable(data.candidates);
            this.updateActivityChart(data.totalVotes);
            
            // Add activity item
            const newVotes = data.totalVotes - (data.previousTotal || this.previousVoteCount);
            this.addActivityItem(`${newVotes} new vote${newVotes > 1 ? 's' : ''} cast`, 'success');
            
            // Update previous vote count
            this.previousVoteCount = data.totalVotes;
            
        } catch (error) {
            console.error('Error handling real-time vote update:', error);
            this.addActivityItem('Error processing real-time update', 'error');
        }
    }
    
    updateCandidateData(candidates) {
        try {
            this.updateVoteDistributionChart(candidates);
            this.updateResultsTable(candidates);
            
            // Update candidate count
            document.getElementById('total-candidates').textContent = candidates.names.length;
            
        } catch (error) {
            console.error('Error updating candidate data:', error);
        }
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Global functions for UI interactions
window.refreshCharts = async function() {
    if (window.dashboard) {
        const button = event.target;
        const originalIcon = button.innerHTML;
        
        button.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i>';
        button.disabled = true;

        try {
            await window.dashboard.loadInitialData();
            window.dashboard.addActivityItem('Charts refreshed manually', 'info');
        } catch (error) {
            window.dashboard.addActivityItem('Failed to refresh charts', 'error');
        }

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.disabled = false;
        }, 1000);
    }
};

window.exportResults = function() {
    if (window.dashboard) {
        try {
            // Get table data
            const table = document.getElementById('resultsTable');
            const rows = table.querySelectorAll('tbody tr');
            
            if (rows.length === 0 || rows[0].cells.length === 1) {
                window.dashboard.addActivityItem('No data to export', 'warning');
                return;
            }

            let csv = 'Rank,Candidate,Party,Votes,Percentage\n';
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5) {
                    const rank = cells[0].textContent.trim();
                    const candidate = cells[1].textContent.trim();
                    const party = cells[2].textContent.trim();
                    const votes = cells[3].textContent.trim();
                    const percentage = cells[4].textContent.trim();
                    
                    csv += `${rank},"${candidate}","${party}",${votes},${percentage}\n`;
                }
            });

            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `election-results-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            window.dashboard.addActivityItem('Election results exported successfully', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            window.dashboard.addActivityItem('Failed to export results', 'error');
        }
    }
};

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AnalyticsDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboard) {
        window.dashboard.stop();
    }
});
