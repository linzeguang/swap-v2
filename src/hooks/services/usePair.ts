import { Pair } from '@pippyswap/v2-sdk'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useSetAtom } from 'jotai/react'
import { useEffect } from 'react'

import { useFetch } from '@/hooks/services/useFetch'
import { pairListAtom, tokenImagesAtom, tokenListAtom } from '@/stores/trade'

export interface PairInfo {
  chainid: number
  pair: string
  reserve0: string
  reserve1: string
  totalSupply: string
  volumeUSD: string
  token0: string
  token0_logo_url: string
  token0_name: string
  token0_symbol: string
  token0_decimals: string
  token1: string
  token1_logo_url: string
  token1_name: string
  token1_symbol: string
  token1_decimals: string
}

export const usePairList = () => {
  const setTokenImages = useSetAtom(tokenImagesAtom)
  const setTokenList = useSetAtom(tokenListAtom)
  const setPairList = useSetAtom(pairListAtom)
  const { data } = useFetch<PairInfo[]>({ url: `/getPairList` })

  useEffect(() => {
    if (!data) return
    const tokenMap: Record<string, Token> = {}
    const tokenImagesMap: Record<string, string> = {}
    const pairList = data.data.map((pairInfo) => {
      const token0 = new Token(
        pairInfo.chainid,
        pairInfo.token0,
        Number(pairInfo.token0_decimals),
        pairInfo.token0_symbol,
        pairInfo.token0_name
      )
      const token1 = new Token(
        pairInfo.chainid,
        pairInfo.token1,
        Number(pairInfo.token1_decimals),
        pairInfo.token1_symbol,
        pairInfo.token1_name
      )
      tokenMap[token0.address] = token0
      tokenMap[token1.address] = token1
      tokenImagesMap[token0.address] = pairInfo.token0_logo_url
      tokenImagesMap[token1.address] = pairInfo.token1_logo_url
      const currencyAmount0 = CurrencyAmount.fromRawAmount(token0, pairInfo.reserve0)
      const currencyAmount1 = CurrencyAmount.fromRawAmount(token1, pairInfo.reserve1)
      return new Pair(currencyAmount0, currencyAmount1)
    })

    setTokenList((prev) => {
      prev.forEach((token) => {
        tokenMap[token.address] = token
      })
      return Object.values(tokenMap)
    })
    setTokenImages((prev) => ({ ...tokenImagesMap, ...prev }))
    setPairList(pairList)
  }, [data, setPairList, setTokenImages, setTokenList])
}
