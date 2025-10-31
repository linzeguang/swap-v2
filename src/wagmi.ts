import { bsc, mainnet } from 'viem/chains'
import { createConfig, http, injected } from 'wagmi'

export const config = createConfig({
  chains: [mainnet, bsc],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http()
  }
})
