import { Trans } from '@lingui/react/macro'
import { Currency } from '@uniswap/sdk-core'
import React, { useState } from 'react'

import { BNB } from '@/features/token/testnet/bsc'

import Settings from '../common/Settings'
import TokenAmountInput from '../common/TokenAmountInput'
import { Wallet } from '../svgr/icons'
import { TopIcon } from '../svgr/pool'
import { Card, Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

const AddLiquidityForm: React.FC = () => {
  const [tokenA, setTokenA] = useState<Currency | undefined>(BNB)
  const [tokenB, setTokenB] = useState<Currency | undefined>()

  return (
    <div className="relative">
      <TopIcon className="absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-[100px]" />
      <Card className="relative z-[2] space-y-6">
        <Flex className="items-center justify-between">
          <KanitText className="text-1.5xl">
            <Trans>Add Liquidity</Trans>
          </KanitText>
          <Settings />
        </Flex>
        <TokenAmountInput
          token={tokenA}
          suffixNode={
            <Flex className="items-center justify-between">
              <Flex>
                <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                  <Wallet />
                  <span>balance</span>
                </KanitText>
              </Flex>
              <KanitText>usd balance</KanitText>
            </Flex>
          }
          onTokenSelect={setTokenA}
        />
        <TokenAmountInput token={tokenB} onTokenSelect={setTokenB} />
      </Card>
    </div>
  )
}

export default AddLiquidityForm
