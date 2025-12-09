import hre from "hardhat";

const { ethers } = hre;

async function main() {
  // signer[0] = 1 trong 20 account mặc định của Hardhat, có rất nhiều ETH test
  const [rich] = await ethers.getSigners();

  // TODO: thay địa chỉ ví teacher MetaMask của bạn vào đây
  const teacherAddress = "0x911f34742407fddd7bc9e57d43e0d5f0869a298e";

  console.log("Rich account :", await rich.getAddress());
  console.log("Send to      :", teacherAddress);

  const balanceBefore = await ethers.provider.getBalance(teacherAddress);
  console.log("Teacher balance before:", ethers.formatEther(balanceBefore), "ETH");

  const tx = await rich.sendTransaction({
    to: teacherAddress,
    value: ethers.parseEther("500") // gửi 5 ETH test, tùy ý chỉnh
  });

  console.log("Tx hash:", tx.hash);
  await tx.wait();

  const balanceAfter = await ethers.provider.getBalance(teacherAddress);
  console.log("Teacher balance after :", ethers.formatEther(balanceAfter), "ETH");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});