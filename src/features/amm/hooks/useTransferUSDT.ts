import { useAppKitAccount } from '@reown/appkit/react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Address, formatUnits } from 'viem'
import { useBlock, useReadContract, useReadContracts, useWriteContract } from 'wagmi'

import { isUndefined } from '@/lib/utils'
import { waitForTransactionReceipt } from '@/reown'

import { TRANSFER_USDT_ABI } from '../abis'
import { TRANSFER_USDT_ADDRESS } from '../constants'
import BigNumber from 'bignumber.js'

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

    return {
      totalTransferredAmount: !isUndefined(totalTransferredAmount)
        ? formatUnits(totalTransferredAmount, 18)
        : undefined,
      maxTotalTransferAmount: !isUndefined(maxTotalTransferAmount)
        ? formatUnits(maxTotalTransferAmount, 18)
        : undefined,
      maxDepositAmount:
        !isUndefined(maxTotalTransferAmount) && !isUndefined(totalTransferredAmount)
          ? formatUnits(maxTotalTransferAmount - totalTransferredAmount, 18)
          : undefined,
      percentage:
        !isUndefined(maxTotalTransferAmount) && !isUndefined(totalTransferredAmount)
          ? new BigNumber(Number(totalTransferredAmount))
              .dividedBy(Number(maxTotalTransferAmount))
              .multipliedBy(100)
              .toFixed(2)
          : undefined,
      endBlock: Number(endBlock)
    }
  }, [currentBlock, data])
}

export const useTransferUSDT = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)
  const [transferValue, setTransferValue] = useState('')

  const transferUSDT = useCallback(
    async (amount: bigint) => {
      let txHash: Address
      const toastId = toast.loading('Depositing Init LPTokens, please confirm in your wallet.')
      try {
        setLoading(true)
        txHash = await writeContractAsync({
          abi: TRANSFER_USDT_ABI,
          address: TRANSFER_USDT_ADDRESS,
          functionName: 'transferUSDT',
          args: [amount]
        })

        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        setLoading(false)
        toast.success('Deposit Successful.', { id: toastId })
      } catch (error) {
        setLoading(false)
        toast.error('Deposit Failed.', { id: toastId })
        throw error
      }
    },
    [writeContractAsync]
  )

  return {
    loading,
    transferValue,
    setTransferValue,
    transferUSDT
  }
}
