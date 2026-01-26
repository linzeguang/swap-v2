import { useAppKitAccount } from '@reown/appkit/react'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useBlock, useReadContract, useReadContracts } from 'wagmi'

import { TRANSFER_USDT_ABI } from '../abis'
import { TRANSFER_USDT_ADDRESS } from '../constants'

export const useUserTotalTransfer = () => {
  const { address } = useAppKitAccount()
  const { data } = useReadContract({
    abi: TRANSFER_USDT_ABI,
    address: TRANSFER_USDT_ADDRESS,
    functionName: 'getTotalTransferred',
    args: [address as Address],
    query: {
      enabled: !!address
    }
  })

  return useMemo(() => {
    return data !== undefined ? formatUnits(data, 18) : undefined
  }, [data])
}

export const useTransferInfo = () => {
  const { data: currentBlock } = useBlock({
    watch: true
  })
  const { data } = useReadContracts({
    contracts: [
      {
        abi: TRANSFER_USDT_ABI,
        address: TRANSFER_USDT_ADDRESS,
        functionName: 'getTotalTransferredAmount'
      },
      {
        abi: TRANSFER_USDT_ABI,
        address: TRANSFER_USDT_ADDRESS,
        functionName: 'getMaxTotalTransferAmount'
      },
      {
        abi: TRANSFER_USDT_ABI,
        address: TRANSFER_USDT_ADDRESS,
        functionName: 'endBlock'
      }
    ]
  })

  return useMemo(() => {
    if (!data) return {}
    const [{ result: totalTransferredAmount }, { result: maxTotalTransferAmount }, { result: endBlock }] = data

    console.log(
      '>>>>>> currentBlock: ',
      currentBlock?.number,
      endBlock,
      currentBlock?.number && endBlock && endBlock - currentBlock?.number
    )

    return {
      totalTransferredAmount: totalTransferredAmount && formatUnits(totalTransferredAmount, 18),
      maxTotalTransferAmount: maxTotalTransferAmount && formatUnits(maxTotalTransferAmount, 18),
      endBlock: Number(endBlock)
    }
  }, [currentBlock, data])
}
