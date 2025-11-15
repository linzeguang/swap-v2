import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'

import { ROUTER_02_ABI } from '../abis'
import { ROUTER_02_ADDRESS } from '../constants'

const slippage = 0.005 // 默认 0.5%
const deadlineMinutes = 10

export const useAddLiquidity = () => {
  const { address } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract()

  const addLiquidity = useCallback(
    (currencyAmountA: CurrencyAmount<Token>, currencyAmountB: CurrencyAmount<Token>) => {
      if (!address) return
      const amountADesired = currencyAmountA.quotient
      const amountBDesired = currencyAmountB.quotient

      const amountAMin = currencyAmountA.multiply(1 - slippage).quotient
      const amountBMin = currencyAmountB.multiply(1 - slippage).quotient

      const deadline = Math.floor(Date.now() / 1000) + 60 * deadlineMinutes // 10分钟后过期

      writeContractAsync({
        abi: ROUTER_02_ABI,
        address: ROUTER_02_ADDRESS,
        functionName: 'addLiquidity',
        args: [
          currencyAmountA.currency.address as Address,
          currencyAmountB.currency.address as Address,
          amountADesired,
          amountBDesired,
          amountAMin,
          amountBMin,
          address,
          deadline
        ]
      })
    },
    [address, writeContractAsync]
  )
}
