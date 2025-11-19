// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/DataTypes.sol";

/**
 * @title ICredential
 * @notice Interface for Credential Management
 */
interface ICredential {
    // Events
    event CredentialIssued(
        uint256 indexed credentialId,
        address indexed studentAddress,
        string credentialType,
        address indexed issuedBy
    );
    
    event CredentialRevoked(
        uint256 indexed credentialId,
        address indexed revokedBy,
        uint256 revokedAt
    );
    
    event CredentialStatusUpdated(
        uint256 indexed credentialId,
        DataTypes.CredentialStatus oldStatus,
        DataTypes.CredentialStatus newStatus
    );

    // Functions
    function issueCredential(
        address studentAddress,
        string calldata credentialType,
        string calldata credentialData,
        uint256 expiresAt
    ) external returns (uint256);

    function revokeCredential(uint256 credentialId) external;

    function verifyCredential(uint256 credentialId) external view returns (bool);

    function getCredential(uint256 credentialId) external view returns (DataTypes.Credential memory);

    function getStudentCredentials(address studentAddress) external view returns (uint256[] memory);
}
