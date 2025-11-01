import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import React from 'react'
import { useSwitchChain } from 'wagmi'

const App: React.FC = () => {
  const { address, isConnected } = useAppKitAccount()
  const network = useAppKitNetwork()
  const { chains, switchChain } = useSwitchChain()

  return (
    <div className="overlay xs:text-sm">
      <appkit-button />
      <p>network: {network.chainId}</p>
      <p>isConnected: {isConnected.toString()}</p>
      <p>address: {address}</p>

      <div>
        {chains.map((chain) => (
          <button key={chain.id} className="w-20" onClick={() => switchChain({ chainId: chain.id })}>
            {chain.id}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
