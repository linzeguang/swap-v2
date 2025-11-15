import { useMemo } from 'react'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { PAIR_ABI } from '../abis'

export const usePair = (pairAddress: Address) => {
  const { data: reserves } = useReadContract({
    abi: PAIR_ABI,
    address: pairAddress,
    functionName: 'getReserves'
  })

  return useMemo(() => {
    if (!reserves) return {}
    const [reserve0, reserve1] = reserves
    const price0 = Number(reserve1) / Number(reserve0)
    const price1 = Number(reserve0) / Number(reserve1)

    return { price0, price1, reserve0, reserve1 }
  }, [reserves])
}
