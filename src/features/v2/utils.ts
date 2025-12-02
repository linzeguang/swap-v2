import { Percent } from '@uniswap/sdk-core'

import { jsbiToBigInt } from '../utils'
import { ONE } from './constants'

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

  const amountAMin = ONE.subtract(slippage).multiply(amountA.toString())
  const amountBMin = ONE.subtract(slippage).multiply(amountB.toString())

  return {
    amountA,
    amountB,
    amountAMin: jsbiToBigInt(amountAMin.quotient),
    amountBMin: jsbiToBigInt(amountBMin.quotient)
  }
}
