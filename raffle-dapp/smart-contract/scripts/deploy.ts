import hre from "hardhat";
import { parseEther } from "ethers";

async function main() {
  // Get owner address from command line arguments
  const ownerAddress = process.env.OWNER_ADDRESS;
  const entryFeeString = process.env.ENTRY_FEE;
  if (!entryFeeString || parseEther(entryFeeString) <= 0) {
    throw new Error("Please set ENTRY_FEE environment variable to a positive number");
  }
  const entryFee = parseEther(entryFeeString);
  const maxParticipants = process.env.MAX_PARTICIPANTS;
  if (!maxParticipants || parseInt(maxParticipants) <= 0) {
    throw new Error("Please set MAX_PARTICIPANTS environment variable to a positive number");
  }

  if (!ownerAddress) {
    throw new Error("Please set OWNER_ADDRESS environment variable");
  }

  console.log("Deploying contracts with owner address:", ownerAddress);

  const raffle = await hre.ethers.deployContract("SimpleRaffle", [ownerAddress, entryFee, maxParticipants]);
  await raffle.waitForDeployment();
  console.log("Raffle deployed to:", raffle.target);
  console.log("Owner set to:", ownerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});