import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "dotenv/config";

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
      url: process.env.QUORUM_NODE_URL || "http://127.0.0.1:22000",
      chainId: parseInt(process.env.QUORUM_CHAIN_ID || "1337"),
      gas: 5000000,
      gasPrice: 0,
      accounts: {
        mnemonic: process.env.QUORUM_MNEMONIC || "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    },
    
    quorum_node2: {
      url: process.env.QUORUM_NODE2_URL || "http://127.0.0.1:22001",
      chainId: parseInt(process.env.QUORUM_CHAIN_ID || "1337"),
      gas: 4700000,
      gasPrice: 0,
      accounts: {
        mnemonic: process.env.QUORUM_MNEMONIC || "test test test test test test test test test test test junk"
      }
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
