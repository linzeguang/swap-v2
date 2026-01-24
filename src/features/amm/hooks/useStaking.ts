import { useAppKitAccount } from '@reown/appkit/react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Address, formatUnits } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

import { waitForTransactionReceipt } from '@/reown'

import { STAKING_ABI } from '../abis'
import { STAKING_ADDRESS } from '../constants'

export const useStakingUserInfo = () => {
  const { address } = useAppKitAccount()
  const { data: userInfo } = useReadContract({
    abi: STAKING_ABI,
    address: STAKING_ADDRESS,
    functionName: 'getUserInfo',
    args: [address as Address],
    query: {
      enabled: !!address
    }
  })

  return useMemo(() => {
    if (!userInfo) return
    const [
      totalDividends,
      totalLpTokensTracked,
      usdtInvested,
      usdtReturned,
      usdtEstimated,
      lpTokensInit,
      lpTokens,
      claimedDividends,
      pendingDividends
    ] = userInfo

    return {
      totalDividends: formatUnits(totalDividends, 18), // 全网的总分红USDT数量
      totalLpTokensTracked: formatUnits(totalLpTokensTracked, 18), // 全网质押的LP数量
      usdtInvested: formatUnits(usdtInvested, 18), // 用户共建底池的USDT数量
      usdtReturned: formatUnits(usdtReturned, 18), // 用户赎回共建底池LP后得到的USDT
      usdtEstimated: formatUnits(usdtEstimated, 18), // 用户赎回USDT前，得到USDT的预估值
      lpTokensInit: formatUnits(lpTokensInit, 18), // 用户共建底池LP数量
      lpTokens: formatUnits(lpTokens, 18), // 用户质押的LP数量（包括共建底池LP）
      claimedDividends: formatUnits(claimedDividends, 18), // 用户累计已领取的USDT分红
      pendingDividends: formatUnits(pendingDividends, 18) // 用户待领取的USDT分红
    }
  }, [userInfo])
}

// 领取分红
export const useClaimDividends = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)

  const claimDividends = useCallback(async () => {
    let txHash: Address
    const toastId = toast.loading('Claiming dividends, please confirm in your wallet.')
    try {
      setLoading(true)
      txHash = await writeContractAsync({
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'claimDividends'
      })

      toast.loading('Waiting for blockchain confirmation...', { id: toastId })
      await waitForTransactionReceipt(txHash)
      setLoading(false)
      toast.success('Claim Successful.', { id: toastId })
    } catch (error) {
      setLoading(false)
      toast.error('Claim Failed.', { id: toastId })
      throw error
    }
  }, [writeContractAsync])

  return {
    loading,
    claimDividends
  }
}

// 赎回共建池的LP
export const useWithdrawInitLPTokens = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)

  const withdrawInitLPTokens = useCallback(async () => {
    let txHash: Address
    const toastId = toast.loading('Withdrawing Init LPTokens, please confirm in your wallet.')
    try {
      setLoading(true)
      txHash = await writeContractAsync({
        abi: STAKING_ABI,
        address: STAKING_ADDRESS,
        functionName: 'withdrawInitLPTokens'
      })

      toast.loading('Waiting for blockchain confirmation...', { id: toastId })
      await waitForTransactionReceipt(txHash)
      setLoading(false)
      toast.success('Withdraw Successful.', { id: toastId })
    } catch (error) {
      setLoading(false)
      toast.error('Withdraw Failed.', { id: toastId })
      throw error
    }
  }, [writeContractAsync])

  return {
    loading,
    withdrawInitLPTokens
  }
}

// 赎回正常质押的LP
export const useWithdrawLPTokens = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)
  const [withdrawValue, setWithdrawValue] = useState('')

  const withdrawLPTokens = useCallback(
    async (lpTokens: bigint) => {
      let txHash: Address
      const toastId = toast.loading('Withdrawing Init LPTokens, please confirm in your wallet.')
      try {
        setLoading(true)
        txHash = await writeContractAsync({
          abi: STAKING_ABI,
          address: STAKING_ADDRESS,
          functionName: 'withdrawLPTokens',
          args: [lpTokens]
        })

        toast.loading('Waiting for blockchain confirmation...', { id: toastId })
        await waitForTransactionReceipt(txHash)
        setLoading(false)
        toast.success('Withdraw Successful.', { id: toastId })
      } catch (error) {
        setLoading(false)
        toast.error('Withdraw Failed.', { id: toastId })
        throw error
      }
    },
    [writeContractAsync]
  )

  return {
    loading,
    withdrawValue,
    setWithdrawValue,
    withdrawLPTokens
  }
}

// 质押LP
export const useDepositLPTokens = () => {
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)
  const [depositValue, setDepositValue] = useState('')

  const depositLPTokens = useCallback(
    async (lpTokens: bigint) => {
      let txHash: Address
      const toastId = toast.loading('Depositing Init LPTokens, please confirm in your wallet.')
      try {
        setLoading(true)
        txHash = await writeContractAsync({
          abi: STAKING_ABI,
          address: STAKING_ADDRESS,
          functionName: 'depositLPTokens',
          args: [lpTokens]
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
    depositValue,
    setDepositValue,
    depositLPTokens
  }
}
