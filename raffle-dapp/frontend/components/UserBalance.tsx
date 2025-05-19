import { useBalance } from "wagmi";
import { useEffect } from "react";

interface UserBalanceProps {
  address: string | undefined;
  refreshTrigger?: number;
}

export function UserBalance({ address, refreshTrigger }: UserBalanceProps) {
  const { data: balance, isLoading, refetch } = useBalance({
    address: address as `0x${string}`,
  });

  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  if (!address) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">Your Balance</div>
      <div className="text-xl font-semibold">
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          `${Number(balance?.formatted || 0).toFixed(4)} ${balance?.symbol}`
        )}
      </div>
    </div>
  );
} 