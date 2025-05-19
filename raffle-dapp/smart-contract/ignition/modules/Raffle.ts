// raffle-dapp/smart-contract/ignition/modules/Raffle.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RaffleModule = buildModule("RaffleModule", (m) => {
  // Deploy the SimpleRaffle contract (no constructor arguments needed)
  const raffle = m.contract("SimpleRaffle");

  return { raffle };
});

export default RaffleModule;