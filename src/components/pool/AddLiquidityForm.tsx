import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency } from '@uniswap/sdk-core'
import React, { useState } from 'react'

import { BNB } from '@/features/token/testnet/bsc'

import { LiquidityAmountInput } from '../common/AmountInput'
import HalfMax from '../common/HalfMax'
import Settings from '../common/Settings'
import SubmitButton from '../common/SubmitButton'
import { Wallet } from '../svgr/icons'
import { Add, TopIcon } from '../svgr/pool'
import { Card, Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'
import Preview from './Preview'

const AddLiquidityForm: React.FC = () => {
  const { isConnected } = useAppKitAccount()
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
        <div className="space-y-2">
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={tokenA}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <span>balance</span>
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={setTokenA}
          />
          <Add className="text-icon mx-auto" />
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={tokenB}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <span>balance</span>
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={setTokenB}
          />
        </div>
        <Preview />
        <SubmitButton walletConnect={isConnected} insufficientBalance>
          <KanitText>
            <Trans>Add</Trans>
          </KanitText>
        </SubmitButton>
      </Card>
    </div>
  )
}

export default AddLiquidityForm
