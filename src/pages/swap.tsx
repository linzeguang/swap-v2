import { Trans } from '@lingui/react/macro'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import React, { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

import { Card } from '@/components/ui/Box'
import { ButtonRadioGroup } from '@/components/ui/Button'

enum TRADE {
  Swap,
  TWAP,
  Limit
}

const Swap: React.FC = () => {
  const { address, isConnected } = useAppKitAccount()
  const network = useAppKitNetwork()
  const { chains, switchChain } = useSwitchChain()

  const account = useAccount()

  const [trade, setTrade] = useState(TRADE.Swap)

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

      <Card>
        <ButtonRadioGroup
          value={trade}
          options={[
            {
              label: <Trans>Swap</Trans>,
              value: TRADE.Swap
            },
            {
              label: <Trans>TWAP</Trans>,
              value: TRADE.TWAP
            },
            {
              label: <Trans>Limit</Trans>,
              value: TRADE.Limit
            }
          ]}
          onChangeValue={setTrade}
        />
      </Card>
    </div>
  )
}

export default Swap
