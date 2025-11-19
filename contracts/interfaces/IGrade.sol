// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/DataTypes.sol";

/**
 * @title IGrade
 * @notice Interface for Grade Management
 */
interface IGrade {
    // Events
    event GradeRecorded(
        uint256 indexed gradeId,
        uint256 indexed classId,
        address indexed studentAddress,
        string componentName,
        uint256 score,
        address gradedBy
    );
    
    event GradeUpdated(
        uint256 indexed gradeId,
        uint256 oldScore,
        uint256 newScore,
        address updatedBy
    );
    
    event GradeApproved(
        uint256 indexed gradeId,
        address indexed approvedBy,
        uint256 approvedAt
    );

    // Functions
    function recordGrade(
        uint256 classId,
        address studentAddress,
        string calldata componentName,
        uint256 score,
        uint256 maxScore
    ) external returns (uint256);

    function updateGrade(
        uint256 gradeId,
        uint256 newScore
    ) external;

    function approveGrade(uint256 gradeId) external;

    function getGrade(uint256 gradeId) external view returns (DataTypes.GradeRecord memory);

    function getStudentGrades(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256[] memory);

    function calculateFinalGrade(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256);
}
