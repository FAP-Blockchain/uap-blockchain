// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/ICredential.sol";
import "./libraries/DataTypes.sol";
import "./interfaces/IUniversityManagement.sol";

/**
 * @title CredentialManagement
 * @notice Manages academic credentials issuance and verification
 */
contract CredentialManagement is ICredential {
    // State variables
    address public universityManagement;
    
    mapping(uint256 => DataTypes.Credential) public credentials;
    mapping(address => uint256[]) public studentCredentials;
    
    uint256 public credentialCount;
    
    // Modifiers
    modifier onlyAdmin() {
        IUniversityManagement(universityManagement).requireRole(msg.sender, DataTypes.Role.ADMIN);
        _;
    }

    constructor(address _universityManagement) {
        require(_universityManagement != address(0), "Invalid address");
        universityManagement = _universityManagement;
    }

    /**
     * @notice Issue a new credential
     */
    function issueCredential(
        address studentAddress,
        string calldata credentialType,
        string calldata credentialData,
        uint256 expiresAt
    ) external onlyAdmin returns (uint256) {
        require(studentAddress != address(0), "Invalid student address");
        require(bytes(credentialType).length > 0, "Credential type required");
        
        credentialCount++;
        uint256 credentialId = credentialCount;

        credentials[credentialId] = DataTypes.Credential({
            credentialId: credentialId,
            studentAddress: studentAddress,
            credentialType: credentialType,
            credentialData: credentialData,
            status: DataTypes.CredentialStatus.ACTIVE,
            issuedBy: msg.sender,
            issuedAt: block.timestamp,
            expiresAt: expiresAt
        });

        studentCredentials[studentAddress].push(credentialId);

        emit CredentialIssued(credentialId, studentAddress, credentialType, msg.sender);

        return credentialId;
    }

    /**
     * @notice Revoke a credential
     */
    function revokeCredential(uint256 credentialId) external onlyAdmin {
        require(credentials[credentialId].credentialId != 0, "Credential not found");
        require(
            credentials[credentialId].status == DataTypes.CredentialStatus.ACTIVE,
            "Credential not active"
        );

        credentials[credentialId].status = DataTypes.CredentialStatus.REVOKED;

        emit CredentialRevoked(credentialId, msg.sender, block.timestamp);
    }

    /**
     * @notice Verify if credential is valid
     */
    function verifyCredential(uint256 credentialId) external view returns (bool) {
        DataTypes.Credential memory cred = credentials[credentialId];
        
        if (cred.credentialId == 0) return false;
        if (cred.status != DataTypes.CredentialStatus.ACTIVE) return false;
        if (cred.expiresAt > 0 && block.timestamp > cred.expiresAt) return false;
        
        return true;
    }

    /**
     * @notice Get credential details
     */
    function getCredential(uint256 credentialId) external view returns (DataTypes.Credential memory) {
        require(credentials[credentialId].credentialId != 0, "Credential not found");
        return credentials[credentialId];
    }

    /**
     * @notice Get all credentials for a student
     */
    function getStudentCredentials(address studentAddress) external view returns (uint256[] memory) {
        return studentCredentials[studentAddress];
    }
}
