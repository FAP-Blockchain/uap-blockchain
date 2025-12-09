import { expect } from "chai";
import hre from "hardhat";
import { AttendanceManagement, UniversityManagement } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("AttendanceManagement", function () {
  let attendanceManagement: AttendanceManagement;
  let universityManagement: UniversityManagement;
  let owner: SignerWithAddress;
  let teacher: SignerWithAddress;
  let student: SignerWithAddress;

  const CLASS_ID = 1;

  beforeEach(async function () {
    [owner, teacher, student] = await ethers.getSigners();

    // Deploy UniversityManagement
    const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
    universityManagement = await UniversityManagement.deploy();
    await universityManagement.waitForDeployment();

    // Register teacher with TEACHER role (role = 2)
    await universityManagement.registerUser(
      teacher.address,
      "TEA001",
      "Test Teacher",
      "teacher@test.com",
      2 // TEACHER role
    );

    // Deploy AttendanceManagement
    const AttendanceManagement = await ethers.getContractFactory("AttendanceManagement");
    attendanceManagement = await AttendanceManagement.deploy(
      await universityManagement.getAddress()
    );
    await attendanceManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct UniversityManagement address", async function () {
      expect(await attendanceManagement.universityManagement()).to.equal(
        await universityManagement.getAddress()
      );
    });

    it("Should initialize with zero records", async function () {
      expect(await attendanceManagement.recordCount()).to.equal(0);
    });
  });
  describe("Mark Attendance", function () {
    it("Should mark attendance for a student", async function () {
      const sessionDate = Math.floor(Date.now() / 1000);

      await expect(
        attendanceManagement.connect(teacher).markAttendance(
          CLASS_ID,
          student.address,
          sessionDate,
          0, // PRESENT
          "On time"
        )
      )
        .to.emit(attendanceManagement, "AttendanceMarked")
        .withArgs(1, CLASS_ID, student.address, 0, teacher.address);

      const record = await attendanceManagement.getAttendanceRecord(1);
      expect(record.studentAddress).to.equal(student.address);
      expect(record.status).to.equal(0); // PRESENT
    });

    it("Should track multiple attendance records", async function () {
      const sessionDate = Math.floor(Date.now() / 1000);

      await attendanceManagement.connect(teacher).markAttendance(
        CLASS_ID,
        student.address,
        sessionDate,
        0,
        "Present"
      );
      await attendanceManagement.connect(teacher).markAttendance(
        CLASS_ID,
        student.address,
        sessionDate + 86400,
        2, // LATE
        "Late 10 minutes"
      );

      const records = await attendanceManagement.getStudentAttendance(CLASS_ID, student.address);
      expect(records.length).to.equal(2);
    });
  });

  describe("Update Attendance", function () {
    let recordId: number;

    beforeEach(async function () {
      const sessionDate = Math.floor(Date.now() / 1000);
      await attendanceManagement.connect(teacher).markAttendance(
        CLASS_ID,
        student.address,
        sessionDate,
        1, // ABSENT
        "Not present"
      );
      recordId = 1;
    });

    it("Should update attendance status", async function () {
      await expect(
        attendanceManagement.connect(teacher).updateAttendance(
          recordId,
          3, // EXCUSED
          "Medical certificate provided"
        )
      )
        .to.emit(attendanceManagement, "AttendanceUpdated")
        .withArgs(recordId, 1, 3, teacher.address);

      const record = await attendanceManagement.getAttendanceRecord(recordId);
      expect(record.status).to.equal(3); // EXCUSED
    });

    it("Should reject updating non-existent record", async function () {
      await expect(
        attendanceManagement.connect(teacher).updateAttendance(999, 0, "Note")
      ).to.be.revertedWith("Record not found");
    });
  });

  describe("Class Attendance Statistics", function () {
    it("Should track class attendance count", async function () {
      const sessionDate = Math.floor(Date.now() / 1000);

      await attendanceManagement.connect(teacher).markAttendance(CLASS_ID, student.address, sessionDate, 0, "");
      await attendanceManagement.connect(teacher).markAttendance(CLASS_ID, owner.address, sessionDate, 0, "");

      expect(await attendanceManagement.classAttendanceCount(CLASS_ID)).to.equal(2);
    });
  });
});
