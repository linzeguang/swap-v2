import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import React, { ComponentRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useApprove } from '@/features/hooks/useApprove'
import { jsbiToBigInt } from '@/features/utils'
import { useAddLiquidity, useRemoveLiquidity } from '@/features/v2/hooks/useLiquidity'
import { TokenType, useLiquidityForm } from '@/features/v2/hooks/useLiquidityForm'
import { formatAddress } from '@/lib/format'

import { LiquidityAmountInputFixed, LiquidityPrecentInput } from '../common/AmountInput'
import Settings from '../common/Settings'
import SubmitButton from '../common/SubmitButton'
import TokenBalance from '../common/TokenBalance'
import TokenImage from '../common/TokenImage'
import { Add2 } from '../svgr/pool'
import { Card, Flex, Grid } from '../ui/Box'
import { Button, ButtonRadioGroup } from '../ui/Button'
import { KanitText } from '../ui/Text'
import { AddLiquidityPreview, RemoveLiquidityPreview } from './Preview'

enum LiquidityAction {
  Add,
  Remove
}

const LiquidityForm: React.FC<{ pair: Pair }> = ({ pair }) => {
  const quickInput = [
    { lable: '25%', value: 0.25 },
    { lable: '50%', value: 0.5 },
    { lable: '75%', value: 0.75 },
    { lable: '100%', value: 1 }
  ]
  const { isConnected } = useAppKitAccount()

  const [action, setAction] = useState(LiquidityAction.Add)
  const [loading, setLoading] = useState(false)

  const [currencyBalanceA, setCurrencyBalanceA] = useState<CurrencyAmount<Currency>>()
  const [currencyBalanceB, setCurrencyBalanceB] = useState<CurrencyAmount<Currency>>()
  const balanceARef = useRef<ComponentRef<typeof TokenBalance>>(null)
  const balanceBRef = useRef<ComponentRef<typeof TokenBalance>>(null)

  const {
    removeAmount,
    amountA,
    amountB,
    currencyAmountA,
    currencyAmountB,
    totalSupply,
    liquidityMinted,
    lpTokenBalance,
    reserve0,
    reserve1,
    refreshPair,
    setRemoveAmount,
    handleChangeToken,
    handleChangeAmount
  } = useLiquidityForm()

  const { addLiquidity, spender: addLiquiditySpender } = useAddLiquidity()
  const { removeLiquidity, spender: removeLiquiditySpender } = useRemoveLiquidity(pair, totalSupply)

  const lpTokenCurrency = useMemo(() => {
    if (!lpTokenBalance) return
    return CurrencyAmount.fromRawAmount(pair.liquidityToken, lpTokenBalance.toString())
  }, [pair, lpTokenBalance])

  const [removeCurrencyAmount0, removeCurrencyAmount1, removeLiquidityCurrencyAmount] = useMemo(() => {
    if (pair && reserve0 && reserve1 && lpTokenCurrency && totalSupply) {
      const totalLpTokenCurrencyAmount = CurrencyAmount.fromRawAmount(pair.liquidityToken, totalSupply.toString())
      const share = lpTokenCurrency.divide(totalLpTokenCurrencyAmount)

      const totalCurrencyAmount0 = CurrencyAmount.fromRawAmount(pair.token0, reserve0.toString())
      const totalCurrencyAmount1 = CurrencyAmount.fromRawAmount(pair.token1, reserve1.toString())

      const currencyAmount0ByShare = share.multiply(totalCurrencyAmount0)
      const currencyAmount1ByShare = share.multiply(totalCurrencyAmount1)

      const removeLiquidityCurrencyAmount = lpTokenCurrency.multiply(new Percent(Number(removeAmount) * 100, 10000))
      const removeCurrencyAmount0 = currencyAmount0ByShare.multiply(new Percent(Number(removeAmount) * 100, 10000))
      const removeCurrencyAmount1 = currencyAmount1ByShare.multiply(new Percent(Number(removeAmount) * 100, 10000))

      return [removeCurrencyAmount0, removeCurrencyAmount1, removeLiquidityCurrencyAmount]
    }
    return []
  }, [lpTokenCurrency, pair, removeAmount, reserve0, reserve1, totalSupply])

  const { approve: approveCurrencyAmountA } = useApprove(addLiquiditySpender, currencyAmountA)
  const { approve: approveCurrencyAmountB } = useApprove(addLiquiditySpender, currencyAmountB)
  const { approve: approveRemoveLiquidityCurrencyAmount } = useApprove(
    removeLiquiditySpender,
    removeLiquidityCurrencyAmount
  )

  const insufficientBalance = useMemo(() => {
    if (action === LiquidityAction.Add) {
      if (currencyBalanceA && currencyAmountA) return currencyBalanceA.lessThan(currencyAmountA)
      if (currencyBalanceB && currencyAmountB) return currencyBalanceB.lessThan(currencyAmountB)
    } else {
      if (removeCurrencyAmount0) return removeCurrencyAmount0.lessThan(0)
      if (removeCurrencyAmount1) return removeCurrencyAmount1.lessThan(0)
    }
    return false
  }, [
    action,
    currencyAmountA,
    currencyAmountB,
    currencyBalanceA,
    currencyBalanceB,
    removeCurrencyAmount0,
    removeCurrencyAmount1
  ])

  const refreshTokens = useCallback(() => {
    balanceARef.current?.refreshBalance()
    balanceBRef.current?.refreshBalance()
    refreshPair()
    handleChangeAmount('', TokenType.TokenA)
    handleChangeAmount('', TokenType.TokenB)
  }, [handleChangeAmount, refreshPair])

  const handleQuickInput = useCallback(
    (tokenType: TokenType, value: number) => {
      if (tokenType === TokenType.TokenA) {
        handleChangeAmount(
          currencyBalanceA?.multiply(new Percent(value * 10000, 10000)).toSignificant() || '0',
          tokenType
        )
      } else {
        handleChangeAmount(
          currencyBalanceB?.multiply(new Percent(value * 10000, 10000)).toSignificant() || '0',
          tokenType
        )
      }
    },
    [currencyBalanceA, currencyBalanceB, handleChangeAmount]
  )

  const handleLiquidity = useCallback(async () => {
    if (action === LiquidityAction.Add) {
      if (!currencyAmountA || !currencyAmountB) return
      setLoading(true)

      try {
        // approve token
        await approveCurrencyAmountA()
        await approveCurrencyAmountB()
        // 添加流动性
        await addLiquidity(currencyAmountA, currencyAmountB, false)
        refreshTokens()
      } catch {
        //
      }
    } else {
      if (!removeLiquidityCurrencyAmount) return
      setLoading(true)
      try {
        await approveRemoveLiquidityCurrencyAmount()
        await removeLiquidity(jsbiToBigInt(removeLiquidityCurrencyAmount.quotient))
      } catch {
        //
      }
    }
    setLoading(false)
  }, [
    action,
    addLiquidity,
    approveCurrencyAmountA,
    approveCurrencyAmountB,
    approveRemoveLiquidityCurrencyAmount,
    currencyAmountA,
    currencyAmountB,
    refreshTokens,
    removeLiquidity,
    removeLiquidityCurrencyAmount
  ])

  useEffect(() => {
    handleChangeToken(pair.token0, TokenType.TokenA)
    handleChangeToken(pair.token1, TokenType.TokenB)
  }, [handleChangeToken, pair.token0, pair.token1])

  return (
    <div className="space-y-6">
      <Card>
        <KanitText variant={'tertiary'} className="border-b border-border pb-4 text-2xl">
          <Trans>Liquidity</Trans>
        </KanitText>
        <Flex className="items-center justify-between py-2.5">
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
          <Settings />
        </Flex>
        <div className="border-t border-border py-2.5">
          <KanitText variant={'tertiary'} className="text-sm">
            <Trans>My Liquidity</Trans>
          </KanitText>
          <Flex className="items-center justify-between">
            <KanitText variant={'primary'} className="text-base font-semibold">
              <span>{pair.token0.wrapped.symbol}</span>
              <span>/</span>
              <span>{pair.token1.wrapped.symbol}</span>
            </KanitText>
            <KanitText variant={'primary'} className="text-base font-semibold">
              {lpTokenCurrency?.toSignificant() || '--'}
            </KanitText>
          </Flex>
        </div>
      </Card>
      <Card className="space-y-4">
        <ButtonRadioGroup
          className="rounded-full"
          value={action}
          options={[
            {
              label: <Trans>Add</Trans>,
              value: LiquidityAction.Add,
              variant: action === LiquidityAction.Add ? 'gradient' : 'default',
              className: 'rounded-full flex-auto px-8'
            },
            {
              label: <Trans>Remove</Trans>,
              value: LiquidityAction.Remove,
              variant: action === LiquidityAction.Remove ? 'gradient' : 'default',
              className: 'rounded-full flex-auto px-8'
            }
          ]}
          onChangeValue={setAction}
        />
        {action === LiquidityAction.Add ? (
          <>
            <div className="space-y-2">
              <LiquidityAmountInputFixed
                token={pair.token0}
                title={
                  <Flex className="items-center justify-between">
                    <Flex className="space-x-2">
                      <TokenImage token={pair.token0} className="size-6 lg:size-7" />
                      <KanitText className="font-semibold text-text-primary lg:text-xl">{pair.token0.symbol}</KanitText>
                    </Flex>
                    <KanitText variant={'tertiary'} className="flex items-center space-x-2 text-xs">
                      <span>
                        <Trans>Balance: </Trans>
                      </span>
                      <TokenBalance token={pair.token0} ref={balanceARef} onBalanceChange={setCurrencyBalanceA} />
                    </KanitText>
                  </Flex>
                }
                suffixNode={
                  <Grid className="grid-cols-4 gap-2">
                    {quickInput.map(({ lable, value }) => (
                      <Button
                        key={value}
                        size={'sm'}
                        onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
                        onHoveredOutline={(hovered) => !hovered}
                        className="rounded-full"
                        onClick={() => handleQuickInput(TokenType.TokenA, value)}
                      >
                        {lable}
                      </Button>
                    ))}
                  </Grid>
                }
                value={amountA}
                onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.TokenA)}
              />
              <Flex className="justify-center">
                <Add2 />
              </Flex>
              <LiquidityAmountInputFixed
                token={pair.token1}
                title={
                  <Flex className="items-center justify-between">
                    <Flex className="space-x-2">
                      <TokenImage token={pair.token1} className="size-6 lg:size-7" />
                      <KanitText className="font-semibold text-text-primary lg:text-xl">{pair.token1.symbol}</KanitText>
                    </Flex>
                    <KanitText variant={'tertiary'} className="flex items-center space-x-2 text-xs">
                      <span>
                        <Trans>Balance: </Trans>
                      </span>
                      <TokenBalance token={pair.token1} ref={balanceBRef} onBalanceChange={setCurrencyBalanceB} />
                    </KanitText>
                  </Flex>
                }
                suffixNode={
                  <Grid className="grid-cols-4 gap-2">
                    {quickInput.map(({ lable, value }) => (
                      <Button
                        key={value}
                        size={'sm'}
                        onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
                        onHoveredOutline={(hovered) => !hovered}
                        className="rounded-full"
                        onClick={() => handleQuickInput(TokenType.TokenB, value)}
                      >
                        {lable}
                      </Button>
                    ))}
                  </Grid>
                }
                value={amountB}
                onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.TokenB)}
              />
            </div>
            <SubmitButton
              className="w-full"
              size={'xl'}
              walletConnect={isConnected}
              variant={'gradient'}
              disabled={!(currencyAmountA && currencyAmountB)}
              insufficientBalance={insufficientBalance}
              isLoading={loading}
              onClick={handleLiquidity}
            >
              <KanitText>
                <Trans>Add</Trans>
              </KanitText>
            </SubmitButton>
            <AddLiquidityPreview
              className="p-0"
              tokenA={pair.token0}
              tokenB={pair.token1}
              pair={pair}
              lpTokenBalance={lpTokenBalance}
              totalSupply={totalSupply}
              isCreated={false}
              liquidityMinted={liquidityMinted}
            />
          </>
        ) : (
          <>
            <LiquidityPrecentInput
              value={removeAmount}
              suffixNode={
                <Grid className="grid-cols-4 gap-2">
                  {quickInput.map(({ lable, value }) => (
                    <Button
                      key={value}
                      size={'sm'}
                      onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
                      onHoveredOutline={(hovered) => !hovered}
                      className="rounded-full"
                      onClick={() => setRemoveAmount((value * 100).toString())}
                    >
                      {lable}
                    </Button>
                  ))}
                </Grid>
              }
              onChange={(ev) => setRemoveAmount(ev.target.value)}
            />
            <SubmitButton
              className="w-full"
              size={'xl'}
              walletConnect={isConnected}
              variant={'gradient'}
              disabled={!removeAmount}
              insufficientBalance={insufficientBalance}
              isLoading={loading}
              onClick={handleLiquidity}
            >
              <KanitText>
                <Trans>Remove</Trans>
              </KanitText>
            </SubmitButton>
            <RemoveLiquidityPreview
              className="p-0"
              pair={pair}
              removeCurrencyAmount0={removeCurrencyAmount0}
              removeCurrencyAmount1={removeCurrencyAmount1}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default LiquidityForm
