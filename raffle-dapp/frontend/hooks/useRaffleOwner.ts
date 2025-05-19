import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { raffleContract } from "../contracts/raffleContract";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export function useRaffleOwner() {
  const { address } = useAccount();
  const [participants, setParticipants] = useState<`0x${string}`[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState<`0x${string}` | undefined>();

  // Read owner address
  const { data: ownerAddress } = useReadContract({
    ...raffleContract,
    functionName: "owner",
  });

  // Read entry fee
  const { data: entryFee, refetch: refetchEntryFee } = useReadContract({
    ...raffleContract,
    functionName: "entryFee",
  });

  // Read max participants
  const { data: maxParticipants, refetch: refetchMaxParticipants } = useReadContract({
    ...raffleContract,
    functionName: "maxParticipants",
  });

  // Write functions for owner
  const { writeContract: changeEntryFee, isPending: isChangingEntryFee } = useWriteContract();

  const { writeContract: changeMaxParticipants, isPending: isChangingMaxParticipants } = useWriteContract();

  // Listen to RaffleEntered event
  useWatchContractEvent({
    ...raffleContract,
    eventName: "RaffleEntered",
    onLogs: (logs) => {
      const newParticipant = logs[0].args.participant as `0x${string}`;
      if (newParticipant) {
        setParticipants(prev => [...prev, newParticipant]);
      }
    },
  });

  // Listen to WinnerSelected event
  useWatchContractEvent({
    ...raffleContract,
    eventName: "WinnerSelected",
    onLogs: () => {
      setParticipants([]); // Clear participants list when winner is selected
    },
  });

  // Listen to EntryFeeChanged event
  useWatchContractEvent({
    ...raffleContract,
    eventName: "EntryFeeChanged",
    onLogs: () => {
      refetchEntryFee();
    },
  });

  // Listen to MaxParticipantsChanged event
  useWatchContractEvent({
    ...raffleContract,
    eventName: "MaxParticipantsChanged",
    onLogs: () => {
      refetchMaxParticipants();
    },
  });

  // Check if current user is owner
  useEffect(() => {
    if (ownerAddress) {
      setOwner(ownerAddress as `0x${string}`);
      setIsOwner(address?.toLowerCase() === ownerAddress.toLowerCase());
    }
  }, [ownerAddress, address]);

  const handleChangeEntryFee = async (newEntryFee: bigint) => {
    try {
      await changeEntryFee({
        ...raffleContract,
        functionName: "changeEntryFee",
        args: [newEntryFee],
      });
    } catch (error) {
      console.error("Error changing entry fee:", error);
    }
  };

  const handleChangeMaxParticipants = async (newMaxParticipants: bigint) => {
    try {
      await changeMaxParticipants({
        ...raffleContract,
        functionName: "changeMaxParticipants",
        args: [newMaxParticipants],
      });
    } catch (error) {
      console.error("Error changing max participants:", error);
    }
  };

  return {
    participants,
    isOwner,
    owner,
    entryFee,
    maxParticipants,
    changeEntryFee: handleChangeEntryFee,
    changeMaxParticipants: handleChangeMaxParticipants,
    isChangingEntryFee,
    isChangingMaxParticipants,
  };
} 