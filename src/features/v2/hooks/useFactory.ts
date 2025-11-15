import { useCallback } from 'react'
import { Address } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { FACTORY_ABI } from '../abis'
import { FACTORY_ADDRESS } from '../constants'

export const useCreatePair = () => {
  const { writeContractAsync } = useWriteContract()

  const createPair = useCallback(
    async (tokenA: Address, tokenB: Address) => {
      return await writeContractAsync({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        functionName: 'createPair',
        args: [tokenA, tokenB]
      })
    },
    [writeContractAsync]
  )

  return createPair
}

export const useGetPair = (tokenA: Address, tokenB: Address) =>
  useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: [tokenA, tokenB]
  })
