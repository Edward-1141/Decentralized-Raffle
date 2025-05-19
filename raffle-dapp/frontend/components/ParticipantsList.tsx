import { useMemo } from 'react';

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

interface ParticipantsListProps {
  participants: string[];
  currentUserAddress: string;
}

export function ParticipantsList({ participants, currentUserAddress }: ParticipantsListProps) {
  // Merge duplicate addresses and calculate total chances
  const uniqueParticipants = useMemo(() => {
    const participantMap = new Map<string, number>();
    const totalParticipants = participants.length;
    
    participants.forEach((participant) => {
      const currentChance = participantMap.get(participant) || 0;
      participantMap.set(participant, currentChance + 1);
    });

    return Array.from(participantMap.entries()).map(([address, totalChance]) => ({
      address: address === currentUserAddress ? "You" : address,
      totalChance: (totalChance / totalParticipants) * 100
    }));
  }, [participants]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Participants ({uniqueParticipants.length})
      </h2>
      <div className="space-y-2">
        {uniqueParticipants.map(({ address, totalChance }) => (
          <div
            key={address}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {address === "You" ? "You" : shortenAddress(address)}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {totalChance.toFixed(2)}% chance
            </span>
          </div>
        ))}
        {uniqueParticipants.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No participants yet
          </p>
        )}
      </div>
    </div>
  );
} 