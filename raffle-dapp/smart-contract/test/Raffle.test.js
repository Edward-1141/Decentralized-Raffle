const { expect } = require("chai");
const { ethers } = require("hardhat");

const ENTRY_FEE = ethers.parseEther("0.0001");
const INCORRECT_FEE = ethers.parseEther("0.02");
const MAX_PARTICIPANTS = 10n;
const WINNER_SHARE = ENTRY_FEE * 90n / 100n; // 90% of entry fee

describe("SimpleRaffle", function () {
  let raffle;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    // Deploy contract
    const SimpleRaffle = await ethers.getContractFactory("SimpleRaffle");
    raffle = await SimpleRaffle.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await raffle.owner()).to.equal(owner.address);
    });

    it("Should have correct entry fee", async function () {
      expect(await raffle.ENTRY_FEE()).to.equal(ENTRY_FEE);
    });

    it("Should have correct max participants", async function () {
      expect(await raffle.MAX_PARTICIPANTS()).to.equal(MAX_PARTICIPANTS);
    });
  });

  describe("Entering Raffle", function () {
    it("Should allow entry with correct fee", async function () {
      await raffle.connect(addr1).enterRaffle({ value: ENTRY_FEE });

      const participants = await raffle.getParticipants();
      expect(participants).to.include(addr1.address);
    });

    it("Should reject entry with incorrect fee", async function () {
      await expect(raffle.connect(addr1).enterRaffle({ value: INCORRECT_FEE }))
        .to.be.revertedWith("Incorrect ETH amount");
    });
  });

  describe("Winner Selection", function () {
    it("Should select winner when max participants reached", async function () {
      // Fill up the raffle
      for (let i = 0; i < MAX_PARTICIPANTS; i++) {
        await raffle.connect(addrs[i]).enterRaffle({ value: ENTRY_FEE });
      }

      // Check if winner was selected
      const winner = await raffle.getRecentWinner();
      expect(winner).to.not.equal(ethers.ZeroAddress);

      // Check if participants array was reset
      const participants = await raffle.getParticipants();
      expect(participants.length).to.equal(0);
    });

    it("Should distribute prize correctly", async function () {
      // Fill up the raffle
      for (let i = 0; i < MAX_PARTICIPANTS; i++) {
        await raffle.connect(addrs[i]).enterRaffle({ value: ENTRY_FEE });
      }

      const winner = await raffle.getRecentWinner();
      const lastPrizePool = await raffle.lastPrizePool();

      // Check if winner received 90% of the pool
      expect(lastPrizePool).to.equal(WINNER_SHARE * MAX_PARTICIPANTS);
    });
  });

  describe("View Functions", function () {
    it("Should return correct prize pool", async function () {
      // Enter raffle
      await raffle.connect(addr1).enterRaffle({ value: ENTRY_FEE });
      
      const prizePool = await raffle.getPrizePool();
      expect(prizePool).to.equal(WINNER_SHARE);
    });

    it("Should return correct participants", async function () {
      await raffle.connect(addr1).enterRaffle({ value: ENTRY_FEE });
      await raffle.connect(addr2).enterRaffle({ value: ENTRY_FEE });

      const participants = await raffle.getParticipants();
      expect(participants).to.include(addr1.address);
      expect(participants).to.include(addr2.address);
      expect(participants.length).to.equal(2);
    });
  });
}); 