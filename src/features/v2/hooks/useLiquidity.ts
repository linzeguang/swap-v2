import { Pair } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

import { jsbiToBigInt } from '../../utils'
import { ROUTER_02_ABI } from '../abis'
import { ONE, ROUTER_02_ADDRESS } from '../constants'
import { useV2Context } from '../provider'
import { getRemoveLiquidityMinAmounts } from '../utils'

export const useRemoveLiquidity = (pair: Pair, totalSupply: bigint) => {
  const { address } = useAppKitAccount()
  const { slippage, createDeadline } = useV2Context()
  const { writeContractAsync } = useWriteContract()

  const removeLiquidity = useCallback(
    async (liquidity: bigint) => {
      const { amount0Min, amount1Min } = getRemoveLiquidityMinAmounts({
        liquidity,
        reserve0: jsbiToBigInt(pair.reserve0.quotient),
        reserve1: jsbiToBigInt(pair.reserve1.quotient),
        totalSupply,
        slippage
      })
      const currencyAmount0Min = CurrencyAmount.fromRawAmount(pair.token0, amount0Min.toString())
      const currencyAmount1Min = CurrencyAmount.fromRawAmount(pair.token1, amount1Min.toString())

      let txHash: Address
      const toastId = toast.loading('Removing Liquidity, please confirm in your wallet.')
      try {
        if (currencyAmount0Min.currency.isNative || currencyAmount1Min.currency.isNative) {
          const [nativeAmountMin, tokenAmountMin] = currencyAmount0Min.currency.isNative
            ? [currencyAmount0Min, currencyAmount1Min]
            : [currencyAmount1Min, currencyAmount0Min]
          const amountTokenMin = jsbiToBigInt(tokenAmountMin.quotient)
          const amountETHMin = jsbiToBigInt(nativeAmountMin.quotient)

          console.log('>>>>>> removeLiquidityETH: ', [
            tokenAmountMin.currency.wrapped.address as Address,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address as Address,
            createDeadline()
          ])
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
          console.log('>>>>>> removeLiquidity: ', [
            pair.token0.wrapped.address as Address,
            pair.token1.wrapped.address as Address,
            liquidity,
            amount0Min,
            amount1Min,
            address as Address,
            createDeadline()
          ])
          txHash = await writeContractAsync({
            abi: ROUTER_02_ABI,
            address: ROUTER_02_ADDRESS,
            functionName: 'removeLiquidity',
            args: [
              pair.token0.wrapped.address as Address,
              pair.token1.wrapped.address as Address,
              liquidity,
              amount0Min,
              amount1Min,
              address as Address,
              createDeadline()
            ]
          })
        }

        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        toast.success('Remove Liquidity Successful.', { id: toastId })
      } catch (error) {
        toast.error('Remove Liquidity Failed.', { id: toastId })
        throw error
      }
    },
    [address, createDeadline, pair, slippage, totalSupply, writeContractAsync]
  )

  return {
    removeLiquidity,
    spender: ROUTER_02_ADDRESS
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

          console.log('>>>>>> addLiquidityETH: ', [
            tokenAmount.currency.wrapped.address as Address,
            amountTokenDesired,
            amountTokenMin,
            amountETHMin,
            address as Address,
            createDeadline()
          ])
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
