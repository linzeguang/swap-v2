import { useMemo } from 'react'
import { Address } from 'viem'
import { useReadContracts } from 'wagmi'

import { PAIR_ABI } from '../abis'

export const usePair = (pairAddress: Address) => {
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
    ]
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
