import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount } from '@uniswap/sdk-core'
import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Address, formatUnits, parseUnits } from 'viem'
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi'

import { useApprove } from '@/features/hooks/useApprove'
import { useV2Context } from '@/features/v2/provider'
import { isUndefined } from '@/lib/utils'
import { waitForTransactionReceipt } from '@/reown'

import { TRANSFER_USDT_ABI } from '../abis'
import { TRANSFER_USDT_ADDRESS } from '../constants'

export const useUserTotalTransfer = () => {
  const { address } = useAppKitAccount()
  const { data, refetch } = useReadContract({
    abi: TRANSFER_USDT_ABI,
    address: TRANSFER_USDT_ADDRESS,
    functionName: 'getTotalTransferred',
    args: [address as Address],
    query: {
      enabled: !!address
    }
  })

  const userTotalTransfer = useMemo(() => {
    return data !== undefined ? formatUnits(data, 18) : undefined
  }, [data])

  return { userTotalTransfer, refetch }
}

export const useTransferInfo = () => {
  const { data, refetch } = useReadContracts({
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

  const transferInfo = useMemo(() => {
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
  }, [data])

  return {
    ...transferInfo,
    refetch
  }
}

export const useTransferUSDT = () => {
  const { writeContractAsync } = useWriteContract()

  const { tokenConfig } = useV2Context()

  const [loading, setLoading] = useState(false)
  const [transferValue, setTransferValue] = useState('')

  const { approve } = useApprove(
    TRANSFER_USDT_ADDRESS,
    tokenConfig && CurrencyAmount.fromRawAmount(tokenConfig.USDT, parseUnits(transferValue, 18).toString())
  )

  const transferUSDT = useCallback(
    async (amount: bigint) => {
      let txHash: Address

      setLoading(true)
      await approve()
      const toastId = toast.loading('Depositing Init LPTokens, please confirm in your wallet.')
      try {
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
    [approve, writeContractAsync]
  )

  return {
    loading,
    transferValue,
    setTransferValue,
    transferUSDT
  }
}
