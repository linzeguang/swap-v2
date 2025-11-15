import { Percent } from '@uniswap/sdk-core'

import { jsbiToBigInt } from '../utils'
import { one } from './constants'

export function getRemoveLiquidityMinAmounts({
  liquidity,
  reserveA,
  reserveB,
  totalSupply,
  slippage
}: {
  liquidity: bigint
  reserveA: bigint
  reserveB: bigint
  totalSupply: bigint
  slippage: Percent
}) {
  const amountA = (liquidity * reserveA) / totalSupply
  const amountB = (liquidity * reserveB) / totalSupply

  const amountAMin = one.subtract(slippage).multiply(amountA.toString())
  const amountBMin = one.subtract(slippage).multiply(amountB.toString())

  return {
    amountA,
    amountB,
    amountAMin: jsbiToBigInt(amountAMin.quotient),
    amountBMin: jsbiToBigInt(amountBMin.quotient)
  }
}
