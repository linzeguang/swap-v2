import { useAppKitNetwork } from '@reown/appkit/react'
import { Currency, Percent } from '@uniswap/sdk-core'
import { useAtomValue } from 'jotai/react'
import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'

import { tokenListAtom } from '@/stores/trade'

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
  const tokenConfig = useMemo(() => (chainId && typeof chainId === 'number' && TOKENS[chainId]) || undefined, [chainId])
  const slippage = useMemo(() => new Percent(slippagePercent * 100, 10000), [slippagePercent])

  const tokenList = useMemo(
    () => [...(tokenConfig?.TOKEN_LIST || []), ...asyncTokenList],
    [asyncTokenList, tokenConfig?.TOKEN_LIST]
  )

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
