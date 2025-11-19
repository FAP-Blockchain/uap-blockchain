// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./libraries/DataTypes.sol";
import "./libraries/Roles.sol";

/**
 * @title UniversityManagement
 * @notice Main contract orchestrating the UAP Blockchain system
 * @dev Manages users, roles, and references to other system contracts
 */
contract UniversityManagement {
    using Roles for Roles.RoleData;

    // State variables
    Roles.RoleData private roleData;
    
    mapping(address => DataTypes.User) public users;
    mapping(string => address) public userIdToAddress;
    
    address[] public userAddresses;
    
    address public credentialContract;
    address public attendanceContract;
    address public gradeContract;
    address public classContract;
    
    address public owner;
    bool public initialized;

    // Events
    event UserRegistered(address indexed userAddress, string userId, DataTypes.Role role);
    event UserUpdated(address indexed userAddress, string userId);
    event UserDeactivated(address indexed userAddress);
    event ContractUpdated(string contractType, address contractAddress);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        roleData.requireAdmin(msg.sender);
        _;
    }

    modifier onlyInitialized() {
        require(initialized, "Contract not initialized");
        _;
    }

    /**
     * @notice Constructor - sets contract owner
     */
    constructor() {
        owner = msg.sender;
        
        // Register owner as first admin
        roleData.grantRole(msg.sender, DataTypes.Role.ADMIN);
        
        users[msg.sender] = DataTypes.User({
            userAddress: msg.sender,
            userId: "ADMIN001",
            fullName: "Administrator",
            email: "admin@fap.edu.vn",
            role: DataTypes.Role.ADMIN,
            isActive: true,
            createdAt: block.timestamp
        });
        
        userIdToAddress["ADMIN001"] = msg.sender;
        userAddresses.push(msg.sender);
        
        emit UserRegistered(msg.sender, "ADMIN001", DataTypes.Role.ADMIN);
    }

    /**
     * @notice Initialize contract with other system contracts
     */
    function initialize(
        address _credentialContract,
        address _attendanceContract,
        address _gradeContract,
        address _classContract
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        
        credentialContract = _credentialContract;
        attendanceContract = _attendanceContract;
        gradeContract = _gradeContract;
        classContract = _classContract;
        
        initialized = true;
    }

    /**
     * @notice Register a new user
     */
    function registerUser(
        address userAddress,
        string calldata userId,
        string calldata fullName,
        string calldata email,
        DataTypes.Role role
    ) external onlyAdmin {
        require(userAddress != address(0), "Invalid address");
        require(bytes(userId).length > 0, "User ID required");
        require(users[userAddress].userAddress == address(0), "User already registered");
        require(userIdToAddress[userId] == address(0), "User ID already taken");
        require(role != DataTypes.Role.NONE, "Invalid role");

        // Grant role
        roleData.grantRole(userAddress, role);

        // Create user
        users[userAddress] = DataTypes.User({
            userAddress: userAddress,
            userId: userId,
            fullName: fullName,
            email: email,
            role: role,
            isActive: true,
            createdAt: block.timestamp
        });

        userIdToAddress[userId] = userAddress;
        userAddresses.push(userAddress);

        emit UserRegistered(userAddress, userId, role);
    }

    /**
     * @notice Update user information
     */
    function updateUser(
        address userAddress,
        string calldata fullName,
        string calldata email
    ) external onlyAdmin {
        require(users[userAddress].isActive, "User not found or inactive");

        users[userAddress].fullName = fullName;
        users[userAddress].email = email;

        emit UserUpdated(userAddress, users[userAddress].userId);
    }

    /**
     * @notice Deactivate a user
     */
    function deactivateUser(address userAddress) external onlyAdmin {
        require(users[userAddress].isActive, "User not found or already inactive");
        require(userAddress != owner, "Cannot deactivate owner");

        users[userAddress].isActive = false;
        roleData.revokeRole(userAddress);

        emit UserDeactivated(userAddress);
    }

    /**
     * @notice Update system contract addresses
     */
    function updateContract(string calldata contractType, address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Invalid address");

        bytes32 contractHash = keccak256(abi.encodePacked(contractType));

        if (contractHash == keccak256(abi.encodePacked("credential"))) {
            credentialContract = contractAddress;
        } else if (contractHash == keccak256(abi.encodePacked("attendance"))) {
            attendanceContract = contractAddress;
        } else if (contractHash == keccak256(abi.encodePacked("grade"))) {
            gradeContract = contractAddress;
        } else if (contractHash == keccak256(abi.encodePacked("class"))) {
            classContract = contractAddress;
        } else {
            revert("Invalid contract type");
        }

        emit ContractUpdated(contractType, contractAddress);
    }

    // View functions
    function getUser(address userAddress) external view returns (DataTypes.User memory) {
        return users[userAddress];
    }

    function getUserByUserId(string calldata userId) external view returns (DataTypes.User memory) {
        address userAddress = userIdToAddress[userId];
        return users[userAddress];
    }

    function getUserRole(address userAddress) external view returns (DataTypes.Role) {
        return roleData.getRole(userAddress);
    }

    function hasRole(address userAddress, DataTypes.Role role) external view returns (bool) {
        return roleData.hasRole(userAddress, role);
    }
    
    function requireRole(address userAddress, DataTypes.Role role) external view {
        roleData.requireRole(userAddress, role);
    }

    function getTotalUsers() external view returns (uint256) {
        return userAddresses.length;
    }

    function getRoleCount(DataTypes.Role role) external view returns (uint256) {
        return roleData.getRoleCount(role);
    }
}
