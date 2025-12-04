import { Percent } from '@uniswap/sdk-core'
import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react'

export interface V2ContextState {
  infiniteApproval: boolean
  slippage: Percent
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
  const slippage = useMemo(() => new Percent(slippagePercent * 100, 10000), [slippagePercent])

  const createDeadline = useCallback(
    () => BigInt(Math.floor(Date.now() / 1000) + 60 * deadlineMinutes),
    [deadlineMinutes]
  )

  return (
    <V2Context.Provider value={{ ...value, infiniteApproval, slippage, createDeadline }}>{children}</V2Context.Provider>
  )
}

export default V2Provider
