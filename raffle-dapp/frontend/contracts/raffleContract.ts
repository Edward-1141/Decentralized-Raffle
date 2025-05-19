import { parseAbi } from 'viem';

// Contract ABI
export const raffleAbi = parseAbi([
  'function owner() view returns (address)',
  'function entryFee() view returns (uint256)',
  'function maxParticipants() view returns (uint256)',
  'function changeEntryFee(uint256 newEntryFee)',
  'function changeMaxParticipants(uint256 newMaxParticipants)',
  'function enterRaffle() payable',
  'function getParticipants() view returns (address[])',
  'function getRecentWinner() view returns (address)',
  'function getPrizePool() view returns (uint256)',
  'event RaffleEntered(address indexed participant, uint256 entryFee)',
  'event WinnerSelected(address indexed winner, uint256 prize, uint256 ownerShare)',
  'event EntryFeeChanged(uint256 oldEntryFee, uint256 newEntryFee)',
  'event MaxParticipantsChanged(uint256 oldMaxParticipants, uint256 newMaxParticipants)',
  'event EmergencyWithdraw(address indexed to, uint256 amount)',
]);

// Contract configuration
export const raffleContract = {
  address: process.env.NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS as `0x${string}`,
  abi: raffleAbi,
} as const;

// Event types
export type RaffleEnteredEvent = {
  args: {
    participant: `0x${string}`;
    entryFee: bigint;
  };
};

export type WinnerSelectedEvent = {
  args: {
    winner: `0x${string}`;
    prize: bigint;
    ownerShare: bigint;
  };
};

export type EntryFeeChangedEvent = {
  args: {
    oldEntryFee: bigint;
    newEntryFee: bigint;
  };
};

export type MaxParticipantsChangedEvent = {
  args: {
    oldMaxParticipants: bigint;
    newMaxParticipants: bigint;
  };
};

export type EmergencyWithdrawEvent = {
  args: {
    to: `0x${string}`;
    amount: bigint;
  };
}; 