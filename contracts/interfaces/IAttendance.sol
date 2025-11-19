// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../libraries/DataTypes.sol";

/**
 * @title IAttendance
 * @notice Interface for Attendance Management
 */
interface IAttendance {
    // Events
    event AttendanceMarked(
        uint256 indexed recordId,
        uint256 indexed classId,
        address indexed studentAddress,
        DataTypes.AttendanceStatus status,
        address markedBy
    );
    
    event AttendanceUpdated(
        uint256 indexed recordId,
        DataTypes.AttendanceStatus oldStatus,
        DataTypes.AttendanceStatus newStatus,
        address updatedBy
    );

    // Functions
    function markAttendance(
        uint256 classId,
        address studentAddress,
        uint256 sessionDate,
        DataTypes.AttendanceStatus status,
        string calldata notes
    ) external returns (uint256);

    function updateAttendance(
        uint256 recordId,
        DataTypes.AttendanceStatus newStatus,
        string calldata notes
    ) external;

    function getAttendanceRecord(uint256 recordId) external view returns (DataTypes.AttendanceRecord memory);

    function getStudentAttendance(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256[] memory);

    function getClassAttendanceRate(uint256 classId) external view returns (uint256);
}
