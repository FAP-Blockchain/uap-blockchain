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

  // Users to register (aligned with your seeded DB users)
  // Role mapping on-chain: ADMIN=1, LECTURER=2, STUDENT=3
  const users = [
    // Admin (optional on-chain, you already have deployer as admin)
    {
      address: admin.address,
      userId: "ADMIN",
      fullName: "System Administrator",
      email: "admin@fap.edu.vn",
      role: 1, // ADMIN
    },

    // Teachers
    {
      address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // map to teacher2 WalletAddress in DB
      userId: "TEACHER1",
      fullName: "Nguyễn Văn Thầy",
      email: "teacher1@fap.edu.vn",
      role: 2, // LECTURER
    },
    {
      address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // backend main teacher for attendance
      userId: "TEACHER2",
      fullName: "Trần Thị Hồng",
      email: "teacher2@fap.edu.vn",
      role: 2, // LECTURER
    },
    {
      address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      userId: "TEACHER3",
      fullName: "Lê Văn Toán",
      email: "teacher3@fap.edu.vn",
      role: 2, // LECTURER
    },
    {
      address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      userId: "TEACHER4",
      fullName: "Phạm Thị Mai",
      email: "teacher4@fap.edu.vn",
      role: 2, // LECTURER
    },

    // Students - 6 ví hợp lệ từ list Hardhat node
    {
      address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9", // Account #6
      userId: "STUDENT1",
      fullName: "Nguyễn Văn An",
      email: "student1@fap.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", // Account #7
      userId: "STUDENT2",
      fullName: "Trần Thị Bình",
      email: "student2@fap.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", // Account #8
      userId: "STUDENT3",
      fullName: "Lê Văn Cường",
      email: "student3@fap.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a", // Account #12
      userId: "STUDENT4",
      fullName: "Phạm Thị Dung",
      email: "student4@fap.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec", // Account #13
      userId: "STUDENT5",
      fullName: "Hoàng Văn Em",
      email: "student5@fap.edu.vn",
      role: 3, // STUDENT
    },
    {
      address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097", // Account #14
      userId: "STUDENT6",
      fullName: "Vũ Thị Phương",
      email: "student6@fap.edu.vn",
      role: 3, // STUDENT
    },
  ];

  console.log("Registering users...\n");
  for (const user of users) {
    try {
      const checksummedAddress = ethers.getAddress(user.address);
      const tx = await university.registerUser(
        checksummedAddress,
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
