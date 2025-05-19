import { useRaffleOwner } from '../hooks/useRaffleOwner';
import { useAccount } from 'wagmi';
import { useState } from 'react';

function formatEther(value: bigint | undefined) {
  if (!value) return '0';
  return Number(value) / 10 ** 18;
}

export function RaffleControls({ refetchAllData }: { refetchAllData: () => void }) {
  const { address } = useAccount();
  const {
    participants,
    owner,
    entryFee,
    maxParticipants,
    changeEntryFee,
    changeMaxParticipants,
    isChangingEntryFee,
    isChangingMaxParticipants,
  } = useRaffleOwner();

  const [newEntryFee, setNewEntryFee] = useState('');
  const [newMaxParticipants, setNewMaxParticipants] = useState('');

  const isOwner = address?.toLowerCase() === owner?.toLowerCase();

  const handleEntryFeeChange = async () => {
    if (newEntryFee) {
      try {
        const feeInWei = BigInt(parseFloat(newEntryFee) * 1e18);
        await changeEntryFee(feeInWei);
        setNewEntryFee('');
        refetchAllData();
      } catch (error) {
        console.error('Error changing entry fee:', error);
      }
    }
  };

  const handleMaxParticipantsChange = async () => {
    if (newMaxParticipants) {
      try {
        const maxParticipants = BigInt(newMaxParticipants);
        await changeMaxParticipants(maxParticipants);
        setNewMaxParticipants('');
        refetchAllData();
      } catch (error) {
        console.error('Error changing max participants:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Owner Controls */}
      {isOwner && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Owner Controls
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Change Entry Fee (ETH)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newEntryFee}
                  onChange={(e) => setNewEntryFee(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                  placeholder={`Current: ${formatEther(entryFee)} ETH`}
                  step="0.001"
                  min="0"
                />
                <button
                  onClick={handleEntryFeeChange}
                  disabled={isChangingEntryFee || !newEntryFee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isChangingEntryFee ? 'Changing...' : 'Change'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Change Max Participants
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newMaxParticipants}
                  onChange={(e) => setNewMaxParticipants(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                  placeholder={`Current: ${maxParticipants?.toString() || '0'}`}
                  min="1"
                />
                <button
                  onClick={handleMaxParticipantsChange}
                  disabled={isChangingMaxParticipants || !newMaxParticipants}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isChangingMaxParticipants ? 'Changing...' : 'Change'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 