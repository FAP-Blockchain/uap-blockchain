import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying UAP Blockchain contracts to Quorum...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy UniversityManagement first
  console.log("📚 Deploying UniversityManagement...");
  const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
  const universityManagement = await UniversityManagement.deploy();
  await universityManagement.waitForDeployment();
  const universityAddress = await universityManagement.getAddress();
  console.log("✅ UniversityManagement deployed to:", universityAddress, "\n");

  // Deploy CredentialManagement
  console.log("🎓 Deploying CredentialManagement...");
  const CredentialManagement = await ethers.getContractFactory("CredentialManagement");
  const credentialManagement = await CredentialManagement.deploy(universityAddress);
  await credentialManagement.waitForDeployment();
  const credentialAddress = await credentialManagement.getAddress();
  console.log("✅ CredentialManagement deployed to:", credentialAddress, "\n");

  // Deploy AttendanceManagement
  console.log("📅 Deploying AttendanceManagement...");
  const AttendanceManagement = await ethers.getContractFactory("AttendanceManagement");
  const attendanceManagement = await AttendanceManagement.deploy(universityAddress);
  await attendanceManagement.waitForDeployment();
  const attendanceAddress = await attendanceManagement.getAddress();
  console.log("✅ AttendanceManagement deployed to:", attendanceAddress, "\n");

  // Deploy GradeManagement
  console.log("📊 Deploying GradeManagement...");
  const GradeManagement = await ethers.getContractFactory("GradeManagement");
  const gradeManagement = await GradeManagement.deploy(universityAddress);
  await gradeManagement.waitForDeployment();
  const gradeAddress = await gradeManagement.getAddress();
  console.log("✅ GradeManagement deployed to:", gradeAddress, "\n");

  // Deploy ClassManagement
  console.log("🏫 Deploying ClassManagement...");
  const ClassManagement = await ethers.getContractFactory("ClassManagement");
  const classManagement = await ClassManagement.deploy(universityAddress);
  await classManagement.waitForDeployment();
  const classAddress = await classManagement.getAddress();
  console.log("✅ ClassManagement deployed to:", classAddress, "\n");

  // Initialize UniversityManagement with other contract addresses
  console.log("🔗 Initializing UniversityManagement with contract addresses...");
  const tx = await universityManagement.initialize(
    credentialAddress,
    attendanceAddress,
    gradeAddress,
    classAddress
  );
  await tx.wait();
  console.log("✅ UniversityManagement initialized\n");

  // Summary
  console.log("=" .repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=" .repeat(60));
  console.log("UniversityManagement:", universityAddress);
  console.log("CredentialManagement:", credentialAddress);
  console.log("AttendanceManagement:", attendanceAddress);
  console.log("GradeManagement:", gradeAddress);
  console.log("ClassManagement:", classAddress);
  console.log("=" .repeat(60));

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      UniversityManagement: universityAddress,
      CredentialManagement: credentialAddress,
      AttendanceManagement: attendanceAddress,
      GradeManagement: gradeAddress,
      ClassManagement: classAddress,
    },
  };

  console.log("\n📝 Deployment info saved to deployments.json");
  const fs = await import("fs");
  fs.writeFileSync(
    "deployments.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
