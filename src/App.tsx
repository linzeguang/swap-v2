import React from 'react'
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'

import { useEvm } from './hooks/useNetwork'

const App: React.FC = () => {
  useEvm()
  const { chains, switchChain } = useSwitchChain()

  const chainId = useChainId()
  const account = useAccount()
  const balance = useBalance({ address: account.address })

  return (
    <div className="overlay xs:text-sm">
      <p>account: {account.address}</p>
      <p>chainId: {chainId}</p>
      <p>balance: {balance.data?.formatted}</p>

      <div>
        {chains.map((chain) => (
          <button className="w-20" onClick={() => switchChain({ chainId: chain.id })}>
            {chain.id}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
