import { useAppKitAccount } from '@reown/appkit/react'
import { useCallback, useMemo } from 'react'
import { Address, zeroAddress } from 'viem'
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi'

import { FACTORY_ABI, PAIR_ABI } from '../abis'
import { FACTORY_ADDRESS } from '../constants'

export type PairInfo = {
  pairAddress?: string
  totalSupply?: bigint
  balanceOfLPToken?: bigint
  decimals?: number
  price0?: number
  price1?: number
  reserves?: {
    [x: string]: bigint
  }
  isEmpty?: boolean
}

export const usePair = (pairAddress?: Address) => {
  const { address } = useAppKitAccount()
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
        functionName: 'decimals'
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
      },
      {
        abi: PAIR_ABI,
        address: pairAddress,
        functionName: 'balanceOf',
        args: [address as Address]
      }
    ],
    query: {
      enabled: !!pairAddress
    }
  })

  return useMemo<PairInfo | undefined>(() => {
    if (!data) return
    const [
      { result: totalSupply },
      { result: decimals },
      { result: reserves },
      { result: token0Address },
      { result: token1Address },
      { result: balanceOfLPToken }
    ] = data
    if (!reserves || !token0Address || !token1Address) return
    const [reserve0, reserve1] = reserves
    const price0 = Number(reserve1) / Number(reserve0)
    const price1 = Number(reserve0) / Number(reserve1)

    return {
      pairAddress,
      totalSupply,
      balanceOfLPToken,
      decimals,
      price0,
      price1,
      reserves: {
        [token0Address]: reserve0,
        [token1Address]: reserve1
      },
      isEmpty: reserve0 === 0n && reserve1 === 0n
    }
  }, [data, pairAddress])
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
  const pairInfo = usePair(pairAddress)

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
    isEmpty: pairInfo?.isEmpty,
    pairInfo,
    createPair
  }
}
