import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🔧 Setting up initial roles for UAP Blockchain...\n");

  // Load deployment addresses
  const fs = await import("fs");
  const deploymentData = JSON.parse(fs.readFileSync("deployments.json", "utf8"));
  
  const universityAddress = deploymentData.contracts.UniversityManagement;
  console.log("UniversityManagement contract:", universityAddress, "\n");

  // Get contract instance
  const UniversityManagement = await ethers.getContractFactory("UniversityManagement");
  const university = UniversityManagement.attach(universityAddress);

  const [admin] = await ethers.getSigners();

  // Sample users to register
  // Role mapping: ADMIN=1, LECTURER=2, STUDENT=3
  const users = [
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      userId: "LEC001",
      fullName: "Tran Thi B",
      email: "lecturer@fpt.edu.vn",
      role: 2, // LECTURER
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      userId: "SE170107",
      fullName: "Nguyen Phi Hung",
      email: "hungse170107@fpt.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      userId: "SE170246",
      fullName: "Nguyen Trung Nam",
      email: "namese170246@fpt.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      userId: "SE170118",
      fullName: "Huynh Gia Bao",
      email: "baose170118@fpt.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      userId: "SE170117",
      fullName: "Nghiem Van Hoang",
      email: "hoangse170117@fpt.edu.vn",
      role: 3, // STUDENT
    },
  ];

  console.log("Registering users...\n");
  for (const user of users) {
    try {
      const tx = await university.registerUser(
        user.address,
        user.userId,
        user.fullName,
        user.email,
        user.role
      );
      await tx.wait();
      console.log(`✅ Registered: ${user.fullName} (${user.userId}) - Role: ${user.role}`);
    } catch (error: any) {
      console.log(`⚠️  User ${user.userId} might already exist:`, error.message);
    }
  }

  console.log("\n🎉 Role setup complete!");
  
  // Display statistics
  const totalUsers = await university.getTotalUsers();
  console.log("\n📊 Statistics:");
  console.log("Total Users:", totalUsers.toString());
  console.log("Admins:", (await university.getRoleCount(1)).toString());
  console.log("Lecturers:", (await university.getRoleCount(2)).toString());
  console.log("Students:", (await university.getRoleCount(3)).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
