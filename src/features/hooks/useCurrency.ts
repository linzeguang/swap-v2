import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { ComponentRef, useMemo, useRef, useState } from 'react'
import { parseUnits } from 'viem'

import TokenBalance, { Balance } from '@/components/common/TokenBalance'

export const useCurrency = () => {
  const tokenBalanceRef = useRef<ComponentRef<typeof TokenBalance>>(null)
  const [tokenBalance, setTokenBalance] = useState<Balance>()
  const [tokenAmount, setTokenAmount] = useState<string>()
  const [token, setToken] = useState<Currency | undefined>()

  const currencyBalance = useMemo(() => {
    if (!token || !tokenBalance) return
    return CurrencyAmount.fromRawAmount(token, tokenBalance.value.toString())
  }, [token, tokenBalance])

  const currencyAmount = useMemo(() => {
    if (!token || !tokenAmount) return
    return CurrencyAmount.fromRawAmount(token, parseUnits(tokenAmount, token.wrapped.decimals).toString())
  }, [token, tokenAmount])

  return {
    setTokenBalance,
    setTokenAmount,
    setToken,
    tokenBalanceRef,
    token,
    currencyBalance,
    currencyAmount,
    insufficientBalance: currencyBalance && currencyAmount && currencyAmount.greaterThan(currencyBalance)
  }
}
