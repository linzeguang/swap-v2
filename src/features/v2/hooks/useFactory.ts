import { useCallback, useMemo } from 'react'
import { Address, zeroAddress } from 'viem'
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi'

import { FACTORY_ABI, PAIR_ABI } from '../abis'
import { FACTORY_ADDRESS } from '../constants'

export const usePair = (pairAddress?: Address) => {
  const { data } = useReadContracts({
    contracts: [
      {
        abi: PAIR_ABI,
        address: pairAddress,
        functionName: 'totalSupply'
      },
      {
        abi: PAIR_ABI,
        address: pairAddress,
        functionName: 'getReserves'
      },
      {
        abi: PAIR_ABI,
        address: pairAddress,
        functionName: 'token0'
      },
      {
        abi: PAIR_ABI,
        address: pairAddress,
        functionName: 'token1'
      }
    ],
    query: {
      enabled: !!pairAddress
    }
  })

  return useMemo(() => {
    if (!data) return {}
    const [{ result: totalSupply }, { result: reserves }, { result: token0Address }, { result: token1Address }] = data
    if (!reserves || !token0Address || !token1Address) return {}
    const [reserve0, reserve1] = reserves
    const price0 = Number(reserve1) / Number(reserve0)
    const price1 = Number(reserve0) / Number(reserve1)

    return {
      totalSupply,
      price0,
      price1,
      reserves: {
        [token0Address]: reserve0,
        [token1Address]: reserve1
      }
    }
  }, [data])
}

export const useCreatePair = (tokenA?: string, tokenB?: string) => {
  const { writeContractAsync } = useWriteContract()

  const { data: pairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: tokenA && tokenB ? [tokenA as Address, tokenB as Address] : undefined,
    query: {
      enabled: !!(tokenA && tokenB)
    }
  })
  const { reserves } = usePair(pairAddress)

  const createPair = useCallback(async () => {
    if (!tokenA || !tokenB) return
    return await writeContractAsync({
      abi: FACTORY_ABI,
      address: FACTORY_ADDRESS,
      functionName: 'createPair',
      args: [tokenA as Address, tokenB as Address]
    })
  }, [tokenA, tokenB, writeContractAsync])

  return {
    pairAddress,
    isCreated: pairAddress && pairAddress !== zeroAddress,
    isEmpty: reserves && Object.values(reserves).some((reserve) => reserve !== 0n),
    createPair
  }
}
