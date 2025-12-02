import { Trans } from '@lingui/react/macro'
import { Currency, Percent } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'

import { PairInfo } from '@/features/v2/hooks/useFactory'
import { formatAddress } from '@/lib/format'

import KeyValue from '../common/KeyValue'
import { Copy, Tip } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

type Preview = {
  tokenA: Currency | undefined
  tokenB: Currency | undefined
  pairInfo?: PairInfo
}

const Preview: React.FC<Preview> = ({ tokenA, tokenB, pairInfo }) => {
  const [token0, token1] = useMemo(() => {
    if (!tokenA || !tokenB) return []
    return tokenA.wrapped.sortsBefore(tokenB.wrapped) ? [tokenA, tokenB] : [tokenB, tokenA]
  }, [tokenA, tokenB])

  const { totalSupply, pairAddress, balanceOfLPToken, price0, price1 } = useMemo(() => ({ ...pairInfo }), [pairInfo])
  const poolShare = useMemo(
    () =>
      balanceOfLPToken && totalSupply
        ? `${new Percent(balanceOfLPToken.toString(), totalSupply.toString()).toSignificant(4)}%`
        : 0n,
    [balanceOfLPToken, totalSupply]
  )

  return (
    <div className="space-y-2.5 rounded-2xl border border-border-thin p-4">
      <KeyValue
        keyNode={`1 ${token0?.symbol} = ${price0} ${token1?.symbol}`}
        valueNode={`1 ${token1?.symbol} = ${price1} ${token0?.symbol}`}
      />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>Your Pool Share</Trans>
            </KanitText>
          </Flex>
        }
        valueNode={poolShare}
      />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>LP Tokens Received</Trans>
            </KanitText>
          </Flex>
        }
        valueNode={`0 LP`}
      />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>LP address</Trans>
            </KanitText>
          </Flex>
        }
        valueNode={
          <KanitText className="flex items-center space-x-1 text-xs text-secondary">
            <span>{formatAddress(pairAddress)}</span>
            <Copy />
          </KanitText>
        }
      />
    </div>
  )
}

export default Preview
