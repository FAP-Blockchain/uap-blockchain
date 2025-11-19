// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IGrade.sol";
import "./libraries/DataTypes.sol";

interface IUniversityManagement {
    function requireRole(address userAddress, DataTypes.Role role) external view;
}

/**
 * @title GradeManagement
 * @notice Manages student grade recording and approval
 */
contract GradeManagement is IGrade {
    // State variables
    address public universityManagement;
    
    mapping(uint256 => DataTypes.GradeRecord) public gradeRecords;
    mapping(uint256 => mapping(address => uint256[])) public classStudentGrades;
    
    uint256 public gradeCount;
    
    // Modifiers
    modifier onlyLecturer() {
        IUniversityManagement(universityManagement).requireRole(msg.sender, DataTypes.Role.LECTURER);
        _;
    }
    
    modifier onlyAdmin() {
        IUniversityManagement(universityManagement).requireRole(msg.sender, DataTypes.Role.ADMIN);
        _;
    }

    constructor(address _universityManagement) {
        require(_universityManagement != address(0), "Invalid address");
        universityManagement = _universityManagement;
    }

    /**
     * @notice Record a grade for a student
     */
    function recordGrade(
        uint256 classId,
        address studentAddress,
        string calldata componentName,
        uint256 score,
        uint256 maxScore
    ) external onlyLecturer returns (uint256) {
        require(studentAddress != address(0), "Invalid student address");
        require(classId > 0, "Invalid class ID");
        require(bytes(componentName).length > 0, "Component name required");
        require(score <= maxScore, "Score exceeds max score");
        
        gradeCount++;
        uint256 gradeId = gradeCount;

        gradeRecords[gradeId] = DataTypes.GradeRecord({
            gradeId: gradeId,
            classId: classId,
            studentAddress: studentAddress,
            componentName: componentName,
            score: score,
            maxScore: maxScore,
            status: DataTypes.GradeStatus.DRAFT,
            gradedBy: msg.sender,
            gradedAt: block.timestamp,
            approvedBy: address(0),
            approvedAt: 0
        });

        classStudentGrades[classId][studentAddress].push(gradeId);

        emit GradeRecorded(gradeId, classId, studentAddress, componentName, score, msg.sender);

        return gradeId;
    }

    /**
     * @notice Update a grade (only in DRAFT status)
     */
    function updateGrade(
        uint256 gradeId,
        uint256 newScore
    ) external onlyLecturer {
        require(gradeRecords[gradeId].gradeId != 0, "Grade not found");
        require(
            gradeRecords[gradeId].status == DataTypes.GradeStatus.DRAFT,
            "Can only update draft grades"
        );
        require(newScore <= gradeRecords[gradeId].maxScore, "Score exceeds max score");

        uint256 oldScore = gradeRecords[gradeId].score;
        gradeRecords[gradeId].score = newScore;

        emit GradeUpdated(gradeId, oldScore, newScore, msg.sender);
    }

    /**
     * @notice Approve a grade (Admin only)
     */
    function approveGrade(uint256 gradeId) external onlyAdmin {
        require(gradeRecords[gradeId].gradeId != 0, "Grade not found");
        require(
            gradeRecords[gradeId].status != DataTypes.GradeStatus.FINAL,
            "Grade already finalized"
        );

        gradeRecords[gradeId].status = DataTypes.GradeStatus.APPROVED;
        gradeRecords[gradeId].approvedBy = msg.sender;
        gradeRecords[gradeId].approvedAt = block.timestamp;

        emit GradeApproved(gradeId, msg.sender, block.timestamp);
    }

    /**
     * @notice Get grade record
     */
    function getGrade(uint256 gradeId) external view returns (DataTypes.GradeRecord memory) {
        require(gradeRecords[gradeId].gradeId != 0, "Grade not found");
        return gradeRecords[gradeId];
    }

    /**
     * @notice Get all grades for a student in a class
     */
    function getStudentGrades(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256[] memory) {
        return classStudentGrades[classId][studentAddress];
    }

    /**
     * @notice Calculate final grade for a student
     */
    function calculateFinalGrade(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256) {
        // TODO: Implement weighted average calculation
        // Based on component weights
        return 0;
    }
}
