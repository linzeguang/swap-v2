import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from 'react-use'
import { parseUnits, zeroAddress } from 'viem'

import { areTokensIdentical } from '@/features/utils'

import { useV2Context } from '../provider'
import { usePair } from './usePair'

export enum TokenType {
  TokenA = 'TokenA',
  TokenB = 'TokenB'
}

export const useLiquidityForm = () => {
  const { tokenConfig } = useV2Context()

  const [searchParams, setSearchParams] = useSearchParams()

  const [tokenA, setTokenA] = useState<Currency>()
  const [tokenB, setTokenB] = useState<Currency>()
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [tokenType, setTokenType] = useState<TokenType>()

  const { currencyAmountA, currencyAmountB, pair, isEmpty, getAmountOptimal, ...pairInfo } = usePair({
    tokenA,
    tokenB,
    amountA,
    amountB
  })

  const setAmountOptimal = useCallback(
    async (amountDesired: string, tokenType: TokenType) => {
      if (isEmpty) return
      if (tokenType === TokenType.TokenA) {
        const amountOptimal = amountDesired
          ? await getAmountOptimal(
              tokenA && CurrencyAmount.fromRawAmount(tokenA, parseUnits(amountDesired, tokenA.decimals).toString())
            )
          : undefined
        if (amountOptimal && tokenB) {
          const currencyAmountOptimal = CurrencyAmount.fromRawAmount(tokenB, amountOptimal.toString())
          setAmountB(currencyAmountOptimal.toSignificant())
        } else {
          setAmountB('')
          setTokenType(undefined)
        }
      } else {
        const amountOptimal = amountDesired
          ? await getAmountOptimal(
              tokenB && CurrencyAmount.fromRawAmount(tokenB, parseUnits(amountDesired, tokenB.decimals).toString())
            )
          : undefined
        if (amountOptimal && tokenA) {
          const currencyAmountOptimal = CurrencyAmount.fromRawAmount(tokenA, amountOptimal.toString())
          setAmountA(currencyAmountOptimal.toSignificant())
        } else {
          setAmountA('')
          setTokenType(undefined)
        }
      }
    },
    [getAmountOptimal, isEmpty, tokenA, tokenB]
  )

  const handleChangeToken = useCallback(
    (token: Currency | undefined, tokenType: TokenType) => {
      setTokenType(undefined)
      setAmountA('')
      setAmountB('')
      let [nextTokenA, nextTokenB] = [tokenA, tokenB]
      if (tokenType === TokenType.TokenA) {
        if (areTokensIdentical(token, tokenA)) return
        nextTokenA = token
        if (areTokensIdentical(nextTokenA, nextTokenB)) nextTokenB = tokenA
      } else {
        if (areTokensIdentical(token, tokenB)) return
        nextTokenB = token
        if (areTokensIdentical(nextTokenA, nextTokenB)) nextTokenA = tokenB
      }

      setTokenA(nextTokenA)
      setTokenB(nextTokenB)

      if (nextTokenA) {
        searchParams.set('tokenA', nextTokenA.isNative ? zeroAddress : nextTokenA.wrapped.address)
      }
      if (nextTokenB) {
        searchParams.set('tokenB', nextTokenB.isNative ? zeroAddress : nextTokenB.wrapped.address)
      }
      setSearchParams(searchParams)
    },
    [tokenA, tokenB, searchParams, setSearchParams]
  )

  const handleChangeAmount = useCallback(async (amount: string, tokenType: TokenType) => {
    setTokenType(tokenType)
    if (tokenType === TokenType.TokenA) {
      setAmountA(amount)
    } else {
      setAmountB(amount)
    }
  }, [])

  useDebounce(
    () => {
      if (tokenType === TokenType.TokenA) setAmountOptimal(amountA, tokenType)
    },
    500,
    [amountA, tokenType]
  )

  useDebounce(
    () => {
      if (tokenType === TokenType.TokenB) setAmountOptimal(amountB, tokenType)
    },
    500,
    [amountB, tokenType]
  )

  useEffect(() => {
    // load url token
    const addressA = searchParams.get('tokenA')
    const addressB = searchParams.get('tokenB')
    const [tokenA, tokenB] = [addressA, addressB].map((address) =>
      tokenConfig?.TOKEN_LIST.find((token) => {
        if (address === zeroAddress) {
          return token.isNative
        }
        return !token.isNative && token.wrapped.address === address
      })
    )
    if (addressA && !tokenA) searchParams.delete('tokenA')
    if (addressB && !tokenB) searchParams.delete('tokenB')
    setSearchParams(searchParams)
    setTokenA(tokenA || tokenConfig?.ETH)
    setTokenB(tokenB)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    tokenType,
    tokenA,
    tokenB,
    amountA,
    amountB,
    currencyAmountA,
    currencyAmountB,
    pair,
    isEmpty,
    ...pairInfo,
    handleChangeToken,
    handleChangeAmount
  }
}
