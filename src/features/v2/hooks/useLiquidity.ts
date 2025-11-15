import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, NativeCurrency, Percent, Token } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import { Address, erc20Abi } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { jsbiToBigInt } from '@/features/utils'

import { ROUTER_02_ABI } from '../abis'
import { one, ROUTER_02_ADDRESS } from '../constants'
import { getRemoveLiquidityMinAmounts } from '../utils'

const slippage = new Percent(0.5 * 100, 10000) // 默认 0.5%
const deadlineMinutes = 10

export const useLiquidity = (pairAddress: Address, reserveA: bigint, reserveB: bigint, totalSupply: bigint) => {
  const { address } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract()

  const deadline = Math.floor(Date.now() / 1000) + 60 * deadlineMinutes // 10分钟后过期

  const liquidity = useReadContract({
    address: pairAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !!address
    }
  })

  const addLiquidity = useCallback(
    (
      currencyAmountA: CurrencyAmount<Token | NativeCurrency>,
      currencyAmountB: CurrencyAmount<Token | NativeCurrency>
    ) => {
      if (!address) return
      const amountADesired = jsbiToBigInt(currencyAmountA.quotient)
      const amountBDesired = jsbiToBigInt(currencyAmountB.quotient)

      const amountAMin = jsbiToBigInt(currencyAmountA.multiply(one.subtract(slippage)).quotient)
      const amountBMin = jsbiToBigInt(currencyAmountB.multiply(one.subtract(slippage)).quotient)

      writeContractAsync({
        abi: ROUTER_02_ABI,
        address: ROUTER_02_ADDRESS,
        functionName: 'addLiquidity',
        args: [
          currencyAmountA.currency.wrapped.address as Address,
          currencyAmountB.currency.wrapped.address as Address,
          amountADesired,
          amountBDesired,
          amountAMin,
          amountBMin,
          address as Address,
          BigInt(deadline)
        ]
      })
    },
    [address, deadline, writeContractAsync]
  )

  const removeLiquidity = useCallback(
    (tokenA: Token | NativeCurrency, tokenB: Token | NativeCurrency, liquidity: bigint) => {
      const { amountAMin, amountBMin } = getRemoveLiquidityMinAmounts({
        liquidity,
        reserveA,
        reserveB,
        totalSupply,
        slippage
      })
      writeContractAsync({
        abi: ROUTER_02_ABI,
        address: ROUTER_02_ADDRESS,
        functionName: 'removeLiquidity',
        args: [
          tokenA.wrapped.address as Address,
          tokenB.wrapped.address as Address,
          liquidity,
          amountAMin,
          amountBMin,
          address as Address,
          BigInt(deadline)
        ]
      })
    },
    [address, deadline, reserveA, reserveB, totalSupply, writeContractAsync]
  )

  return {
    liquidity,
    addLiquidity,
    removeLiquidity
  }
}
