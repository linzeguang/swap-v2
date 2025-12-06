import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import { useAtomValue } from 'jotai/react'
import React, { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { useCopy } from '@/hooks/useCopy'
import { formatAddress } from '@/lib/format'
import { pairListAtom } from '@/stores/trade'

import KeyValue from '../common/KeyValue'
import TokenImage from '../common/TokenImage'
import { Copy } from '../svgr/icons'
import { Card, Flex } from '../ui/Box'
import { Button } from '../ui/Button'
import { KanitText, SubPageTitle } from '../ui/Text'

const PairCard: React.FC<{ pair: Pair }> = ({ pair }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { buttonRef } = useCopy(pair.liquidityToken.address || '')
  const { buttonRef: buttonRefToken0 } = useCopy(pair.token0.address || '')
  const { buttonRef: buttonRefToken1 } = useCopy(pair.token1.address || '')

  const handleAddLiquidity = useCallback(() => {
    searchParams.set('tokenA', pair.token0.address)
    searchParams.set('tokenB', pair.token1.address)
    setSearchParams(searchParams)
    document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pair.token0.address, pair.token1.address, searchParams, setSearchParams])

  return (
    <Card className="space-y-2">
      <Flex className="items-center justify-between">
        <Flex className="items-center">
          <Flex>
            <TokenImage token={pair.token0} />
            <TokenImage token={pair.token1} className="-translate-x-1/3" />
          </Flex>
          <KanitText variant={'primary'}>
            <span>{pair.token0.wrapped.symbol}</span>
            <span>/</span>
            <span>{pair.token1.wrapped.symbol}</span>
          </KanitText>
          <Button size={'xs'} variant={'gradient'} className="ml-2">
            0.3%
          </Button>
        </Flex>
        <Button variant={'gradient'} size={'md'} className="text-sm" onClick={handleAddLiquidity}>
          <Trans>Add Liquidity</Trans>
        </Button>
      </Flex>
      <KanitText variant={'tertiary'} className="flex justify-between text-sm">
        <span>
          1 {pair.token0.symbol} = {pair.token0Price.toSignificant()} {pair.token1.symbol}
        </span>
        <span>
          1 {pair.token1.symbol} = {pair.token1Price.toSignificant()} {pair.token0.symbol}
        </span>
      </KanitText>
      <KeyValue
        keyNode={
          <KanitText variant={'tertiary'} className="text-xs">
            <Trans>LP address</Trans>
          </KanitText>
        }
        valueNode={
          <KanitText className="gradient-text flex items-center space-x-1 text-xs">
            <span>{formatAddress(pair.liquidityToken.address)}</span>
            <button ref={buttonRef}>
              <Copy className="text-text-tertiary" />
            </button>
          </KanitText>
        }
      />
      <KeyValue
        keyNode={
          <KanitText variant={'tertiary'} className="text-xs">
            <Trans>{pair.token0.symbol}</Trans>
          </KanitText>
        }
        valueNode={
          <KanitText className="gradient-text flex items-center space-x-1 text-xs">
            <span>{formatAddress(pair.token0.address)}</span>
            <button ref={buttonRefToken0}>
              <Copy className="text-text-tertiary" />
            </button>
          </KanitText>
        }
      />
      <KeyValue
        keyNode={
          <KanitText variant={'tertiary'} className="text-xs">
            <Trans>{pair.token1.symbol}</Trans>
          </KanitText>
        }
        valueNode={
          <KanitText className="gradient-text flex items-center space-x-1 text-xs">
            <span>{formatAddress(pair.token1.address)}</span>
            <button ref={buttonRefToken1}>
              <Copy className="text-text-tertiary" />
            </button>
          </KanitText>
        }
      />
    </Card>
  )
}

const PoolList: React.FC = () => {
  const pairList = useAtomValue(pairListAtom)
  return (
    <div className="space-y-3 lg:space-y-7">
      <SubPageTitle>
        <Trans>Hot Pool</Trans>
      </SubPageTitle>
      <div className="space-y-3">
        {pairList.map((pair) => (
          <PairCard key={pair.liquidityToken.address} pair={pair} />
        ))}
      </div>
    </div>
  )
}

export default PoolList
