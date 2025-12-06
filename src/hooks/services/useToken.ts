import { Token } from '@uniswap/sdk-core'
import { useSetAtom } from 'jotai/react'
import { useEffect, useMemo } from 'react'

import { useFetch } from '@/hooks/services/useFetch'
import { tokenImagesAtom, tokenListAtom } from '@/stores/trade'

export interface TokenInfo {
  chainid: number
  ca_addr: string
  name: string
  symbol: string
  decimals: string
  logo_url: string
}

export const useTokenList = () => {
  const setTokenImages = useSetAtom(tokenImagesAtom)
  const setTokenList = useSetAtom(tokenListAtom)
  const { data } = useFetch<TokenInfo[]>({ url: `/getHotTokenList` })

  const tokenList = useMemo(() => {
    return data?.data.map(({ chainid, ca_addr, decimals, name, symbol, logo_url }) => {
      setTokenImages((prev) => ({ ...prev, [ca_addr]: logo_url }))
      return new Token(chainid, ca_addr, Number(decimals), symbol, name)
    })
  }, [data?.data, setTokenImages])

  useEffect(() => {
    if (tokenList) setTokenList(tokenList)
  }, [setTokenList, tokenList])
}
