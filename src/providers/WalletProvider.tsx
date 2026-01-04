import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'

import { metadata, networks, projectId, wagmiAdapter } from '../reown'

const queryClient = new QueryClient()

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    swaps: false,
    send: false,
    email: false,
    socials: false
  },
  allWallets: 'ONLY_MOBILE',
  enableAuthLogger: false,
  enableCoinbase: false,
  enableWalletGuide: false
})

const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default WalletProvider
