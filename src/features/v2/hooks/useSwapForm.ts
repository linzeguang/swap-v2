import { Trade } from '@pippyswap/v2-sdk'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from 'react-use'
import { parseUnits, zeroAddress } from 'viem'

import { areTokensIdentical } from '@/features/utils'

import { useV2Context } from '../provider'
import { usePairs } from './usePair'
import { useRoute } from './useSwap'

export enum TokenType {
  Input = 'Input',
  Output = 'Output'
}

export const useSwapForm = () => {
  const { tokenConfig } = useV2Context()
  const [searchParams, setSearchParams] = useSearchParams()

  const [inputToken, setInputToken] = useState<Currency>()
  const [outputToken, setOutputToken] = useState<Currency>()
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [tokenType, setTokenType] = useState<TokenType>()

  const { pairs, isLoaing: pairsLoading, refreshPairs } = usePairs(inputToken, outputToken)

  const route = useRoute(pairs, inputToken, outputToken)

  const currencyAmountInput = useMemo(
    () =>
      inputToken && Number(inputAmount)
        ? CurrencyAmount.fromRawAmount(inputToken, parseUnits(inputAmount, inputToken.decimals).toString())
        : undefined,
    [inputAmount, inputToken]
  )

  const currencyAmountOutput = useMemo(
    () =>
      outputToken && Number(outputAmount)
        ? CurrencyAmount.fromRawAmount(outputToken, parseUnits(outputAmount, outputToken.decimals).toString())
        : undefined,
    [outputAmount, outputToken]
  )

  const [tradeByInputToken, outputOptimal] = useMemo(() => {
    const currencyAmount =
      inputToken &&
      CurrencyAmount.fromRawAmount(inputToken, parseUnits(inputAmount || '0', inputToken.decimals).toString())

    if (!currencyAmount?.greaterThan(0) || !route) return []
    const trade = new Trade(route, currencyAmount, TradeType.EXACT_INPUT)

    return [trade, trade.outputAmount.toSignificant()]
  }, [inputAmount, inputToken, route])

  const [tradeByOutputToken, inputOptimal] = useMemo(() => {
    const currencyAmount =
      outputToken &&
      CurrencyAmount.fromRawAmount(outputToken, parseUnits(outputAmount || '0', outputToken.decimals).toString())

    if (!currencyAmount?.greaterThan(0) || !route) return []
    const trade = new Trade(route, currencyAmount, TradeType.EXACT_OUTPUT)

    return [trade, trade.inputAmount.toSignificant()]
  }, [outputAmount, outputToken, route])

  const handleSwapTokens = useCallback(() => {
    const [nextInputToken, nextOutputToken] = [outputToken, inputToken]

    setInputToken(nextInputToken)
    setOutputToken(nextOutputToken)
    setInputAmount('')
    setOutputAmount('')

    if (nextInputToken) {
      searchParams.set('inputToken', nextInputToken.isNative ? zeroAddress : nextInputToken.wrapped.address)
    }
    if (nextOutputToken) {
      searchParams.set('outputToken', nextOutputToken.isNative ? zeroAddress : nextOutputToken.wrapped.address)
    }
    setSearchParams(searchParams)
  }, [inputToken, outputToken, searchParams, setSearchParams])

  const handleChangeToken = useCallback(
    (token: Currency | undefined, tokenType: TokenType) => {
      setTokenType(undefined)
      setInputAmount('')
      setOutputAmount('')
      let [nextInputToken, nextOutputToken] = [inputToken, outputToken]
      if (tokenType === TokenType.Input) {
        if (areTokensIdentical(token, inputToken)) return
        nextInputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextOutputToken = inputToken
      } else {
        if (areTokensIdentical(token, outputToken)) return
        nextOutputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextInputToken = outputToken
      }

      setInputToken(nextInputToken)
      setOutputToken(nextOutputToken)

      if (nextInputToken) {
        searchParams.set('inputToken', nextInputToken.isNative ? zeroAddress : nextInputToken.wrapped.address)
      }
      if (nextOutputToken) {
        searchParams.set('outputToken', nextOutputToken.isNative ? zeroAddress : nextOutputToken.wrapped.address)
      }
      setSearchParams(searchParams)
    },
    [inputToken, outputToken, searchParams, setSearchParams]
  )

  const handleChangeAmount = useCallback(async (amount: string, tokenType: TokenType) => {
    setTokenType(tokenType)
    if (tokenType === TokenType.Input) {
      setInputAmount(amount)
    } else {
      setOutputAmount(amount)
    }
  }, [])

  useEffect(() => {
    // load url token
    const addressA = searchParams.get('inputToken')
    const addressB = searchParams.get('outputToken')
    const [inputToken, outputToken] = [addressA, addressB].map((address) =>
      tokenConfig?.TOKEN_LIST.find((token) => {
        if (address === zeroAddress) {
          return token.isNative
        }
        return !token.isNative && token.wrapped.address === address
      })
    )
    if (addressA && !inputToken) searchParams.delete('inputToken')
    if (addressB && !outputToken) searchParams.delete('outputToken')
    setSearchParams(searchParams)
    setInputToken(inputToken || !outputToken ? tokenConfig?.ETH : undefined)
    setOutputToken(outputToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDebounce(
    () => {
      console.log('>>>>>> outputOptimal: ', outputOptimal)
      if (tokenType === TokenType.Input) setOutputAmount(outputOptimal || '')
    },
    500,
    [outputOptimal, tokenType]
  )

  useDebounce(
    () => {
      if (tokenType === TokenType.Output) setInputAmount(inputOptimal || '')
    },
    500,
    [inputOptimal, tokenType]
  )

  return {
    tokenType,
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    currencyAmountInput,
    currencyAmountOutput,
    pairsLoading,
    route,
    trade: tokenType ? (tokenType === TokenType.Input ? tradeByInputToken : tradeByOutputToken) : undefined,
    handleSwapTokens,
    handleChangeToken,
    handleChangeAmount,
    refreshPairs
  }
}
