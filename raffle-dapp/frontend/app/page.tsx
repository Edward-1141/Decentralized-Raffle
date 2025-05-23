// app/page.tsx
"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRaffle } from "../hooks/useRaffle";
import { useRaffleOwner } from "../hooks/useRaffleOwner";
import { RaffleInfo } from "../components/RaffleInfo";
import { UserBalance } from "../components/UserBalance";
import { Congratulations } from "../components/Congratulations";
import { RaffleControls } from "../components/RaffleControls";
import { useState, useEffect } from "react";
import { ParticipantsList } from "../components/ParticipantsList";

function formatEther(value: bigint) {
  return Number(value) / 10 ** 18;
}

export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);
  const { isOwner } = useRaffleOwner();
  const {
    raffleData,
    errors,
    enterRaffle,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    refetchAllData,
  } = useRaffle();

  const isWinner = address && raffleData.recentWinner && 
    address.toLowerCase() === raffleData.recentWinner.toLowerCase();

  // Refresh balance after successful transaction
  useEffect(() => {
    if (isSuccess) {
      setBalanceRefreshTrigger(prev => prev + 1);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Decentralized Raffle</h1>
          <ConnectButton />
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-2">
          <div className="w-full space-y-6">
            <RaffleInfo
              raffleData={raffleData}
              isConnecting={isConnecting}
              isConnected={isConnected}
              address={address}
            />

            {isError && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg">
                Error: {error?.message}
              </div>
            )}

            <button
              onClick={enterRaffle}
              disabled={isPending || isConfirming || !isConnected || !raffleData.entryFee}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isPending ? "Entering Raffle..." : isConfirming ? "Confirming..." : `Enter Raffle (${formatEther(raffleData.entryFee)} ETH)`}
            </button>
          </div>

          <div className="w-full space-y-6">
            <UserBalance 
              address={address} 
              refreshTrigger={balanceRefreshTrigger}
            />
            {address && (
              <ParticipantsList
                participants={raffleData.participants}
                currentUserAddress={address}
              />
            )}
            {isWinner && <Congratulations prizeAmount={raffleData.lastPrizePool} />}
            {isOwner && <RaffleControls refetchAllData={refetchAllData} />}
          </div>
        </div>
      </div>
    </div>
  );
}