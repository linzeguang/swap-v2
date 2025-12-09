import { useAppKitNetwork } from '@reown/appkit/react'
import { Token } from '@uniswap/sdk-core'
import { useSetAtom } from 'jotai/react'
import { useEffect, useMemo, useState } from 'react'
import { Address, erc20Abi, isAddress } from 'viem'
import { useReadContracts } from 'wagmi'

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
    if (tokenList) setTokenList((prev) => [...prev, ...tokenList])
  }, [setTokenList, tokenList])
}

export const useSearchToken = () => {
  const { chainId } = useAppKitNetwork()
  const [searchValue, setSearchValue] = useState('')

  const { data: tokenMeta } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: searchValue as Address,
        functionName: 'decimals'
      },
      {
        abi: erc20Abi,
        address: searchValue as Address,
        functionName: 'symbol'
      },
      {
        abi: erc20Abi,
        address: searchValue as Address,
        functionName: 'name'
      }
    ],
    query: {
      enabled: isAddress(searchValue)
    }
  })

  const token = useMemo(() => {
    if (!chainId || !searchValue || !tokenMeta) return
    const [{ result: decimals }, { result: symbol }, { result: name }] = tokenMeta

    return new Token(Number(chainId), searchValue, decimals!, symbol, name)
  }, [chainId, searchValue, tokenMeta])
  console.log('>>>>>> token: ', token)

  return {
    token,
    searchValue,
    setSearchValue
  }
}
