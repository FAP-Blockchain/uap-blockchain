// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IAttendance.sol";
import "./libraries/DataTypes.sol";

interface IUniversityManagement {
    function requireRole(address userAddress, DataTypes.Role role) external view;
}

/**
 * @title AttendanceManagement
 * @notice Manages student attendance tracking
 */
contract AttendanceManagement is IAttendance {
    // State variables
    address public universityManagement;
    
    mapping(uint256 => DataTypes.AttendanceRecord) public attendanceRecords;
    mapping(uint256 => mapping(address => uint256[])) public classStudentAttendance;
    mapping(uint256 => uint256) public classAttendanceCount;
    
    uint256 public recordCount;
    
    // Modifiers
    modifier onlyLecturer() {
        IUniversityManagement(universityManagement).requireRole(msg.sender, DataTypes.Role.LECTURER);
        _;
    }

    constructor(address _universityManagement) {
        require(_universityManagement != address(0), "Invalid address");
        universityManagement = _universityManagement;
    }

    /**
     * @notice Mark attendance for a student
     */
    function markAttendance(
        uint256 classId,
        address studentAddress,
        uint256 sessionDate,
        DataTypes.AttendanceStatus status,
        string calldata notes
    ) external onlyLecturer returns (uint256) {
        require(studentAddress != address(0), "Invalid student address");
        require(classId > 0, "Invalid class ID");
        
        recordCount++;
        uint256 recordId = recordCount;

        attendanceRecords[recordId] = DataTypes.AttendanceRecord({
            recordId: recordId,
            classId: classId,
            studentAddress: studentAddress,
            sessionDate: sessionDate,
            status: status,
            notes: notes,
            markedBy: msg.sender,
            markedAt: block.timestamp
        });

        classStudentAttendance[classId][studentAddress].push(recordId);
        classAttendanceCount[classId]++;

        emit AttendanceMarked(recordId, classId, studentAddress, status, msg.sender);

        return recordId;
    }

    /**
     * @notice Update attendance record
     */
    function updateAttendance(
        uint256 recordId,
        DataTypes.AttendanceStatus newStatus,
        string calldata notes
    ) external onlyLecturer {
        require(attendanceRecords[recordId].recordId != 0, "Record not found");

        DataTypes.AttendanceStatus oldStatus = attendanceRecords[recordId].status;
        attendanceRecords[recordId].status = newStatus;
        attendanceRecords[recordId].notes = notes;

        emit AttendanceUpdated(recordId, oldStatus, newStatus, msg.sender);
    }

    /**
     * @notice Get attendance record
     */
    function getAttendanceRecord(uint256 recordId) external view returns (DataTypes.AttendanceRecord memory) {
        require(attendanceRecords[recordId].recordId != 0, "Record not found");
        return attendanceRecords[recordId];
    }

    /**
     * @notice Get student's attendance records for a class
     */
    function getStudentAttendance(
        uint256 classId,
        address studentAddress
    ) external view returns (uint256[] memory) {
        return classStudentAttendance[classId][studentAddress];
    }

    /**
     * @notice Calculate attendance rate for a class
     */
    function getClassAttendanceRate(uint256 classId) external view returns (uint256) {
        // TODO: Implement attendance rate calculation
        // Rate = (Present + Late) / Total Sessions * 100
        return 0;
    }
}
