import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { Address, erc20Abi } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

import { jsbiToBigInt } from '../../utils'
import { ROUTER_02_ABI } from '../abis'
import { ONE, ROUTER_02_ADDRESS } from '../constants'
import { useV2Context } from '../provider'
import { getRemoveLiquidityMinAmounts } from '../utils'

export const useRemoveLiquidity = (pairAddress: Address, reserveA: bigint, reserveB: bigint, totalSupply: bigint) => {
  const { address } = useAppKitAccount()
  const { slippage, createDeadline } = useV2Context()
  const { writeContractAsync } = useWriteContract()

  const liquidity = useReadContract({
    address: pairAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !!address
    }
  })

  const removeLiquidity = useCallback(
    async (tokenA: Token | NativeCurrency, tokenB: Token | NativeCurrency, liquidity: bigint) => {
      const { amountAMin, amountBMin } = getRemoveLiquidityMinAmounts({
        liquidity,
        reserveA,
        reserveB,
        totalSupply,
        slippage
      })
      const currencyAmountAMin = CurrencyAmount.fromRawAmount(tokenA, amountAMin.toString())
      const currencyAmountBMin = CurrencyAmount.fromRawAmount(tokenB, amountAMin.toString())

      let txHash: Address
      if (currencyAmountAMin.currency.isNative || currencyAmountBMin.currency.isNative) {
        const [nativeAmountMin, tokenAmountMin] = currencyAmountAMin.currency.isNative
          ? [currencyAmountAMin, currencyAmountBMin]
          : [currencyAmountBMin, currencyAmountAMin]
        const amountTokenMin = jsbiToBigInt(tokenAmountMin.quotient)
        const amountETHMin = jsbiToBigInt(nativeAmountMin.quotient)

        txHash = await writeContractAsync({
          abi: ROUTER_02_ABI,
          address: ROUTER_02_ADDRESS,
          functionName: 'removeLiquidityETH',
          args: [
            tokenAmountMin.currency.wrapped.address as Address,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address as Address,
            createDeadline()
          ]
        })
      } else {
        txHash = await writeContractAsync({
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
            createDeadline()
          ]
        })
      }
      console.log('>>>>>> txHash: ', txHash)
    },
    [address, createDeadline, reserveA, reserveB, slippage, totalSupply, writeContractAsync]
  )

  return {
    liquidity,
    removeLiquidity
  }
}

export const useAddLiquidity = () => {
  const { address } = useAppKitAccount()
  const { slippage, createDeadline } = useV2Context()
  const { writeContractAsync } = useWriteContract()

  const addLiquidity = useCallback(
    async (
      currencyAmountA: CurrencyAmount<Token | NativeCurrency>,
      currencyAmountB: CurrencyAmount<Token | NativeCurrency>,
      isInit?: boolean
    ) => {
      if (!address) return

      let txHash: Address

      const toastId = toast.loading('Adding Liquidity, please confirm in your wallet.')
      try {
        if (currencyAmountA.currency.isNative || currencyAmountB.currency.isNative) {
          const [nativeAmount, tokenAmount] = currencyAmountA.currency.isNative
            ? [currencyAmountA, currencyAmountB]
            : [currencyAmountB, currencyAmountA]
          const amountTokenDesired = jsbiToBigInt(tokenAmount.quotient)
          const amountTokenMin = isInit ? 0n : jsbiToBigInt(tokenAmount.multiply(ONE.subtract(slippage)).quotient)
          const amountETHMin = isInit ? 0n : jsbiToBigInt(nativeAmount.multiply(ONE.subtract(slippage)).quotient)

          txHash = await writeContractAsync({
            abi: ROUTER_02_ABI,
            address: ROUTER_02_ADDRESS,
            functionName: 'addLiquidityETH',
            args: [
              tokenAmount.currency.wrapped.address as Address,
              amountTokenDesired,
              amountTokenMin,
              amountETHMin,
              address as Address,
              createDeadline()
            ],
            value: BigInt(nativeAmount.quotient.toString())
          })
        } else {
          const amountADesired = jsbiToBigInt(currencyAmountA.quotient)
          const amountBDesired = jsbiToBigInt(currencyAmountB.quotient)
          const amountAMin = isInit ? 0n : jsbiToBigInt(currencyAmountA.multiply(ONE.subtract(slippage)).quotient)
          const amountBMin = isInit ? 0n : jsbiToBigInt(currencyAmountB.multiply(ONE.subtract(slippage)).quotient)

          console.log('>>>>>> addLiquidity: ', [
            currencyAmountA.currency.wrapped.address as Address,
            currencyAmountB.currency.wrapped.address as Address,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            address as Address,
            createDeadline()
          ])
          txHash = await writeContractAsync({
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
              createDeadline()
            ]
          })
        }
        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        toast.success('Add Liquidity Successful.', { id: toastId })
      } catch (error) {
        toast.error('Add Liquidity Failed.', { id: toastId })
        throw error
      }
    },
    [address, createDeadline, slippage, writeContractAsync]
  )

  return {
    addLiquidity,
    spender: ROUTER_02_ADDRESS
  }
}
