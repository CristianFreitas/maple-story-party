'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

const config = getDefaultConfig({
  appName: 'MapleStory Party Finder',
  projectId: 'YOUR_PROJECT_ID', // Você pode obter isso em https://cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </LanguageProvider>
  );
}

