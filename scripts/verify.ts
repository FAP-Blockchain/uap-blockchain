import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🔍 Verifying deployed contracts...\n");

  // Load deployment addresses
  const fs = await import("fs");
  const deploymentData = JSON.parse(fs.readFileSync("deployments.json", "utf8"));

  console.log("Network:", deploymentData.network);
  console.log("Chain ID:", deploymentData.chainId);
  console.log("Deployer:", deploymentData.deployer);
  console.log("Deployed at:", deploymentData.timestamp, "\n");

  // Verify each contract
  const contracts = [
    "UniversityManagement",
    "CredentialManagement",
    "AttendanceManagement",
    "GradeManagement",
    "ClassManagement",
  ];

  for (const contractName of contracts) {
    const address = deploymentData.contracts[contractName];
    console.log(`Checking ${contractName} at ${address}...`);

    try {
      const code = await ethers.provider.getCode(address);
      if (code === "0x") {
        console.log(`❌ No contract code found at ${address}`);
      } else {
        console.log(`✅ Contract verified (${code.length} bytes)`);
      }
    } catch (error: any) {
      console.log(`❌ Error verifying contract:`, error.message);
    }
    console.log();
  }

  console.log("🎉 Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
