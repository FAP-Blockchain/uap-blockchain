# 🏗️ UAP Blockchain Architecture

## System Overview

UAP Blockchain is a permissioned blockchain system built on **Ethereum Quorum** for managing university academic records, credentials, attendance, and grades.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)            │
│                    User Interface Layer                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (ASP.NET Core)                  │
│  - Authentication & Authorization                            │
│  - Business Logic                                            │
│  - Web3 Integration                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ JSON-RPC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Ethereum Quorum Network (Permissioned)             │
│  ┌────────────────┬────────────────┬────────────────┐       │
│  │   Node 1       │   Node 2       │   Node 3       │       │
│  │  (Port 22000)  │  (Port 22001)  │  (Port 22002)  │       │
│  └────────────────┴────────────────┴────────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Smart Contracts                          │
│  ┌─────────────────────────────────────────────────┐        │
│  │         UniversityManagement (Main)             │        │
│  │  - User Management                              │        │
│  │  - Role-Based Access Control                    │        │
│  │  - Contract Orchestration                       │        │
│  └──────────┬──────────────────────────────────────┘        │
│             │                                                │
│  ┌──────────┴──────────────────────────────────────┐        │
│  │                                                  │        │
│  ▼                  ▼                 ▼             ▼        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Credential│  │Attendance│  │  Grade   │  │  Class   │   │
│  │Management│  │Management│  │Management│  │Management│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Smart Contracts Layer

#### UniversityManagement
- **Purpose**: Main orchestrator contract
- **Responsibilities**:
  - User registration and management
  - Role-based access control (RBAC)
  - System initialization
  - Contract address management

#### CredentialManagement
- **Purpose**: Academic credential issuance and verification
- **Features**:
  - Issue degrees, certificates, transcripts
  - Revoke credentials
  - Verify credential authenticity
  - IPFS integration for credential data

#### AttendanceManagement
- **Purpose**: Student attendance tracking
- **Features**:
  - Mark attendance (Present/Absent/Late/Excused)
  - Update attendance records
  - Calculate attendance rates
  - Session-based tracking

#### GradeManagement
- **Purpose**: Grade recording and approval workflow
- **Features**:
  - Record grades for multiple components
  - Update draft grades
  - Approval workflow (Lecturer → University)
  - Calculate final grades

#### ClassManagement
- **Purpose**: Class and enrollment management
- **Features**:
  - Create classes
  - Enroll/drop students
  - Track class capacity
  - Manage class schedules

### 2. Supporting Libraries

#### DataTypes Library
- Defines all data structures (structs and enums)
- Shared across all contracts
- Ensures consistency

#### Roles Library
- Role-based access control utilities
- Role assignment and revocation
- Role verification functions

### 3. Interfaces

- `ICredential`: Credential management interface
- `IAttendance`: Attendance tracking interface
- `IGrade`: Grade management interface

## Data Flow

### Example: Issue Credential

```
1. University Official → Backend API
   POST /api/credentials
   {
     "studentId": "SE170107",
     "type": "DEGREE",
     "data": "ipfs://QmHash..."
   }

2. Backend API → Smart Contract
   credentialManagement.issueCredential(
     studentAddress,
     "DEGREE",
     "ipfs://QmHash...",
     expiresAt
   )

3. Smart Contract → Blockchain
   - Validate permissions
   - Create credential record
   - Emit CredentialIssued event
   - Store on all nodes

4. Blockchain → Backend API
   - Transaction receipt
   - Credential ID

5. Backend API → Frontend
   {
     "credentialId": 1,
     "transactionHash": "0x...",
     "status": "success"
   }
```

## Security Model

### Role Hierarchy

```
ADMIN (1)
  └─ System-wide administration
  └─ Can grant/revoke roles

UNIVERSITY (2)
  └─ Create classes
  └─ Enroll students
  └─ Approve grades
  └─ Issue credentials

LECTURER (3)
  └─ Mark attendance
  └─ Record grades
  └─ View class roster

STUDENT (4)
  └─ View own records
  └─ Request credentials
```

### Access Control

- **Function-level**: Modifiers check caller's role
- **Data-level**: Students can only access own data
- **Contract-level**: Only UniversityManagement can initialize other contracts

## Network Configuration

### Quorum Network

- **Consensus**: Istanbul BFT (Byzantine Fault Tolerant)
- **Gas Price**: 0 (free transactions)
- **Block Time**: ~5 seconds
- **Chain ID**: 1337
- **Permissioned**: Only authorized nodes can join

### Node Setup

- **Node 1** (22000): Primary node
- **Node 2** (22001): Validator node
- **Node 3** (22002): Validator node

## Deployment Process

1. **Deploy Libraries**
   - DataTypes.sol
   - Roles.sol

2. **Deploy Main Contract**
   - UniversityManagement.sol

3. **Deploy Feature Contracts**
   - CredentialManagement.sol
   - AttendanceManagement.sol
   - GradeManagement.sol
   - ClassManagement.sol

4. **Initialize System**
   - Link contracts in UniversityManagement
   - Setup initial admin roles

## Scalability Considerations

- **Off-chain Storage**: Large credential data stored on IPFS
- **Event Indexing**: Use event logs for querying historical data
- **Batch Operations**: Group related operations in single transaction
- **Read Replicas**: Use multiple Quorum nodes for read scaling

## Future Enhancements

- [ ] Multi-signature approval for critical operations
- [ ] Token-based incentive system
- [ ] Cross-university credential verification
- [ ] Student transcript NFTs
- [ ] Automated grade calculation with configurable weights
- [ ] Integration with national education database

---

**Last Updated**: November 2025  
**Team**: SE170107, SE170246, SE170118, SE170117  
**Supervisor**: Nguyễn Ngọc Lâm
