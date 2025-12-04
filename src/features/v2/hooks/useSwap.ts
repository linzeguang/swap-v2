import { Pair, Route, Router, Trade } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

import { ROUTER_02_ABI } from '../abis'
import { ROUTER_02_ADDRESS } from '../constants'
import { useV2Context } from '../provider'

export const useRoute = (pairs: Pair[], input?: Currency, output?: Currency) =>
  useMemo(() => (input && output && pairs.length ? new Route(pairs, input, output) : undefined), [input, output, pairs])

export const useTrade = (route: Route<Currency, Currency>, amount: CurrencyAmount<Currency>, tradeType: TradeType) =>
  useMemo(() => new Trade(route, amount, tradeType), [amount, route, tradeType])

export const useSwap = () => {
  const { address } = useAppKitAccount()

  const { writeContractAsync } = useWriteContract()

  const { slippage, createDeadline } = useV2Context()

  const swap = useCallback(
    async (trade: Trade<Currency, Currency, TradeType>) => {
      if (!address) return

      const parameters = Router.swapCallParameters(trade, {
        allowedSlippage: slippage,
        deadline: Number(createDeadline()),
        recipient: address
      })
      console.log('>>>>>> parameters: ', parameters)

      const toastId = toast.loading('Swapping, please confirm in your wallet.')
      try {
        const txHash = await writeContractAsync({
          abi: ROUTER_02_ABI,
          address: ROUTER_02_ADDRESS,
          functionName: parameters.methodName as any,
          args: parameters.args as any,
          value: BigInt(parameters.value) as any
        })
        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        toast.success('Swap Successful.', { id: toastId })
      } catch (error) {
        toast.error('Swap Failed.', { id: toastId })
        throw error
      }
    },
    [address, createDeadline, slippage, writeContractAsync]
  )

  return { swap, spender: ROUTER_02_ADDRESS }
}
