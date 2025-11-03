import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import React from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

const Swap: React.FC = () => {
  const { address, isConnected } = useAppKitAccount()
  const network = useAppKitNetwork()
  const { chains, switchChain } = useSwitchChain()

  const account = useAccount()
  return (
    <div>
      <div className="overlay xs:text-sm">
        <appkit-button />
        <p>network: {network.chainId}</p>
        <p>isConnected: {isConnected.toString()}</p>
        <p>address: {address}</p>
        <p>account: {account.address}</p>

        <div>
          {chains.map((chain) => (
            <button key={chain.id} className="w-20" onClick={() => switchChain({ chainId: chain.id })}>
              {chain.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swap
