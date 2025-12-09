import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "dotenv/config";

const {
  QUORUM_NODE_URL,
  QUORUM_NODE2_URL,
  QUORUM_CHAIN_ID,
  QUORUM_MNEMONIC,
  ADMIN_PRIVATE_KEY
} = process.env;

// Default Hardhat test account (funded in genesis.json)
const DEFAULT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const quorumAccounts = ADMIN_PRIVATE_KEY
  ? [ADMIN_PRIVATE_KEY]
  : QUORUM_MNEMONIC
  ? {
      mnemonic: QUORUM_MNEMONIC,
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 10
    }
  : [DEFAULT_PRIVATE_KEY]; // Fallback to default funded account

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20,
        accountsBalance: "10000000000000000000000"
      }
    },
    
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      initialBaseFeePerGas: 0
    },
    
    quorum_local: {
      url: QUORUM_NODE_URL || "http://127.0.0.1:22000",
      chainId: parseInt(QUORUM_CHAIN_ID || "1337"),
      gas: "auto", // Allow auto estimation
      gasPrice: 0,
      accounts: quorumAccounts
    },
    
    quorum_node2: {
      url: QUORUM_NODE2_URL || "http://127.0.0.1:22002", // Fixed port from 22001 to 22002 (Node 2 RPC)
      chainId: parseInt(QUORUM_CHAIN_ID || "1337"),
      gas: "auto",
      gasPrice: 0,
      accounts: quorumAccounts
    }
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  },
  
  mocha: {
    timeout: 40000
  }
};

export default config;
