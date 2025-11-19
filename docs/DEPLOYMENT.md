# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose
- Git
- Hardhat

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/uap-blockchain.git
cd uap-blockchain
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```env
# Quorum Node URLs
QUORUM_NODE_URL=http://127.0.0.1:22000
QUORUM_NODE2_URL=http://127.0.0.1:22001
QUORUM_NODE3_URL=http://127.0.0.1:22002
QUORUM_CHAIN_ID=1337

# Test Accounts
MNEMONIC="test test test test test test test test test test test junk"
ADMIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/uap_blockchain

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 4. Compile Contracts

```bash
npm run compile
```

### 5. Run Tests

```bash
npm test
```

---

## Quorum Network Setup

### Option 1: Docker Compose (Recommended)

```bash
cd quorum-config
docker-compose up -d
```

This will start:
- 3 Quorum nodes (ports 22000, 22001, 22002)
- Tessera privacy managers
- Network monitoring tools

### Option 2: Manual Setup

See `quorum-config/README.md` for detailed instructions.

---

## Smart Contract Deployment

### Deploy to Local Hardhat Network

```bash
npm run deploy
```

### Deploy to Quorum Network

```bash
npm run deploy:quorum
```

### Verify Deployment

```bash
npx hardhat run scripts/verify.ts --network quorum_local
```

---

## Post-Deployment Setup

### 1. Initialize System

```bash
npx hardhat run scripts/setup-roles.ts --network quorum_local
```

This will:
- Register initial admin
- Create sample university official
- Create sample lecturer
- Create sample students

### 2. Verify Contract Addresses

Check `deployments.json` for deployed contract addresses:

```json
{
  "network": "quorum_local",
  "chainId": "1337",
  "contracts": {
    "UniversityManagement": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "CredentialManagement": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    ...
  }
}
```

---

## Production Deployment

### 1. Security Checklist

- [ ] Change all default private keys
- [ ] Update JWT secret
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Setup monitoring and alerting
- [ ] Enable audit logging
- [ ] Backup node data regularly

### 2. Infrastructure Setup

#### Quorum Nodes

Deploy on separate servers:

```
Node 1: 10.0.1.10:22000 (Primary)
Node 2: 10.0.1.11:22000 (Validator)
Node 3: 10.0.1.12:22000 (Validator)
```

#### Load Balancer

Setup NGINX for API load balancing:

```nginx
upstream quorum_backend {
    server 10.0.1.10:22000;
    server 10.0.1.11:22000;
    server 10.0.1.12:22000;
}

server {
    listen 443 ssl;
    server_name api.uap-blockchain.edu.vn;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://quorum_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Deploy Smart Contracts

```bash
# Set production network in hardhat.config.ts
npx hardhat run scripts/deploy.ts --network production
```

### 4. Setup Monitoring

#### Prometheus Config

```yaml
scrape_configs:
  - job_name: 'quorum'
    static_configs:
      - targets:
        - '10.0.1.10:9545'
        - '10.0.1.11:9545'
        - '10.0.1.12:9545'
```

#### Grafana Dashboard

Import Quorum dashboard template from `monitoring/grafana-dashboard.json`

---

## Backup & Recovery

### Node Data Backup

```bash
# Backup Quorum data directory
tar -czf quorum-backup-$(date +%Y%m%d).tar.gz /data/quorum

# Backup to S3
aws s3 cp quorum-backup-*.tar.gz s3://backups/quorum/
```

### Contract State Export

```bash
# Export contract state
npx hardhat run scripts/export-state.ts --network production > state-backup.json
```

### Recovery Process

1. Stop Quorum nodes
2. Restore data directory from backup
3. Restart nodes
4. Verify blockchain sync
5. Test contract interactions

---

## Troubleshooting

### Contract Deployment Failed

```bash
# Check node status
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check account balance
npx hardhat console --network quorum_local
> const balance = await ethers.provider.getBalance("0x...")
> console.log(ethers.formatEther(balance))
```

### Transaction Stuck

```bash
# Check pending transactions
npx hardhat run scripts/check-pending.ts --network quorum_local

# Clear transaction pool (if needed)
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":1}'
```

### Node Sync Issues

```bash
# Check sync status
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'

# Restart node
docker-compose restart quorum-node1
```

---

## Maintenance

### Regular Tasks

- **Daily**: Check node sync status
- **Weekly**: Review transaction logs
- **Monthly**: Backup contract state
- **Quarterly**: Security audit

### Upgrade Process

1. Test upgrades on staging environment
2. Schedule maintenance window
3. Backup all data
4. Deploy new contracts
5. Migrate data if needed
6. Verify functionality
7. Monitor for 24 hours

---

## Support & Contact

- **Technical Issues**: tech-support@uap-blockchain.edu.vn
- **Emergency**: +84-xxx-xxx-xxxx
- **Documentation**: https://docs.uap-blockchain.edu.vn

---

**Last Updated**: November 2025  
**Deployment Version**: 1.0.0
