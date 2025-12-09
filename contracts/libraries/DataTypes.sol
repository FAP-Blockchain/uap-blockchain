// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DataTypes
 * @notice Shared data structures for UAP Blockchain system
 */
library DataTypes {
    // User roles in the system
    enum Role {
        NONE,           // 0: No role
        ADMIN,          // 1: System administrator (includes staff duties)
        TEACHER,        // 2: Teaching staff (was LECTURER)
        STUDENT         // 3: Student
    }

    // Credential status
    enum CredentialStatus {
        PENDING,        // 0: Awaiting approval
        ACTIVE,         // 1: Valid credential
        REVOKED,        // 2: Revoked credential
        EXPIRED         // 3: Expired credential
    }

    // Attendance status
    enum AttendanceStatus {
        PRESENT,        // 0: Student present
        ABSENT,         // 1: Student absent
        LATE,           // 2: Student late
        EXCUSED         // 3: Excused absence
    }

    // Grade status
    enum GradeStatus {
        DRAFT,          // 0: Draft grade
        SUBMITTED,      // 1: Submitted for review
        APPROVED,       // 2: Approved grade
        FINAL           // 3: Final grade
    }

    // User information
    struct User {
        address userAddress;
        string userId;          // Student ID or Employee ID
        string fullName;
        string email;
        Role role;
        bool isActive;
        uint256 createdAt;
    }

    // Credential information
    struct Credential {
        uint256 credentialId;
        address studentAddress;
        string credentialType;  // "DEGREE", "CERTIFICATE", "TRANSCRIPT"
        string credentialData;  // IPFS hash or encrypted data
        bytes32 verificationHash; // Hash used for off-chain/on-chain verification
        CredentialStatus status;
        address issuedBy;
        uint256 issuedAt;
        uint256 expiresAt;
    }

    // Class information
    struct Class {
        uint256 classId;
        string classCode;       // e.g., "SE170107"
        string className;
        address lecturerAddress;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        uint256 maxStudents;
        uint256 enrolledCount;
    }

    // Attendance record
    struct AttendanceRecord {
        uint256 recordId;
        uint256 classId;
        address studentAddress;
        uint256 sessionDate;
        AttendanceStatus status;
        string notes;
        address markedBy;
        uint256 markedAt;
    }

    // Grade record
    struct GradeRecord {
        uint256 gradeId;
        uint256 classId;
        address studentAddress;
        string componentName;   // "Midterm", "Final", "Assignment1", etc.
        uint256 score;          // Score * 100 (e.g., 85.50 = 8550)
        uint256 maxScore;       // Max score * 100
        GradeStatus status;
        address gradedBy;
        uint256 gradedAt;
        address approvedBy;
        uint256 approvedAt;
    }

    // Enrollment information
    struct Enrollment {
        uint256 enrollmentId;
        uint256 classId;
        address studentAddress;
        uint256 enrolledAt;
        bool isActive;
        uint256 droppedAt;
    }
}
