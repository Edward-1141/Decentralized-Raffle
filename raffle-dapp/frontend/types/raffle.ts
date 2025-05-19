export type RaffleData = {
  participants: string[];
  recentWinner: string;
  prizePool: bigint;
  lastPrizePool: bigint;
  entryFee: bigint;
  maxParticipants: bigint;
};

export type RaffleErrors = {
  participantsError: Error | null;
  winnerError: Error | null;
  prizePoolError: Error | null;
  lastPrizePoolError: Error | null;
  entryFeeError: Error | null;
  maxParticipantsError: Error | null;
}; 