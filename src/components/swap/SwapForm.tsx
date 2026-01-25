import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useAtom } from 'jotai/react'
import React, { ComponentRef, useCallback, useMemo, useRef, useState } from 'react'

import { useApprove } from '@/features/hooks/useApprove'
import { useSwap } from '@/features/v2/hooks/useSwap'
import { TokenType, useSwapForm } from '@/features/v2/hooks/useSwapForm'
import { useV2Context } from '@/features/v2/provider'
import { cn } from '@/lib/utils'
import { slippageAtom } from '@/stores/settings'

import { TokenAmountInput } from '../common/AmountInput'
import KeyValue from '../common/KeyValue'
import { SlippageField } from '../common/Settings'
import SubmitButton from '../common/SubmitButton'
import TokenBalance from '../common/TokenBalance'
import { Edit, Swap as SwapIcon, Wallet } from '../svgr/icons'
import { Card, Flex } from '../ui/Box'
import { Dialog } from '../ui/Dialog'
import { Dividing } from '../ui/Dividing'
import { KanitText } from '../ui/Text'
import Preview from './Preview'

const SwapForm: React.FC = () => {
  const { isConnected } = useAppKitAccount()
  const { tokenConfig } = useV2Context()
  const [slippage] = useAtom(slippageAtom)

  const [loading, setLoading] = useState(false)
  const [currencyBalanceInput, setCurrencyBalanceInput] = useState<CurrencyAmount<Currency>>()
  // const [currencyBalanceOutput, setCurrencyBalanceOutput] = useState<CurrencyAmount<Currency>>()
  const balanceInputRef = useRef<ComponentRef<typeof TokenBalance>>(null)
  const balanceOutputRef = useRef<ComponentRef<typeof TokenBalance>>(null)

  const {
    tokenType,
    inputToken,
    inputAmount,
    outputToken,
    outputAmount,
    currencyAmountInput,
    pairsLoading,
    route,
    trade,
    isWrapETH,
    isUnwrapETH,
    isWrapUSDT,
    isUnwrapUSDT,
    handleSwapTokens,
    handleChangeToken,
    handleChangeAmount,
    refreshPairs,
    depositETH,
    withdrawETH,
    depositUSDT,
    withdrawUSDT
  } = useSwapForm()

  const { spender, swap } = useSwap()

  const { approve: approveCurrencyAmount } = useApprove(
    isWrapUSDT || isUnwrapUSDT ? tokenConfig!.UCO.address : spender,
    currencyAmountInput
  )

  const insufficientBalance = useMemo(() => {
    return !!(currencyAmountInput && currencyBalanceInput) && currencyBalanceInput.lessThan(currencyAmountInput)
    // if (tokenType === TokenType.Input)
    //   return !!(currencyAmountInput && currencyBalanceInput) && currencyBalanceInput.lessThan(currencyAmountInput)
    // if (tokenType === TokenType.Output)
    //   return !!(currencyAmountOutput && currencyBalanceOutput) && currencyBalanceOutput.lessThan(currencyAmountOutput)
    // return false
  }, [currencyAmountInput, currencyBalanceInput])

  const refreshTokens = useCallback(() => {
    balanceInputRef.current?.refreshBalance()
    balanceOutputRef.current?.refreshBalance()
    refreshPairs()
    handleChangeAmount('', TokenType.Input)
    handleChangeAmount('', TokenType.Output)
  }, [handleChangeAmount, refreshPairs])

  const handleSwap = useCallback(async () => {
    if (!tokenConfig) return

    try {
      setLoading(true)
      if (isWrapETH) {
        await depositETH()
      } else if (isUnwrapETH) {
        await approveCurrencyAmount()
        await withdrawETH()
      } else if (isWrapUSDT) {
        console.log('>>>>>> isWrapUSDT: ', isWrapUSDT)
        await approveCurrencyAmount()
        await depositUSDT()
      } else if (isUnwrapUSDT) {
        await approveCurrencyAmount()
        await withdrawUSDT()
      } else {
        if (!trade) throw false
        await approveCurrencyAmount()
        await swap(trade)
      }
      refreshTokens()
    } catch {
      setLoading(false)
    }

    setLoading(false)
  }, [
    approveCurrencyAmount,
    depositETH,
    depositUSDT,
    isUnwrapETH,
    isUnwrapUSDT,
    isWrapETH,
    isWrapUSDT,
    refreshTokens,
    swap,
    tokenConfig,
    trade,
    withdrawETH,
    withdrawUSDT
  ])

  return (
    <>
      <Card>
        <TokenAmountInput
          title={
            <Flex className="items-center justify-between">
              <KanitText className="text-xs font-bold text-text-tertiary">
                <Trans>From</Trans>
              </KanitText>
              <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                <TokenBalance ref={balanceInputRef} token={inputToken} onBalanceChange={setCurrencyBalanceInput} />
                <Wallet />
              </KanitText>
            </Flex>
          }
          tokenSelectDialogProps={{ title: <Trans>From</Trans> }}
          token={inputToken}
          value={inputAmount}
          className={cn(tokenType && tokenType !== TokenType.Input && 'animate-fade')}
          onTokenSelect={(token) => handleChangeToken(token, TokenType.Input)}
          onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.Input)}
        />
        <div className="relative -mb-4 py-10">
          <Dividing />
          <SwapIcon
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleSwapTokens}
          />
        </div>
        <TokenAmountInput
          title={
            <Flex className="items-center justify-between">
              <KanitText className="text-xs font-bold text-text-tertiary">
                <Trans>To</Trans>
              </KanitText>
              <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                <TokenBalance
                  ref={balanceOutputRef}
                  token={outputToken}
                  //  onBalanceChange={setCurrencyBalanceOutput}
                />
                <Wallet />
              </KanitText>
            </Flex>
          }
          tokenSelectDialogProps={{ title: <Trans>To</Trans> }}
          token={outputToken}
          value={outputAmount}
          className={cn(tokenType && tokenType !== TokenType.Output && 'animate-fade')}
          onTokenSelect={(token) => handleChangeToken(token, TokenType.Output)}
          onChange={(ev) => handleChangeAmount(ev.target.value, TokenType.Output)}
        />
        {trade && <Preview trade={trade} />}
      </Card>
      <Card className="space-y-3">
        <KeyValue
          keyNode={t`Slippage Tolerance`}
          valueNode={
            <Dialog
              trigger={{
                children: (
                  <KanitText variant={'active'} className="flex items-center space-x-1">
                    <span>Auto: {slippage}%</span>
                    <Edit />
                  </KanitText>
                )
              }}
            >
              <SlippageField />
            </Dialog>
          }
        />
        <SubmitButton
          walletConnect={isConnected}
          disabled={isWrapETH || isUnwrapETH || isWrapUSDT || isUnwrapUSDT ? false : !!pairsLoading || !route}
          insufficientBalance={insufficientBalance}
          isLoading={loading}
          onClick={handleSwap}
        >
          <KanitText>
            {pairsLoading ? (
              <Trans>Fetching Swap Route</Trans>
            ) : currencyAmountInput?.lessThan(0) ? (
              <Trans>Input Amount</Trans>
            ) : isWrapETH || isUnwrapETH || isWrapUSDT || isUnwrapUSDT || route ? (
              <Trans>Swap</Trans>
            ) : (
              <Trans>Not Route to swap</Trans>
            )}
          </KanitText>
        </SubmitButton>
      </Card>
    </>
  )
}

export default SwapForm
