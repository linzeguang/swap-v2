import { Percent } from '@uniswap/sdk-core'
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'

export interface V2ContextState {
  slippage: Percent
  deadline: bigint
}

const V2Context = createContext<V2ContextState>({} as V2ContextState)

export const useV2Context = () => useContext(V2Context)

const V2Provider: React.FC<
  PropsWithChildren<{
    slippagePercent: number
    deadlineMinutes: number
  }>
> = ({ children, slippagePercent, deadlineMinutes, ...value }) => {
  const deadline = useMemo(() => BigInt(Math.floor(Date.now() / 1000) + 60 * deadlineMinutes), [deadlineMinutes])
  const slippage = useMemo(() => new Percent(slippagePercent * 100, 10000), [slippagePercent])

  return <V2Context.Provider value={{ ...value, slippage, deadline }}>{children}</V2Context.Provider>
}

export default V2Provider
