import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import { Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'

import { useCopy } from '@/hooks/useCopy'
import { formatAddress } from '@/lib/format'

import KeyValue from '../common/KeyValue'
import { Copy, Tip } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

type Preview = {
  tokenA?: Currency
  tokenB?: Currency
  totalSupply: bigint
  lpTokenBalance: bigint
  pair?: Pair
  liquidityMinted?: CurrencyAmount<Token>
  isCreated?: boolean
}

const Preview: React.FC<Preview> = ({
  tokenA,
  tokenB,
  pair,
  totalSupply,
  lpTokenBalance,
  isCreated,
  liquidityMinted
}) => {
  const { buttonRef } = useCopy(pair?.liquidityToken.address || '')

  const [token0, token1] = useMemo(() => {
    if (!tokenA || !tokenB) return []
    return tokenA.wrapped.sortsBefore(tokenB.wrapped) ? [tokenA, tokenB] : [tokenB, tokenA]
  }, [tokenA, tokenB])

  const [poolShare, incrementRate] = useMemo(() => {
    let currentPoolShare, incrementRate

    if (!totalSupply) currentPoolShare = new Percent(0)
    else {
      currentPoolShare = new Percent((lpTokenBalance || 0n).toString(), totalSupply.toString())
      if (liquidityMinted && pair) {
        const totalSupplyAmount = CurrencyAmount.fromRawAmount(pair.liquidityToken, totalSupply.toString())
        const lpTokenBalanceAmount = CurrencyAmount.fromRawAmount(
          pair.liquidityToken,
          (lpTokenBalance || 0n).toString()
        )
        const nextTotalSupplyAmount = totalSupplyAmount.add(liquidityMinted)
        const nextLpTokenBalanceAmount = lpTokenBalanceAmount.add(liquidityMinted)
        const nextPoolShare = new Percent(nextLpTokenBalanceAmount.quotient, nextTotalSupplyAmount.quotient)
        incrementRate = nextPoolShare.subtract(currentPoolShare)
      }
    }

    return [currentPoolShare.toSignificant(), incrementRate?.toSignificant(4)]

    // if (!totalSupply || !pair || !liquidityMinted) currentPoolShare = new Percent(0)
    // else {
    //   currentPoolShare = new Percent((lpTokenBalance || 0n).toString(), totalSupply.toString())
    //   if (mockPair && pair && mockPair.reserve0.greaterThan(0) && mockPair.reserve1.greaterThan(0)) {
    //     const currentTotalSupply = CurrencyAmount.fromRawAmount(pair.liquidityToken, totalSupply.toString())
    //     const currentLpTokenBalance = CurrencyAmount.fromRawAmount(
    //       pair.liquidityToken,
    //       (lpTokenBalance || 0n).toString()
    //     )

    //     incrementAmount = pair.getLiquidityMinted(
    //       currentTotalSupply,
    //       CurrencyAmount.fromRawAmount(mockPair.token0, mockPair.reserve0.quotient.toString()),
    //       CurrencyAmount.fromRawAmount(mockPair.token1, mockPair.reserve1.quotient.toString())
    //     )
    //     const nextTotalSupply = currentTotalSupply.add(incrementAmount)
    //     const nextLpTokenBalance = currentLpTokenBalance.add(incrementAmount)
    //     const nextPoolShare = new Percent(nextLpTokenBalance.quotient, nextTotalSupply.quotient)
    //     incrementRate = nextPoolShare.subtract(currentPoolShare)
    //   }
    // }

    // return [incrementAmount?.toSignificant(), currentPoolShare.toSignificant(4), incrementRate?.toSignificant(4)]
  }, [liquidityMinted, lpTokenBalance, pair, totalSupply])

  if (!pair) return null
  return (
    <div className="space-y-2.5 rounded-2xl border border-border-thin p-4">
      <KeyValue
        classname="lg:flex-row flex-col lg:items-center items-start space-x-0 lg:space-x-4"
        keyNode={`1 ${token0?.symbol} = ${pair.token0Price.toSignificant() || '--'} ${token1?.symbol}`}
        valueNode={`1 ${token1?.symbol} = ${pair.token1Price.toSignificant() || '--'} ${token0?.symbol}`}
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
        valueNode={
          <KanitText variant={'tertiary'} className="text-xs">
            <span>{poolShare}%</span>
            {incrementRate && (
              <>
                (<span className="text-success">+{incrementRate}%</span>)
              </>
            )}
          </KanitText>
        }
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
        valueNode={`${liquidityMinted?.toSignificant() || '0'} LP`}
      />
      {isCreated && (
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
            <KanitText className="gradient-text flex items-center space-x-1 text-xs">
              <span>{pair && formatAddress(pair?.liquidityToken.address)}</span>
              <button ref={buttonRef}>
                <Copy className="text-text-tertiary" />
              </button>
            </KanitText>
          }
        />
      )}
    </div>
  )
}

export default Preview
