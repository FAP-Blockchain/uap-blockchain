// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./DataTypes.sol";

/**
 * @title Roles
 * @notice Role-based access control library for UAP Blockchain
 */
library Roles {
    // Events
    event RoleGranted(address indexed account, DataTypes.Role role, address indexed grantedBy);
    event RoleRevoked(address indexed account, DataTypes.Role role, address indexed revokedBy);

    // Storage structure
    struct RoleData {
        mapping(address => DataTypes.Role) roles;
        mapping(DataTypes.Role => uint256) roleCounts;
    }

    /**
     * @notice Grant a role to an account
     */
    function grantRole(
        RoleData storage self,
        address account,
        DataTypes.Role role
    ) internal {
        require(account != address(0), "Roles: account is zero address");
        require(role != DataTypes.Role.NONE, "Roles: cannot grant NONE role");
        
        DataTypes.Role currentRole = self.roles[account];
        
        if (currentRole != role) {
            // Remove from old role count
            if (currentRole != DataTypes.Role.NONE) {
                self.roleCounts[currentRole]--;
            }
            
            // Add to new role
            self.roles[account] = role;
            self.roleCounts[role]++;
            
            emit RoleGranted(account, role, msg.sender);
        }
    }

    /**
     * @notice Revoke role from an account
     */
    function revokeRole(
        RoleData storage self,
        address account
    ) internal {
        require(account != address(0), "Roles: account is zero address");
        
        DataTypes.Role currentRole = self.roles[account];
        
        if (currentRole != DataTypes.Role.NONE) {
            self.roleCounts[currentRole]--;
            self.roles[account] = DataTypes.Role.NONE;
            
            emit RoleRevoked(account, currentRole, msg.sender);
        }
    }

    /**
     * @notice Check if account has specific role
     */
    function hasRole(
        RoleData storage self,
        address account,
        DataTypes.Role role
    ) internal view returns (bool) {
        return self.roles[account] == role;
    }

    /**
     * @notice Get role of an account
     */
    function getRole(
        RoleData storage self,
        address account
    ) internal view returns (DataTypes.Role) {
        return self.roles[account];
    }

    /**
     * @notice Get count of accounts with specific role
     */
    function getRoleCount(
        RoleData storage self,
        DataTypes.Role role
    ) internal view returns (uint256) {
        return self.roleCounts[role];
    }

    /**
     * @notice Check if account is admin
     */
    function isAdmin(
        RoleData storage self,
        address account
    ) internal view returns (bool) {
        return self.roles[account] == DataTypes.Role.ADMIN;
    }

    /**
     * @notice Check if account is university official
     */
    function isUniversity(
        RoleData storage self,
        address account
    ) internal view returns (bool) {
        return self.roles[account] == DataTypes.Role.UNIVERSITY;
    }

    /**
     * @notice Check if account is lecturer
     */
    function isLecturer(
        RoleData storage self,
        address account
    ) internal view returns (bool) {
        return self.roles[account] == DataTypes.Role.LECTURER;
    }

    /**
     * @notice Check if account is student
     */
    function isStudent(
        RoleData storage self,
        address account
    ) internal view returns (bool) {
        return self.roles[account] == DataTypes.Role.STUDENT;
    }

    /**
     * @notice Require account has specific role
     */
    function requireRole(
        RoleData storage self,
        address account,
        DataTypes.Role role
    ) internal view {
        require(
            hasRole(self, account, role),
            string(abi.encodePacked("Roles: account missing required role"))
        );
    }

    /**
     * @notice Require account is admin
     */
    function requireAdmin(
        RoleData storage self,
        address account
    ) internal view {
        require(isAdmin(self, account), "Roles: caller is not admin");
    }
}
