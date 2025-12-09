import { useAppKitNetwork } from '@reown/appkit/react'
import { Currency, Percent, Token } from '@uniswap/sdk-core'
import { useAtomValue } from 'jotai/react'
import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'
import { zeroAddress } from 'viem'

import { importTokenListAtom, tokenListAtom } from '@/stores/trade'

import TOKENS from '../token'

export interface V2ContextState {
  tokenConfig?: (typeof TOKENS)[number]
  infiniteApproval: boolean
  slippage: Percent
  tokenList: Currency[]
  createDeadline: () => bigint
}

const V2Context = createContext<V2ContextState>({} as V2ContextState)

export const useV2Context = () => useContext(V2Context)

const V2Provider: React.FC<
  PropsWithChildren<{
    infiniteApproval?: boolean
    slippagePercent: number
    deadlineMinutes: number
  }>
> = ({ children, slippagePercent, deadlineMinutes, infiniteApproval = false, ...value }) => {
  const { chainId } = useAppKitNetwork()
  const asyncTokenList = useAtomValue(tokenListAtom)
  const importTokenList = useAtomValue(importTokenListAtom)
  const tokenConfig = useMemo(() => (chainId && typeof chainId === 'number' && TOKENS[chainId]) || undefined, [chainId])
  const slippage = useMemo(() => new Percent(slippagePercent * 100, 10000), [slippagePercent])

  const tokenList = useMemo(() => {
    const importTokens = importTokenList.map((args) => new Token(...args))
    return Array.from(
      new Map(
        [...(tokenConfig?.TOKEN_LIST || []), ...asyncTokenList, ...importTokens].reduce<Array<[string, Currency]>>(
          (acc, token) => {
            if (token.chainId === chainId) acc.push([token.isNative ? zeroAddress : token.wrapped.address, token])
            return acc
          },
          []
        )
      ).values()
    )
  }, [asyncTokenList, chainId, importTokenList, tokenConfig?.TOKEN_LIST])

  const createDeadline = useCallback(
    () => BigInt(Math.floor(Date.now() / 1000) + 60 * deadlineMinutes),
    [deadlineMinutes]
  )

  return (
    <V2Context.Provider value={{ ...value, tokenConfig, tokenList, infiniteApproval, slippage, createDeadline }}>
      {children}
    </V2Context.Provider>
  )
}

export default V2Provider
