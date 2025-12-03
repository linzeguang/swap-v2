import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { Address, erc20Abi } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

import { jsbiToBigInt } from '../utils'

export const useAllowance = (spender: string, tokenAddress?: string) => {
  const { address } = useAppKitAccount()
  return useReadContract({
    abi: erc20Abi,
    address: tokenAddress as Address,
    functionName: 'allowance',
    args: [address as Address, spender as Address],
    query: {
      enabled: !!(address && tokenAddress)
    }
  })
}

export const useApprove = (spender: string, currencyAmount?: CurrencyAmount<Currency>) => {
  const { writeContractAsync } = useWriteContract()
  const { data: allowance, refetch: refetchAllowance } = useAllowance(spender, currencyAmount?.currency.wrapped.address)

  const approve = useCallback(async () => {
    if (!currencyAmount) throw new Error('CurrencyAmount Error')
    if (currencyAmount.currency.isNative) return
    if (allowance === undefined) throw new Error('Allowance Error')

    if (currencyAmount.greaterThan(allowance.toString())) {
      const toastId = toast.loading('Approving, please confirm in your wallet.')
      try {
        const txHash = await writeContractAsync({
          abi: erc20Abi,
          address: currencyAmount.currency.wrapped.address as Address,
          functionName: 'approve',
          args: [spender as Address, jsbiToBigInt(currencyAmount.quotient)]
        })
        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        toast.success('Approval Successful', { id: toastId })
        refetchAllowance()
      } catch (error) {
        toast.error('Approval Failed', { id: toastId })
        throw error
      }
    }
  }, [allowance, currencyAmount, refetchAllowance, spender, writeContractAsync])

  return {
    approve,
    allowance
  }
}
