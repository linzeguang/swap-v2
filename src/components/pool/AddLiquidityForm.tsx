import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'
import React, { ComponentRef, useCallback, useMemo, useRef, useState } from 'react'

import { useApprove } from '@/features/hooks/useApprove'
import { useAddLiquidity } from '@/features/v2/hooks/useLiquidity'
import { TokenType, useLiquidityForm } from '@/features/v2/hooks/useLiquidityForm'
import { cn } from '@/lib/utils'

import { LiquidityAmountInput } from '../common/AmountInput'
import HalfMax from '../common/HalfMax'
import Settings from '../common/Settings'
import SubmitButton from '../common/SubmitButton'
import TokenBalance from '../common/TokenBalance'
import { Wallet } from '../svgr/icons'
import { Add } from '../svgr/pool'
import { Card, Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'
import Preview from './Preview'

const AddLiquidityForm: React.FC = () => {
  const { isConnected } = useAppKitAccount()

  const {
    tokenType,
    tokenA,
    tokenB,
    amountA,
    amountB,
    currencyAmountA,
    currencyAmountB,
    isCreated,
    isEmpty,
    pair,
    totalSupply,
    lpTokenBalance,
    liquidityMinted,
    createPair,
    refreshPair,
    handleChangeToken,
    handleChangeAmount
  } = useLiquidityForm()

  const { addLiquidity, spender } = useAddLiquidity()

  const [loading, setLoading] = useState(false)
  const [currencyBalanceA, setCurrencyBalanceA] = useState<CurrencyAmount<Currency>>()
  const [currencyBalanceB, setCurrencyBalanceB] = useState<CurrencyAmount<Currency>>()
  const balanceARef = useRef<ComponentRef<typeof TokenBalance>>(null)
  const balanceBRef = useRef<ComponentRef<typeof TokenBalance>>(null)

  const { approve: approveCurrencyAmountA } = useApprove(spender, currencyAmountA)
  const { approve: approveCurrencyAmountB } = useApprove(spender, currencyAmountB)

  const insufficientBalance = useMemo(() => {
    if (currencyBalanceA && currencyAmountA) return currencyBalanceA.lessThan(currencyAmountA)
    if (currencyBalanceB && currencyAmountB) return currencyBalanceB.lessThan(currencyAmountB)
    return false
  }, [currencyAmountA, currencyAmountB, currencyBalanceA, currencyBalanceB])

  const refreshTokens = useCallback(() => {
    balanceARef.current?.refreshBalance()
    balanceBRef.current?.refreshBalance()
    refreshPair()
    handleChangeAmount('', TokenType.TokenA)
    handleChangeAmount('', TokenType.TokenB)
  }, [handleChangeAmount, refreshPair])

  const handleHalfMax = useCallback(
    (val: number, tokenType: TokenType) => {
      const percent = new Percent(val * 10000, 10000)
      if (tokenType === TokenType.TokenA && currencyBalanceA) {
        handleChangeAmount(currencyBalanceA.multiply(percent).toSignificant(), tokenType)
      }
      if (tokenType === TokenType.TokenB && currencyBalanceB) {
        handleChangeAmount(currencyBalanceB.multiply(percent).toSignificant(), tokenType)
      }
    },
    [currencyBalanceA, currencyBalanceB, handleChangeAmount]
  )

  const handleAddLiquidity = useCallback(async () => {
    if (!currencyAmountA || !currencyAmountB) return

    setLoading(true)
    const isInit = !isCreated || isEmpty
    try {
      // 需要创建池子
      if (!isCreated) await createPair()
      // approve token
      await approveCurrencyAmountA()
      await approveCurrencyAmountB()
      // 添加流动性
      await addLiquidity(currencyAmountA, currencyAmountB, isInit)
      refreshTokens()
    } catch {
      //
    }
    setLoading(false)
  }, [
    currencyAmountA,
    currencyAmountB,
    isCreated,
    isEmpty,
    createPair,
    approveCurrencyAmountA,
    approveCurrencyAmountB,
    addLiquidity,
    refreshTokens
  ])

  return (
    <div className="relative">
      {/* <TopIcon className="absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-[100px]" /> */}
      <Card className="relative z-[2] space-y-6">
        <Flex className="items-center justify-between">
          <KanitText className="text-1.5xl text-text-primary">
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
                    <TokenBalance ref={balanceARef} token={tokenA} onBalanceChange={setCurrencyBalanceA} />
                  </KanitText>
                  <HalfMax onClick={(val) => handleHalfMax(val, TokenType.TokenA)} />
                </Flex>
                {/* <KanitText>usd balance</KanitText> */}
              </Flex>
            }
            value={amountA}
            className={cn(tokenType && tokenType !== TokenType.TokenA && 'animate-fade')}
            onTokenSelect={(token) => handleChangeToken(token, TokenType.TokenA)}
            onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.TokenA)}
          />
          <Add className="mx-auto text-icon" />
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={tokenB}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <TokenBalance ref={balanceBRef} token={tokenB} onBalanceChange={setCurrencyBalanceB} />
                  </KanitText>
                  <HalfMax onClick={(val) => handleHalfMax(val, TokenType.TokenB)} />
                </Flex>
                {/* <KanitText>usd balance</KanitText> */}
              </Flex>
            }
            value={amountB}
            className={cn(tokenType && tokenType !== TokenType.TokenB && 'animate-fade')}
            onTokenSelect={(token) => handleChangeToken(token, TokenType.TokenB)}
            onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.TokenB)}
          />
        </div>
        <Preview
          tokenA={tokenA}
          tokenB={tokenB}
          pair={pair}
          lpTokenBalance={lpTokenBalance}
          totalSupply={totalSupply}
          isCreated={isCreated}
          liquidityMinted={liquidityMinted}
        />
        <SubmitButton
          walletConnect={isConnected}
          disabled={!(currencyAmountA && currencyAmountB)}
          insufficientBalance={insufficientBalance}
          isLoading={loading}
          onClick={handleAddLiquidity}
        >
          <KanitText>
            {!isCreated ? (
              <Trans>Create pool and add liquidity</Trans>
            ) : isEmpty ? (
              <Trans>Add Initial Liquidity</Trans>
            ) : (
              <Trans>Add</Trans>
            )}
          </KanitText>
        </SubmitButton>
      </Card>
    </div>
  )
}

export default AddLiquidityForm
