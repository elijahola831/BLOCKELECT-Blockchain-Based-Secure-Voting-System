module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: 1337, // Match Ganache network id
            gas: 6721975,      // Gas limit
            gasPrice: 20000000000, // 20 gwei
            confirmations: 0,  // # of confirmations to wait between deployments
            timeoutBlocks: 200, // # of blocks before a deployment times out
            skipDryRun: true   // Skip dry run before migrations
        },
        
        // Configuration for other networks can be added here
        mainnet: {
            // Ethereum mainnet configuration (for future use)
            network_id: 1,
            skipDryRun: false
        }
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.19", // Fetch exact version from solc-bin
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
                // evmVersion: "istanbul" // Use compatible EVM version
            }
        },
    },

    // Set default mocha options
    mocha: {
        timeout: 100000
    },

    // Configure migrations directory
    migrations_directory: "./migrations",

    // Configure contracts directory
    contracts_directory: "./contracts",

    // Configure contracts build directory
    contracts_build_directory: "./build/contracts"
};
