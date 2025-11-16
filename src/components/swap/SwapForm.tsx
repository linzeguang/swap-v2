import { Trans } from '@lingui/react/macro'
import { Currency, TradeType } from '@uniswap/sdk-core'
import React, { useCallback, useState } from 'react'

import { BNB } from '@/features/token/testnet/bsc'

import TokenAmountInput from '../common/TokenAmountInput'
import { Swap as SwapIcon } from '../svgr/icons'
import { Card } from '../ui/Box'
import { Dividing } from '../ui/Dividing'

TradeType

const SwapForm: React.FC = () => {
  const [fromToken, setFromToken] = useState<Currency | undefined>(BNB)
  const [toToken, setToToken] = useState<Currency | undefined>()

  const swapTokens = useCallback(() => {
    setToToken(fromToken)
    setFromToken(toToken)
  }, [fromToken, toToken])

  return (
    <Card>
      <TokenAmountInput title={<Trans>From</Trans>} token={fromToken} onTokenSelect={setFromToken} />
      <div className="relative -mb-4 py-10">
        <Dividing />
        <SwapIcon
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onClick={swapTokens}
        />
      </div>
      <TokenAmountInput title={<Trans>To</Trans>} token={toToken} onTokenSelect={setToToken} />
    </Card>
  )
}

export default SwapForm
