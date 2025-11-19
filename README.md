# 🎓 UAP Blockchain - University Academic Platform on Blockchain# Sample Hardhat 3 Beta Project (`mocha` and `ethers`)



## 📋 OverviewThis project showcases a Hardhat 3 Beta project using `mocha` for tests and the `ethers` library for Ethereum interactions.

University Academic Platform using **Ethereum Quorum** for managing academic records, credentials, attendance, and grades.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

### 👥 Team Members

- **SE170107** - Nguyễn Phi Hùng (Leader)## Project Overview

- **SE170246** - Nguyễn Trung Nam

- **SE170118** - Huỳnh Gia BảoThis example project includes:

- **SE170117** - Nghiêm Văn Hoàng

- A simple Hardhat configuration file.

**Supervisor:** Mr. Nguyễn Ngọc Lâm- Foundry-compatible Solidity unit tests.

- TypeScript integration tests using `mocha` and ethers.js

---- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.



## 🚀 Quick Start## Usage



### 1. Install Dependencies### Running Tests

\`\`\`bash

npm installTo run all the tests in the project, execute the following command:

\`\`\`

```shell

### 2. Compile Contractsnpx hardhat test

\`\`\`bash```

npm run compile

\`\`\`You can also selectively run the Solidity or `mocha` tests:



### 3. Run Tests```shell

\`\`\`bashnpx hardhat test solidity

npm testnpx hardhat test mocha

\`\`\````



### 4. Deploy to Quorum### Make a deployment to Sepolia

\`\`\`bash

npm run deploy:quorumThis project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

\`\`\`

To run the deployment to a local chain:

---

```shell

## 📁 Project Structurenpx hardhat ignition deploy ignition/modules/Counter.ts

```

\`\`\`

uap-blockchain/## Running on Quorum (private transactions)

├── contracts/               # Smart contracts

├── scripts/                 # Deployment scriptsThis project contains helper scripts to deploy and interact with the `CredentialManagement` contract using Quorum private transactions (Tessera).

├── test/                    # Test files

├── quorum-config/          # Quorum setupPrerequisites

└── docs/                   # Documentation

\`\`\`Quickstart (WSL2)

```powershell

---# In WSL2 shell

git clone https://github.com/ConsenSys/quorum-dev-quickstart.git

## 🔧 Networkscd quorum-quickstart

./run.sh up

- **Hardhat Local:** http://127.0.0.1:8545 (Chain ID: 31337)# RPC ports will be printed in the quickstart output (e.g. 22000, 22001...)

- **Quorum Node 1:** http://127.0.0.1:22000 (Chain ID: 1337)```

- **Quorum Node 2:** http://127.0.0.1:22001 (Chain ID: 1337)

Set environment

---1. Copy `.env.sample` to `.env` and fill values (do NOT commit `.env`).

2. If you deployed using unlocked accounts on node, set `FROM_ADDRESS` and `PRIVATE_FOR`.

## 📝 License3. If you prefer client-side signing, set `PRIVATE_KEY` and `PRIVATE_FOR`.

MIT License

## Signing and recording proofs (off-chain signature -> on-chain anchor)

**⭐ Built with Ethereum Quorum**

Create a `.env` file at project root with these values (example):

```text
QUORUM_RPC=http://127.0.0.1:22000
PRIVATE_KEY=0xYOUR_ISSUER_PRIVATE_KEY
CONTRACT_ADDRESS=0xYourDeployedContract
PROOF='Diploma: Alice - BSc - 2025'
# optional: PROOF_FILE=./proof.txt
# optional: PROOF_TIMESTAMP=169xxxxxxx  (unix seconds)
```

To sign and submit the proof (TypeScript):

```powershell
npx ts-node scripts/signAndRecordProof.ts
```

Notes:
- `recordProof` expects an EIP-712 typed signature over `CredentialProof { bytes32 hash; uint256 timestamp; }`.
- The contract enforces a `MAX_PROOF_AGE` window (default 7 days) so the timestamp must be recent.

Install deps (if not yet):
```powershell
npm install
npm install web3 dotenv --save --legacy-peer-deps
```

Deploy contract (private)
```powershell
npm run quorum:deploy
```
This will deploy using the `.env` settings and save the deployed address to `deploys/quorum.json`.

Issue a private credential
```powershell
npm run quorum:issue
```

Grant an issuer role (private)
```powershell
node scripts/quorum/grantIssuer.cjs
```

Revoke an issuer role (private)
```powershell
node scripts/quorum/revokeIssuer.cjs
```

Send a raw private transaction (signed client-side)
```powershell
npm run quorum:sendRaw
```

Notes
- `PRIVATE_FOR` must contain Tessera public keys (base64) for recipient nodes.
- If using `PRIVATE_KEY` the scripts sign client-side and call `eth_sendRawPrivateTransaction`.
- When using unlocked node accounts the scripts set `privateFor` on the transaction and call `eth_sendTransaction`.

TypeScript scripts
------------------
You can also find TypeScript versions in `scripts/quorum/ts/` (useful when you wire TypeChain types). Run them with `ts-node`:

```powershell
npx ts-node scripts/quorum/ts/deploy.ts
npx ts-node scripts/quorum/ts/issue.ts
npx ts-node scripts/quorum/ts/grantIssuer.ts
npx ts-node scripts/quorum/ts/revokeIssuer.ts
```

Deployed addresses
------------------
Deployed addresses are written to `deploys/quorum.json` (field `latest` and an `all` array of previous deploys).


To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
