# 🔧 Quorum Network Setup Guide

## Overview

This directory contains configuration files for setting up a 3-node Ethereum Quorum network using Docker Compose.

## Network Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Node 1        │     │   Node 2        │     │   Node 3        │
│   (Primary)     │────▶│   (Validator)   │────▶│   (Validator)   │
│                 │     │                 │     │                 │
│   Port: 22000   │     │   Port: 22002   │     │   Port: 22004   │
│   WS: 22001     │     │   WS: 22003     │     │   WS: 22005     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Quick Start

### 1. Start Quorum Network

```bash
cd quorum-config
docker-compose up -d
```

### 2. Check Node Status

```bash
# Check all containers
docker-compose ps

# Check Node 1 logs
docker logs quorum-node1

# Check Node 2 logs
docker logs quorum-node2

# Check Node 3 logs
docker logs quorum-node3
```

### 3. Verify Blockchain

```bash
# Check block number on Node 1
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check if mining
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}'
```

## Configuration Files

### genesis.json

Genesis block configuration for the Quorum network:
- **Chain ID**: 1337
- **Consensus**: Istanbul BFT
- **Block Period**: 5 seconds
- **Gas Limit**: 0xE0000000 (~3.7 billion)

### docker-compose.yml

Docker Compose configuration for 3 Quorum nodes:
- **Node 1** (Primary): Ports 22000 (HTTP), 22001 (WebSocket)
- **Node 2** (Validator): Ports 22002 (HTTP), 22003 (WebSocket)
- **Node 3** (Validator): Ports 22004 (HTTP), 22005 (WebSocket)

## Port Mapping

| Service | Host Port | Container Port | Protocol |
|---------|-----------|----------------|----------|
| Node 1 HTTP | 22000 | 8545 | JSON-RPC |
| Node 1 WS | 22001 | 8546 | WebSocket |
| Node 2 HTTP | 22002 | 8545 | JSON-RPC |
| Node 2 WS | 22003 | 8546 | WebSocket |
| Node 3 HTTP | 22004 | 8545 | JSON-RPC |
| Node 3 WS | 22005 | 8546 | WebSocket |

## Management Commands

### Start Network

```bash
docker-compose up -d
```

### Stop Network

```bash
docker-compose down
```

### Restart Network

```bash
docker-compose restart
```

### View Logs

```bash
# All nodes
docker-compose logs -f

# Specific node
docker logs -f quorum-node1
```

### Clean Data (Reset Network)

```bash
docker-compose down -v
docker-compose up -d
```

## Testing Connection

### Test Node 1

```bash
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Test Node 2

```bash
curl -X POST http://127.0.0.1:22002 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Test Node 3

```bash
curl -X POST http://127.0.0.1:22004 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## Troubleshooting

### Containers Won't Start

```bash
# Check Docker status
docker ps -a

# View container logs
docker logs quorum-node1

# Check port conflicts
netstat -an | findstr "22000"
```

### Nodes Not Syncing

```bash
# Check peer connections
curl -X POST http://127.0.0.1:22000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"admin_peers","params":[],"id":1}'

# Restart network
docker-compose restart
```

### Data Corruption

```bash
# Stop network
docker-compose down

# Remove volumes
docker volume rm quorum-config_quorum-node1-data
docker volume rm quorum-config_quorum-node2-data
docker volume rm quorum-config_quorum-node3-data

# Restart network
docker-compose up -d
```

## Production Recommendations

1. **Use persistent volumes** for node data
2. **Enable TLS/SSL** for RPC connections
3. **Configure firewall rules** to restrict access
4. **Setup monitoring** (Prometheus + Grafana)
5. **Enable audit logging** for all transactions
6. **Backup node data** regularly
7. **Use separate machines** for each node
8. **Configure resource limits** in docker-compose.yml

## Network Features

- ✅ **Istanbul BFT Consensus** - Byzantine fault tolerant
- ✅ **Zero Gas Price** - Free transactions
- ✅ **5-second Block Time** - Fast finality
- ✅ **Permissioned Network** - Controlled access
- ✅ **Private Transactions** - Optional privacy
- ✅ **Smart Contract Support** - Full EVM compatibility

## Next Steps

1. Deploy smart contracts: `npm run deploy:quorum`
2. Setup initial roles: `npx hardhat run scripts/setup-roles.ts --network quorum_local`
3. Verify deployment: `npx hardhat run scripts/verify.ts --network quorum_local`

---

**Network**: Quorum 3-node Istanbul BFT  
**Chain ID**: 1337  
**Last Updated**: November 2025
