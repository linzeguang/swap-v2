import { Percent } from '@uniswap/sdk-core'

import { jsbiToBigInt } from '../utils'
import { ONE } from './constants'

export function getRemoveLiquidityMinAmounts({
  liquidity,
  reserve0,
  reserve1,
  totalSupply,
  slippage
}: {
  liquidity: bigint
  reserve0: bigint
  reserve1: bigint
  totalSupply: bigint
  slippage: Percent
}) {
  const amount0 = (liquidity * reserve0) / totalSupply
  const amount1 = (liquidity * reserve1) / totalSupply

  const amount0Min = ONE.subtract(slippage).multiply(amount0.toString())
  const amount1Min = ONE.subtract(slippage).multiply(amount1.toString())

  return {
    amount0,
    amount1,
    amount0Min: jsbiToBigInt(amount0Min.quotient),
    amount1Min: jsbiToBigInt(amount1Min.quotient)
  }
}
