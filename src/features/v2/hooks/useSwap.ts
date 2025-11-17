import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import { useCallback, useMemo } from 'react'

// export const usePairs = () => useMemo(() => , [])

export const useRoute = (pairs: Pair[], input: Currency, output: Currency) =>
  useMemo(() => new Route(pairs, input, output), [input, output, pairs])

export const useTrade = (route: Route<Currency, Currency>, amount: CurrencyAmount<Currency>, tradeType: TradeType) =>
  useMemo(() => new Trade(route, amount, tradeType), [amount, route, tradeType])

export const useSwap = () => {
  const swap = useCallback(() => {
    // Router.swapCallParameters()
  }, [])
}
