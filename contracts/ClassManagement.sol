// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./libraries/DataTypes.sol";

/**
 * @title ClassManagement
 * @notice Manages class creation and student enrollment
 */
contract ClassManagement {
    // State variables
    address public universityManagement;
    
    mapping(uint256 => DataTypes.Class) public classes;
    mapping(uint256 => DataTypes.Enrollment[]) public classEnrollments;
    mapping(uint256 => mapping(address => bool)) public isEnrolled;
    
    uint256 public classCount;
    uint256 public enrollmentCount;
    
    // Events
    event ClassCreated(
        uint256 indexed classId,
        string classCode,
        address indexed lecturerAddress
    );
    
    event StudentEnrolled(
        uint256 indexed enrollmentId,
        uint256 indexed classId,
        address indexed studentAddress
    );
    
    event StudentDropped(
        uint256 indexed enrollmentId,
        uint256 indexed classId,
        address indexed studentAddress
    );

    // Modifiers
    modifier onlyUniversity() {
        // TODO: Check role through UniversityManagement contract
        _;
    }
    
    modifier onlyLecturer(uint256 classId) {
        require(
            classes[classId].lecturerAddress == msg.sender,
            "Only class lecturer can perform this action"
        );
        _;
    }

    constructor(address _universityManagement) {
        require(_universityManagement != address(0), "Invalid address");
        universityManagement = _universityManagement;
    }

    /**
     * @notice Create a new class
     */
    function createClass(
        string calldata classCode,
        string calldata className,
        address lecturerAddress,
        uint256 startDate,
        uint256 endDate,
        uint256 maxStudents
    ) external onlyUniversity returns (uint256) {
        require(bytes(classCode).length > 0, "Class code required");
        require(lecturerAddress != address(0), "Invalid lecturer address");
        require(maxStudents > 0, "Max students must be greater than 0");
        require(endDate > startDate, "End date must be after start date");
        
        classCount++;
        uint256 classId = classCount;

        classes[classId] = DataTypes.Class({
            classId: classId,
            classCode: classCode,
            className: className,
            lecturerAddress: lecturerAddress,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            maxStudents: maxStudents,
            enrolledCount: 0
        });

        emit ClassCreated(classId, classCode, lecturerAddress);

        return classId;
    }

    /**
     * @notice Enroll a student in a class
     */
    function enrollStudent(
        uint256 classId,
        address studentAddress
    ) external onlyUniversity returns (uint256) {
        require(classes[classId].classId != 0, "Class not found");
        require(classes[classId].isActive, "Class is not active");
        require(studentAddress != address(0), "Invalid student address");
        require(!isEnrolled[classId][studentAddress], "Student already enrolled");
        require(
            classes[classId].enrolledCount < classes[classId].maxStudents,
            "Class is full"
        );
        
        enrollmentCount++;
        uint256 enrollmentId = enrollmentCount;

        DataTypes.Enrollment memory enrollment = DataTypes.Enrollment({
            enrollmentId: enrollmentId,
            classId: classId,
            studentAddress: studentAddress,
            enrolledAt: block.timestamp,
            isActive: true,
            droppedAt: 0
        });

        classEnrollments[classId].push(enrollment);
        isEnrolled[classId][studentAddress] = true;
        classes[classId].enrolledCount++;

        emit StudentEnrolled(enrollmentId, classId, studentAddress);

        return enrollmentId;
    }

    /**
     * @notice Drop a student from a class
     */
    function dropStudent(
        uint256 classId,
        address studentAddress
    ) external onlyUniversity {
        require(classes[classId].classId != 0, "Class not found");
        require(isEnrolled[classId][studentAddress], "Student not enrolled");

        // Find and deactivate enrollment
        DataTypes.Enrollment[] storage enrollments = classEnrollments[classId];
        for (uint256 i = 0; i < enrollments.length; i++) {
            if (enrollments[i].studentAddress == studentAddress && enrollments[i].isActive) {
                enrollments[i].isActive = false;
                enrollments[i].droppedAt = block.timestamp;
                
                isEnrolled[classId][studentAddress] = false;
                classes[classId].enrolledCount--;
                
                emit StudentDropped(enrollments[i].enrollmentId, classId, studentAddress);
                break;
            }
        }
    }

    /**
     * @notice Get class details
     */
    function getClass(uint256 classId) external view returns (DataTypes.Class memory) {
        require(classes[classId].classId != 0, "Class not found");
        return classes[classId];
    }

    /**
     * @notice Get class enrollments
     */
    function getClassEnrollments(uint256 classId) external view returns (DataTypes.Enrollment[] memory) {
        return classEnrollments[classId];
    }

    /**
     * @notice Check if student is enrolled in class
     */
    function checkEnrollment(
        uint256 classId,
        address studentAddress
    ) external view returns (bool) {
        return isEnrolled[classId][studentAddress];
    }
}
