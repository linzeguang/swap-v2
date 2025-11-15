import { useAppKitAccount } from '@reown/appkit/react'
import { useCallback } from 'react'
import { Address, erc20Abi } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

export const useAllowance = (tokenAddress: string, spender: string) => {
  const { address } = useAppKitAccount()
  return useReadContract({
    abi: erc20Abi,
    address: tokenAddress as Address,
    functionName: 'allowance',
    args: [address as Address, spender as Address],
    query: {
      enabled: !!address
    }
  })
}

export const useApprove = (tokenAddress: string, spender: string) => {
  const { writeContractAsync } = useWriteContract()
  const { data: allowance, refetch: refetchAllowance } = useAllowance(tokenAddress, spender)

  const approve = useCallback(
    async (amount: bigint) => {
      if (allowance === undefined) throw new Error('Allowance Error')

      if (allowance < amount) {
        const txHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress as Address,
          functionName: 'approve',
          args: [spender as Address, amount]
        })
        await waitForTransactionReceipt(txHash)
        refetchAllowance()
      }
    },
    [allowance, refetchAllowance, spender, tokenAddress, writeContractAsync]
  )

  return {
    approve,
    allowance
  }
}
