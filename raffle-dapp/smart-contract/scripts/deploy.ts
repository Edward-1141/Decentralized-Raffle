import hre from "hardhat";

async function main() {
  // Get owner address from command line arguments
  const ownerAddress = process.env.OWNER_ADDRESS;
  if (!ownerAddress) {
    throw new Error("Please set OWNER_ADDRESS environment variable");
  }

  console.log("Deploying contracts with owner address:", ownerAddress);

  const raffle = await hre.ethers.deployContract("SimpleRaffle", [ownerAddress]);
  await raffle.waitForDeployment();
  console.log("Raffle deployed to:", raffle.target);
  console.log("Owner set to:", ownerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});