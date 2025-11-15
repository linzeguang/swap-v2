import type { Metadata } from '@reown/appkit'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { Address } from 'viem'
import { bscTestnet } from 'viem/chains'
import { injected } from 'wagmi'
import { waitForTransactionReceipt as _waitForTransactionReceipt } from 'wagmi/actions'

export const projectId = '9d5d0f3cb8a803da299bf0518de00fb2'

export const metadata: Metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bscTestnet]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  connectors: [injected()]
})

export const waitForTransactionReceipt = (hash: Address) =>
  _waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash })
