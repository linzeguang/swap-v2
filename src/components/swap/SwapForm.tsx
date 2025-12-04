import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import React, { ComponentRef, useCallback, useMemo, useRef, useState } from 'react'

import { useApprove } from '@/features/hooks/useApprove'
import { useSwap } from '@/features/v2/hooks/useSwap'
import { TokenType, useSwapForm } from '@/features/v2/hooks/useSwapForm'
import { cn } from '@/lib/utils'

import { TokenAmountInput } from '../common/AmountInput'
import SubmitButton from '../common/SubmitButton'
import TokenBalance from '../common/TokenBalance'
import { Swap as SwapIcon, Wallet } from '../svgr/icons'
import { Card, Flex } from '../ui/Box'
import { Dividing } from '../ui/Dividing'
import { KanitText } from '../ui/Text'
import Preview from './Preview'

const SwapForm: React.FC = () => {
  const { isConnected } = useAppKitAccount()

  const [loading, setLoading] = useState(false)
  const [currencyBalanceInput, setCurrencyBalanceInput] = useState<CurrencyAmount<Currency>>()
  const [currencyBalanceOutput, setCurrencyBalanceOutput] = useState<CurrencyAmount<Currency>>()
  const balanceInputRef = useRef<ComponentRef<typeof TokenBalance>>(null)
  const balanceOutputRef = useRef<ComponentRef<typeof TokenBalance>>(null)

  const {
    tokenType,
    inputToken,
    inputAmount,
    outputToken,
    outputAmount,
    currencyAmountInput,
    currencyAmountOutput,
    pairsLoading,
    route,
    trade,
    handleSwapTokens,
    handleChangeToken,
    handleChangeAmount,
    refreshPairs
  } = useSwapForm()

  const { spender, swap } = useSwap()

  const { approve: approveCurrencyAmount } = useApprove(spender, trade?.inputAmount)

  const insufficientBalance = useMemo(() => {
    if (tokenType === TokenType.Input)
      return !!(currencyAmountInput && currencyBalanceInput) && currencyBalanceInput.lessThan(currencyAmountInput)
    if (tokenType === TokenType.Output)
      return !!(currencyAmountOutput && currencyBalanceOutput) && currencyBalanceOutput.lessThan(currencyAmountOutput)
    return false
  }, [currencyAmountInput, currencyAmountOutput, currencyBalanceInput, currencyBalanceOutput, tokenType])

  const refreshTokens = useCallback(() => {
    balanceInputRef.current?.refreshBalance()
    balanceOutputRef.current?.refreshBalance()
    refreshPairs()
    handleChangeAmount('', TokenType.Input)
    handleChangeAmount('', TokenType.Output)
  }, [handleChangeAmount, refreshPairs])

  const handleSwap = useCallback(async () => {
    if (!trade) return
    setLoading(true)
    try {
      await approveCurrencyAmount()
      await swap(trade)
      refreshTokens()
    } catch {
      //
    }
    setLoading(false)
  }, [approveCurrencyAmount, refreshTokens, swap, trade])

  return (
    <Card>
      <TokenAmountInput
        title={
          <Flex className="items-center justify-between">
            <KanitText className="text-xs text-secondary">
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
            <KanitText className="text-xs text-secondary">
              <Trans>To</Trans>
            </KanitText>
            <KanitText variant={'tertiary'} className="flex items-center space-x-2">
              <TokenBalance ref={balanceOutputRef} token={outputToken} onBalanceChange={setCurrencyBalanceOutput} />
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
      <SubmitButton
        className="mt-6"
        walletConnect={isConnected}
        disabled={!!pairsLoading || !route}
        insufficientBalance={insufficientBalance}
        isLoading={loading}
        onClick={handleSwap}
      >
        <KanitText>
          {pairsLoading ? (
            <Trans>Fetching Swap Route</Trans>
          ) : !route ? (
            <Trans>Not Route to swap</Trans>
          ) : (
            <Trans>Swap</Trans>
          )}
        </KanitText>
      </SubmitButton>
    </Card>
  )
}

export default SwapForm
