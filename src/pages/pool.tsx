import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { useAtomValue } from 'jotai/react'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Address, erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

import TokenImage from '@/components/common/TokenImage'
import LiquidityForm from '@/components/pool/LiquidityForm'
import { Setting } from '@/components/svgr/icons'
import { Add } from '@/components/svgr/pool'
import { Card, Flex, Grid } from '@/components/ui/Box'
import { Button, ButtonRadioGroup } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table } from '@/components/ui/Table'
import { KanitText } from '@/components/ui/Text'
import { formatAddress } from '@/lib/format'
import { RoutePath } from '@/routes'
import { pairListAtom } from '@/stores/trade'

enum Tabs {
  AddLiquidity,
  MyLiquidity
}

const Pool: React.FC = () => {
  const navigate = useNavigate()
  const { address } = useAppKitAccount()
  const [tab, setTab] = useState(Tabs.AddLiquidity)
  const [currentPair, setCurrentPair] = useState<Pair>()

  const pairList = useAtomValue(pairListAtom)

  const handleCreatePool = () => {
    navigate(RoutePath.AddLiquidity)
  }

  const { data: lpTokenBalance } = useReadContract({
    abi: erc20Abi,
    address: currentPair?.liquidityToken.address as Address,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !!(address && currentPair)
    }
  })

  const lpTokenCurrency = useMemo(() => {
    if (!lpTokenBalance || !currentPair) return
    return CurrencyAmount.fromRawAmount(currentPair.liquidityToken, lpTokenBalance.toString())
  }, [currentPair, lpTokenBalance])

  return (
    <Grid className="grid-cols-[1fr,390px] items-start gap-6">
      <Card className="flex-1 space-y-6">
        <Flex className="items-center justify-between">
          <ButtonRadioGroup
            className="inline-flex rounded-full"
            value={tab}
            options={[
              {
                label: <Trans>Add Liquidity</Trans>,
                value: Tabs.AddLiquidity,
                variant: tab === Tabs.AddLiquidity ? 'gradient' : 'default',
                className: 'rounded-full flex-auto px-8'
              },
              {
                label: <Trans>My Liquidity</Trans>,
                value: Tabs.MyLiquidity,
                variant: tab === Tabs.MyLiquidity ? 'gradient' : 'default',
                className: 'rounded-full flex-auto px-8'
              }
            ]}
            onChangeValue={setTab}
          />
          <Button variant={'gradient'} className="space-x-2" onClick={handleCreatePool}>
            <Add className="size-4" />
            <span>
              <Trans>Create Pool</Trans>
            </span>
          </Button>
        </Flex>
        <Input border placeholder={t`Search name /address`} />
        <Table<Pair>
          wrapperClassName="!-mt-0"
          tdProps={{ className: 'py-4' }}
          columns={[
            {
              name: 'Price',
              field: 'liquidityToken',
              width: '300px',
              render: (_, pair) => (
                <Flex className="items-center">
                  <Flex>
                    <TokenImage token={pair.token0} className="size-8" />
                    <TokenImage token={pair.token1} className="size-8 -translate-x-1/4" />
                  </Flex>
                  <div>
                    <KanitText variant={'primary'} className="text-base font-semibold">
                      <span>{pair.token0.wrapped.symbol}</span>
                      <span> / </span>
                      <span>{pair.token1.wrapped.symbol}</span>
                    </KanitText>
                    <KanitText variant={'tertiary'} className="text-xs">
                      {formatAddress(pair.liquidityToken.address)}
                    </KanitText>
                  </div>
                </Flex>
              )
            },
            {
              name: 'Pair',
              field: 'token0',
              width: '300px',
              render: (_, pair) => (
                <div>
                  <KanitText variant={'tertiary'} className="text-xs">
                    {formatAddress(pair.token0.address)}
                  </KanitText>
                  <KanitText variant={'tertiary'} className="text-xs">
                    {formatAddress(pair.token1.address)}
                  </KanitText>
                </div>
              )
            },
            {
              name: '',
              width: 120,
              align: 'right',
              field: 'chainId',
              render: (_, pair) => (
                <Button variant={'primary'} size={'lg'} className="w-full" onClick={() => setCurrentPair(pair)}>
                  Add
                </Button>
              )
            }
          ]}
          dataSource={pairList}
          rowKey={({ liquidityToken }) => liquidityToken.address}
        />
      </Card>
      {currentPair ? (
        <div className="space-y-6">
          <Card>
            <KanitText variant={'tertiary'} className="border-b border-border pb-4 text-2xl">
              <Trans>Liquidity</Trans>
            </KanitText>
            <Flex className="items-center justify-between py-2.5">
              <div>
                <KanitText variant={'primary'} className="text-base font-semibold">
                  <span>{currentPair.token0.wrapped.symbol}</span>
                  <span> / </span>
                  <span>{currentPair.token1.wrapped.symbol}</span>
                </KanitText>
                <KanitText variant={'tertiary'} className="text-xs">
                  {formatAddress(currentPair.liquidityToken.address)}
                </KanitText>
              </div>
              <Setting />
            </Flex>
            <div className="border-t border-border py-2.5">
              <KanitText variant={'tertiary'} className="text-sm">
                <Trans>My Liquidity</Trans>
              </KanitText>
              <Flex className="items-center justify-between">
                <KanitText variant={'primary'} className="text-base font-semibold">
                  <span>{currentPair.token0.wrapped.symbol}</span>
                  <span>/</span>
                  <span>{currentPair.token1.wrapped.symbol}</span>
                </KanitText>
                <KanitText variant={'primary'} className="text-base font-semibold">
                  {lpTokenCurrency?.toSignificant() || '--'}
                </KanitText>
              </Flex>
            </div>
          </Card>
          <LiquidityForm pair={currentPair} />
        </div>
      ) : (
        <Card className="flex h-60 items-center justify-center">
          <KanitText variant={'tertiary'} className="text-xl">
            <Trans>广告位招租</Trans>
          </KanitText>
        </Card>
      )}
    </Grid>
  )
}

export default Pool
