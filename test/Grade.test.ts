import { expect } from "chai";
import hre from "hardhat";
import { GradeManagement, UniversityManagement } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("GradeManagement", function () {
  let gradeManagement: GradeManagement;
  let universityManagement: UniversityManagement;
  let owner: SignerWithAddress;
  let lecturer: SignerWithAddress;
  let student: SignerWithAddress;

  const CLASS_ID = 1;

  beforeEach(async function () {
    [owner, lecturer, student] = await ethers.getSigners();

    // Deploy UniversityManagement
    const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
    universityManagement = await UniversityManagement.deploy();
    await universityManagement.waitForDeployment();

    // Register lecturer with LECTURER role (role = 2)
    await universityManagement.registerUser(
      lecturer.address,
      "LEC001",
      "Test Lecturer",
      "lecturer@test.com",
      2 // LECTURER role
    );

    // Deploy GradeManagement
    const GradeManagement = await ethers.getContractFactory("GradeManagement");
    gradeManagement = await GradeManagement.deploy(
      await universityManagement.getAddress()
    );
    await gradeManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct UniversityManagement address", async function () {
      expect(await gradeManagement.universityManagement()).to.equal(
        await universityManagement.getAddress()
      );
    });

    it("Should initialize with zero grades", async function () {
      expect(await gradeManagement.gradeCount()).to.equal(0);
    });
  });

  describe("Record Grade", function () {
    it("Should record a grade for a student", async function () {
      await expect(
        gradeManagement.connect(lecturer).recordGrade(
          CLASS_ID,
          student.address,
          "Midterm",
          8550, // 85.50
          10000 // 100.00
        )
      )
        .to.emit(gradeManagement, "GradeRecorded")
        .withArgs(1, CLASS_ID, student.address, "Midterm", 8550, lecturer.address);

      const grade = await gradeManagement.getGrade(1);
      expect(grade.studentAddress).to.equal(student.address);
      expect(grade.score).to.equal(8550);
      expect(grade.status).to.equal(0); // DRAFT
    });

    it("Should reject score exceeding max score", async function () {
      await expect(
        gradeManagement.connect(lecturer).recordGrade(
          CLASS_ID,
          student.address,
          "Midterm",
          11000,
          10000
        )
      ).to.be.revertedWith("Score exceeds max score");
    });

    it("Should track multiple grade components", async function () {
      await gradeManagement.connect(lecturer).recordGrade(CLASS_ID, student.address, "Midterm", 8500, 10000);
      await gradeManagement.connect(lecturer).recordGrade(CLASS_ID, student.address, "Final", 9000, 10000);

      const grades = await gradeManagement.getStudentGrades(CLASS_ID, student.address);
      expect(grades.length).to.equal(2);
    });
  });

  describe("Update Grade", function () {
    let gradeId: number;

    beforeEach(async function () {
      await gradeManagement.connect(lecturer).recordGrade(
        CLASS_ID,
        student.address,
        "Midterm",
        8000,
        10000
      );
      gradeId = 1;
    });

    it("Should update draft grade", async function () {
      await expect(gradeManagement.connect(lecturer).updateGrade(gradeId, 8500))
        .to.emit(gradeManagement, "GradeUpdated")
        .withArgs(gradeId, 8000, 8500, lecturer.address);

      const grade = await gradeManagement.getGrade(gradeId);
      expect(grade.score).to.equal(8500);
    });

    it("Should reject updating non-existent grade", async function () {
      await expect(
        gradeManagement.connect(lecturer).updateGrade(999, 8500)
      ).to.be.revertedWith("Grade not found");
    });

    it("Should reject score exceeding max score", async function () {
      await expect(
        gradeManagement.connect(lecturer).updateGrade(gradeId, 11000)
      ).to.be.revertedWith("Score exceeds max score");
    });
  });

  describe("Approve Grade", function () {
    let gradeId: number;

    beforeEach(async function () {
      await gradeManagement.connect(lecturer).recordGrade(
        CLASS_ID,
        student.address,
        "Midterm",
        8500,
        10000
      );
      gradeId = 1;
    });

    it("Should approve a grade", async function () {
      await expect(gradeManagement.approveGrade(gradeId))
        .to.emit(gradeManagement, "GradeApproved");

      const grade = await gradeManagement.getGrade(gradeId);
      expect(grade.status).to.equal(2); // APPROVED
      expect(grade.approvedBy).to.equal(owner.address);
    });

    it("Should reject approving non-existent grade", async function () {
      await expect(
        gradeManagement.approveGrade(999)
      ).to.be.revertedWith("Grade not found");
    });
  });

  describe("Grade Statistics", function () {
    it("Should calculate final grade", async function () {
      await gradeManagement.connect(lecturer).recordGrade(CLASS_ID, student.address, "Midterm", 8000, 10000);
      await gradeManagement.connect(lecturer).recordGrade(CLASS_ID, student.address, "Final", 9000, 10000);

      // TODO: Implement actual calculation when the function is completed
      const finalGrade = await gradeManagement.calculateFinalGrade(CLASS_ID, student.address);
      expect(finalGrade).to.equal(0); // Currently returns 0 (not implemented)
    });
  });
});
