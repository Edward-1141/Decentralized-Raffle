import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useCallback, useEffect } from "react";
import raffleABI from "../abi/Raffle.json";
import type { RaffleData, RaffleErrors } from "../types/raffle";

const RAFFLE_ADDRESS = process.env.NEXT_PUBLIC_RAFFLE_CONTRACT_ADDRESS as `0x${string}`;

export function useRaffle() {
  const { data: participants, error: participantsError, refetch: refetchParticipants } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "getParticipants",
  });

  const { data: recentWinner, error: winnerError, refetch: refetchWinner } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "getRecentWinner",
  });

  const { data: prizePool, error: prizePoolError, refetch: refetchPrizePool } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "getPrizePool",
  });

  const { data: lastPrizePool, error: lastPrizePoolError, refetch: refetchLastPrizePool } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "lastPrizePool",
  });

  const { data: entryFee, error: entryFeeError, refetch: refetchEntryFee } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "entryFee",
  });

  const { data: maxParticipants, error: maxParticipantsError, refetch: refetchMaxParticipants } = useReadContract({
    address: RAFFLE_ADDRESS,
    abi: raffleABI,
    functionName: "maxParticipants",
  });

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Refresh all data after successful transaction
  useEffect(() => {
    if (isSuccess) {
      refetchParticipants();
      refetchWinner();
      refetchPrizePool();
      refetchMaxParticipants();
      refetchEntryFee();
      refetchLastPrizePool();
    }
  }, [isSuccess, refetchParticipants, refetchWinner, refetchPrizePool, refetchLastPrizePool, refetchMaxParticipants, refetchEntryFee]);

  const enterRaffle = useCallback(() => {
    if (!entryFee) {
      console.error('Entry fee not loaded yet');
      return;
    }
    const value = BigInt(entryFee as bigint);
    writeContract({
      address: RAFFLE_ADDRESS,
      abi: raffleABI,
      functionName: "enterRaffle",
      value,
    });
  }, [writeContract, entryFee]);

  const raffleData: RaffleData = {
    participants: participants as string[] || [],
    recentWinner: recentWinner?.toString() || "",
    prizePool: prizePool as bigint || BigInt(0),
    lastPrizePool: lastPrizePool as bigint || BigInt(0),
    entryFee: entryFee as bigint || BigInt(0),
    maxParticipants: maxParticipants as bigint || BigInt(0),
  };

  const errors: RaffleErrors = {
    participantsError,
    winnerError,
    prizePoolError,
    lastPrizePoolError,
    entryFeeError,
    maxParticipantsError,
  };

  const refetchAllData = () => {
    refetchParticipants();
    refetchWinner();
    refetchPrizePool();
    refetchMaxParticipants();
    refetchEntryFee();
  }

  return {
    raffleData,
    errors,
    enterRaffle,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    refetchAllData,
  };
} 