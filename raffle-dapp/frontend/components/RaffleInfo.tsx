'use client'

import type { RaffleData } from "../types/raffle";

function formatEther(value: bigint) {
  return Number(value) / 10 ** 18;
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function calculateWinningChance(address: string | undefined, participants: string[]) {
  if (!address || participants.length === 0) return 0;
  const matches = participants.filter(addr => addr.toLowerCase() === address.toLowerCase()).length;
  return (matches / participants.length) * 100;
}

interface RaffleInfoProps {
  raffleData: RaffleData;
  isConnecting: boolean;
  isConnected: boolean;
  address: string | undefined;
}

export function RaffleInfo({ raffleData, isConnecting, isConnected, address }: RaffleInfoProps) {
  const winningChance = calculateWinningChance(address, raffleData.participants);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-gray-700 dark:text-gray-300" suppressHydrationWarning>
          {isConnecting ? (
            "Connecting..."
          ) : isConnected ? (
            formatAddress(address!)
          ) : (
            "Please connect your wallet"
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
          <div className="text-xl font-semibold">{raffleData.participants.length}/{raffleData.maxParticipants}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Prize Pool</div>
          <div className="text-xl font-semibold">{formatEther(raffleData.prizePool)} ETH</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Recent Winner</div>
          <div className="text-xl font-semibold font-mono">
            {/* {raffleData.recentWinner ? formatAddress(raffleData.recentWinner) : "None yet"} */}
            {raffleData.recentWinner ? 
                raffleData.recentWinner === address ? "You are the winner!" : formatAddress(raffleData.recentWinner) : "None yet"}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Your Winning Chance</div>
          <div className="text-xl font-semibold">{winningChance.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
} 