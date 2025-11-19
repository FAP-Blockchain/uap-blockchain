import { expect } from "chai";
import hre from "hardhat";
import { CredentialManagement, UniversityManagement } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("CredentialManagement", function () {
  let credentialManagement: CredentialManagement;
  let universityManagement: UniversityManagement;
  let owner: SignerWithAddress;
  let student: SignerWithAddress;
  let issuer: SignerWithAddress;

  beforeEach(async function () {
    [owner, student, issuer] = await ethers.getSigners();

    // Deploy UniversityManagement
    const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
    universityManagement = await UniversityManagement.deploy();
    await universityManagement.waitForDeployment();

    // Deploy CredentialManagement
    const CredentialManagement = await ethers.getContractFactory("CredentialManagement");
    credentialManagement = await CredentialManagement.deploy(
      await universityManagement.getAddress()
    );
    await credentialManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct UniversityManagement address", async function () {
      expect(await credentialManagement.universityManagement()).to.equal(
        await universityManagement.getAddress()
      );
    });

    it("Should initialize with zero credentials", async function () {
      expect(await credentialManagement.credentialCount()).to.equal(0);
    });
  });

  describe("Credential Issuance", function () {
    it("Should issue a new credential", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year

      await expect(
        credentialManagement.issueCredential(
          student.address,
          "DEGREE",
          "ipfs://QmTest123",
          expiresAt
        )
      )
        .to.emit(credentialManagement, "CredentialIssued")
        .withArgs(1, student.address, "DEGREE", owner.address);

      const credential = await credentialManagement.getCredential(1);
      expect(credential.studentAddress).to.equal(student.address);
      expect(credential.credentialType).to.equal("DEGREE");
      expect(credential.status).to.equal(1); // ACTIVE
    });

    it("Should increment credential count", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await credentialManagement.issueCredential(
        student.address,
        "DEGREE",
        "ipfs://QmTest123",
        expiresAt
      );

      expect(await credentialManagement.credentialCount()).to.equal(1);
    });

    it("Should track student credentials", async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await credentialManagement.issueCredential(
        student.address,
        "DEGREE",
        "ipfs://QmTest1",
        expiresAt
      );
      await credentialManagement.issueCredential(
        student.address,
        "CERTIFICATE",
        "ipfs://QmTest2",
        expiresAt
      );

      const credentials = await credentialManagement.getStudentCredentials(student.address);
      expect(credentials.length).to.equal(2);
    });
  });

  describe("Credential Verification", function () {
    let credentialId: number;

    beforeEach(async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      const tx = await credentialManagement.issueCredential(
        student.address,
        "DEGREE",
        "ipfs://QmTest123",
        expiresAt
      );
      await tx.wait();
      credentialId = 1;
    });

    it("Should verify valid credential", async function () {
      expect(await credentialManagement.verifyCredential(credentialId)).to.be.true;
    });

    it("Should reject invalid credential ID", async function () {
      expect(await credentialManagement.verifyCredential(999)).to.be.false;
    });

    it("Should reject revoked credential", async function () {
      await credentialManagement.revokeCredential(credentialId);
      expect(await credentialManagement.verifyCredential(credentialId)).to.be.false;
    });
  });

  describe("Credential Revocation", function () {
    let credentialId: number;

    beforeEach(async function () {
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
      await credentialManagement.issueCredential(
        student.address,
        "DEGREE",
        "ipfs://QmTest123",
        expiresAt
      );
      credentialId = 1;
    });

    it("Should revoke a credential", async function () {
      await expect(credentialManagement.revokeCredential(credentialId))
        .to.emit(credentialManagement, "CredentialRevoked")
        .withArgs(credentialId, owner.address, await ethers.provider.getBlock("latest").then(b => b!.timestamp + 1));

      const credential = await credentialManagement.getCredential(credentialId);
      expect(credential.status).to.equal(2); // REVOKED
    });

    it("Should reject revoking non-existent credential", async function () {
      await expect(
        credentialManagement.revokeCredential(999)
      ).to.be.revertedWith("Credential not found");
    });
  });
});
