// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_INFURA_RPC_URL),
  },
});

// const localhostChain = {
//     id: 31337, // Hardhat default
//     name: 'Hardhat Localhost',
//     network: 'localhost',
//     nativeCurrency: { decimals: 18, name: 'ETH', symbol: 'ETH' },
//     rpcUrls: {
//       default: { http: ['http://localhost:8545'] },
//     },
// };
  
// const config = createConfig({
// chains: [localhostChain], // Use localhost instead of Sepolia
// transports: {
//     [localhostChain.id]: http(), // Connects to localhost
// },
// });




export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}