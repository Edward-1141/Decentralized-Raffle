// app/page.tsx
"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRaffle } from "../hooks/useRaffle";
import { RaffleInfo } from "../components/RaffleInfo";
import { UserBalance } from "../components/UserBalance";
import { Congratulations } from "../components/Congratulations";
import React, { useState } from "react";

function formatEther(value: bigint) {
  return Number(value) / 10 ** 18;
}

export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);
  const {
    raffleData,
    errors,
    enterRaffle,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  } = useRaffle();

  const isWinner = address && raffleData.recentWinner && 
    address.toLowerCase() === raffleData.recentWinner.toLowerCase();

  // Refresh balance after successful transaction
  React.useEffect(() => {
    if (isSuccess) {
      setBalanceRefreshTrigger(prev => prev + 1);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Decentralized Raffle</h1>
          <ConnectButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
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

          <div className="space-y-6">
            <UserBalance 
              address={address} 
              refreshTrigger={balanceRefreshTrigger}
            />
            {isWinner && <Congratulations prizeAmount={raffleData.lastPrizePool} />}
          </div>
        </div>
      </div>
    </div>
  );
}