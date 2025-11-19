import { expect } from "chai";
import hre from "hardhat";
import { UniversityManagement } from "../typechain-types";

const { ethers } = hre;
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UniversityManagement", function () {
  let universityManagement: UniversityManagement;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, user1, user2] = await ethers.getSigners();

    const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
    universityManagement = await UniversityManagement.deploy();
    await universityManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await universityManagement.owner()).to.equal(owner.address);
    });

    it("Should register owner as admin", async function () {
      const role = await universityManagement.getUserRole(owner.address);
      expect(role).to.equal(1); // ADMIN role
    });

    it("Should create owner user profile", async function () {
      const user = await universityManagement.getUser(owner.address);
      expect(user.userAddress).to.equal(owner.address);
      expect(user.userId).to.equal("ADMIN001");
      expect(user.isActive).to.be.true;
    });
  });

  describe("User Registration", function () {
    it("Should register a new user", async function () {
      await expect(
        universityManagement.registerUser(
          user1.address,
          "STU001",
          "John Doe",
          "john@example.com",
          3 // STUDENT role
        )
      )
        .to.emit(universityManagement, "UserRegistered")
        .withArgs(user1.address, "STU001", 3);

      const user = await universityManagement.getUser(user1.address);
      expect(user.fullName).to.equal("John Doe");
      expect(user.email).to.equal("john@example.com");
    });

    it("Should prevent duplicate user registration", async function () {
      await universityManagement.registerUser(
        user1.address,
        "STU001",
        "John Doe",
        "john@example.com",
        3
      );

      await expect(
        universityManagement.registerUser(
          user1.address,
          "STU002",
          "Jane Doe",
          "jane@example.com",
          3
        )
      ).to.be.revertedWith("User already registered");
    });

    it("Should prevent duplicate user ID", async function () {
      await universityManagement.registerUser(
        user1.address,
        "STU001",
        "John Doe",
        "john@example.com",
        3
      );

      await expect(
        universityManagement.registerUser(
          user2.address,
          "STU001",
          "Jane Doe",
          "jane@example.com",
          3
        )
      ).to.be.revertedWith("User ID already taken");
    });

    it("Should reject registration from non-admin", async function () {
      await expect(
        universityManagement.connect(user1).registerUser(
          user2.address,
          "STU001",
          "John Doe",
          "john@example.com",
          3
        )
      ).to.be.revertedWith("Roles: caller is not admin");
    });
  });

  describe("User Management", function () {
    beforeEach(async function () {
      await universityManagement.registerUser(
        user1.address,
        "STU001",
        "John Doe",
        "john@example.com",
        3
      );
    });

    it("Should update user information", async function () {
      await universityManagement.updateUser(
        user1.address,
        "John Smith",
        "johnsmith@example.com"
      );

      const user = await universityManagement.getUser(user1.address);
      expect(user.fullName).to.equal("John Smith");
      expect(user.email).to.equal("johnsmith@example.com");
    });

    it("Should deactivate user", async function () {
      await expect(universityManagement.deactivateUser(user1.address))
        .to.emit(universityManagement, "UserDeactivated")
        .withArgs(user1.address);

      const user = await universityManagement.getUser(user1.address);
      expect(user.isActive).to.be.false;
    });

    it("Should prevent deactivating owner", async function () {
      await expect(
        universityManagement.deactivateUser(owner.address)
      ).to.be.revertedWith("Cannot deactivate owner");
    });
  });

  describe("Role Management", function () {
    it("Should correctly identify roles", async function () {
      await universityManagement.registerUser(
        user1.address,
        "LEC001",
        "Lecturer",
        "lec@example.com",
        2 // LECTURER
      );

      expect(await universityManagement.hasRole(user1.address, 2)).to.be.true;
      expect(await universityManagement.hasRole(user1.address, 3)).to.be.false;
    });

    it("Should count roles correctly", async function () {
      await universityManagement.registerUser(user1.address, "STU001", "Student 1", "s1@example.com", 3);
      await universityManagement.registerUser(user2.address, "STU002", "Student 2", "s2@example.com", 3);

      const studentCount = await universityManagement.getRoleCount(3);
      expect(studentCount).to.equal(2);
    });
  });

  describe("Contract Initialization", function () {
    it("Should initialize with contract addresses", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;

      await universityManagement.initialize(
        mockAddress,
        mockAddress,
        mockAddress,
        mockAddress
      );

      expect(await universityManagement.initialized()).to.be.true;
      expect(await universityManagement.credentialContract()).to.equal(mockAddress);
    });

    it("Should prevent double initialization", async function () {
      const mockAddress = ethers.Wallet.createRandom().address;

      await universityManagement.initialize(
        mockAddress,
        mockAddress,
        mockAddress,
        mockAddress
      );

      await expect(
        universityManagement.initialize(
          mockAddress,
          mockAddress,
          mockAddress,
          mockAddress
        )
      ).to.be.revertedWith("Already initialized");
    });
  });
});
