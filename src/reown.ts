import type { Metadata } from '@reown/appkit'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc, bscTestnet, mainnet } from 'viem/chains'
import { injected } from 'wagmi'

export const projectId = '9d5d0f3cb8a803da299bf0518de00fb2'

export const metadata: Metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, bsc, bscTestnet]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  connectors: [injected()],
  projectId
})
