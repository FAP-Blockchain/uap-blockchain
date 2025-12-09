// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/DataTypes.sol";

interface IUniversityManagement {
    function getUser(address userAddress) external view returns (DataTypes.User memory);

    function getUserByUserId(string calldata userId)
        external
        view
        returns (DataTypes.User memory);

    /// @notice Convenience view for the caller to fetch their own on-chain user record
    function getMyUser() external view returns (DataTypes.User memory);

    function getUserRole(address userAddress) external view returns (DataTypes.Role);

    function hasRole(address userAddress, DataTypes.Role role)
        external
        view
        returns (bool);

    function requireRole(address userAddress, DataTypes.Role role) external view;

    function getTotalUsers() external view returns (uint256);

    function getRoleCount(DataTypes.Role role) external view returns (uint256);

    /// @notice Admin-only wallet rotation for a user while preserving userId and metadata
    /// @dev Implementations should properly move mappings and role assignments
    function updateUserAddress(address oldAddress, address newAddress) external;
}
