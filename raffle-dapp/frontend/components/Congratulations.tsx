import { motion } from "framer-motion";

interface CongratulationsProps {
  prizeAmount: bigint;
}

export function Congratulations({ prizeAmount }: CongratulationsProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">🎉 Congratulations! 🎉</h3>
          <p className="text-lg">
            You won the last raffle! Your prize of {Number(prizeAmount) / 10 ** 18} ETH has been sent to your wallet.
          </p>
        </div>
        <div className="text-4xl">🏆</div>
      </div>
    </motion.div>
  );
} 