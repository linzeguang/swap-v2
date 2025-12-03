import { Pair } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Address, parseUnits, zeroAddress } from 'viem'
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { jsbiToBigInt } from '@/features/utils'
import { wagmiAdapter, waitForTransactionReceipt } from '@/reown'

import { FACTORY_ABI, PAIR_ABI, ROUTER_02_ABI } from '../abis'
import { FACTORY_ADDRESS, ROUTER_02_ADDRESS } from '../constants'

export const usePair = ({
  tokenA,
  tokenB,
  amountA,
  amountB
}: {
  tokenA?: Currency
  tokenB?: Currency
  amountA?: string
  amountB?: string
}) => {
  const { address } = useAppKitAccount()
  const { writeContractAsync } = useWriteContract()

  const { data: pairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: tokenA && tokenB ? [tokenA.wrapped.address as Address, tokenB.wrapped.address as Address] : undefined,
    query: {
      enabled: !!(tokenA && tokenB)
    }
  })

  const { data: pairMeta, refetch: refreshPair } = useReadContracts({
    contracts: [
      {
        abi: PAIR_ABI,
        address: pairAddress as Address,
        functionName: 'totalSupply'
      },
      {
        abi: PAIR_ABI,
        address: pairAddress as Address,
        functionName: 'getReserves'
      }
    ],
    query: {
      enabled: !!pairAddress
    }
  })

  const [token0, token1] = useMemo(
    () => (tokenA && tokenB && tokenA.wrapped.sortsBefore(tokenB.wrapped) ? [tokenA, tokenB] : [tokenB, tokenA]),
    [tokenA, tokenB]
  )

  const [totalSupply, reserve0, reserve1] = useMemo(() => {
    if (!pairMeta) return []
    const [{ result: totalSupply }, { result: reserves }] = pairMeta
    return [totalSupply, reserves?.[0], reserves?.[1]]
  }, [pairMeta])

  const currencyAmountA = useMemo(
    () =>
      tokenA && Number(amountA)
        ? CurrencyAmount.fromRawAmount(tokenA, parseUnits(Number(amountA).toString(), tokenA.decimals).toString())
        : undefined,
    [amountA, tokenA]
  )

  const currencyAmountB = useMemo(
    () =>
      tokenB && Number(amountB)
        ? CurrencyAmount.fromRawAmount(tokenB, parseUnits(Number(amountB).toString(), tokenB.decimals).toString())
        : undefined,
    [amountB, tokenB]
  )

  const [mockPair, mockLiquidityMinted] = useMemo(() => {
    if (!currencyAmountA || !currencyAmountB) return []
    const pair = new Pair(currencyAmountA.wrapped, currencyAmountB.wrapped)
    const liquidityMinted = pair.getLiquidityMinted(
      CurrencyAmount.fromRawAmount(pair.liquidityToken, 0),
      currencyAmountA.wrapped,
      currencyAmountB.wrapped
    )
    return [pair, liquidityMinted]
  }, [currencyAmountA, currencyAmountB])

  const [pair, liquidityMinted] = useMemo(() => {
    if (!token0 || !token1 || !reserve0 || !reserve1) return []
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0.wrapped, reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1.wrapped, reserve1.toString())
    )
    let liquidityMinted
    if (currencyAmountA && currencyAmountB) {
      liquidityMinted = pair.getLiquidityMinted(
        CurrencyAmount.fromRawAmount(pair.liquidityToken, (totalSupply ?? 0n).toString()),
        currencyAmountA.wrapped,
        currencyAmountB.wrapped
      )
    }
    return [pair, liquidityMinted]
  }, [currencyAmountA, currencyAmountB, reserve0, reserve1, token0, token1, totalSupply])

  const [isCreated, isEmpty] = useMemo(() => {
    let isCreated = false,
      isEmpty = false
    if (pairAddress && pairAddress !== zeroAddress) isCreated = true
    if (reserve0 === 0n && reserve1 === 0n) isEmpty = true
    return [isCreated, isEmpty]
  }, [pairAddress, reserve0, reserve1])

  const { data: lpTokenBalance, refetch: refreshLpTokenBalance } = useReadContract({
    abi: PAIR_ABI,
    address: pair?.liquidityToken.address as Address,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !!(pair && address)
    }
  })

  const createPair = useCallback(async () => {
    if (!tokenA || !tokenB) return
    if (isCreated) return

    const toastId = toast.loading('Creating the pool, please confirm in your wallet.')
    try {
      const txHash = await writeContractAsync({
        abi: FACTORY_ABI,
        address: FACTORY_ADDRESS,
        functionName: 'createPair',
        args: [tokenA.wrapped.address as Address, tokenB.wrapped.address as Address]
      })
      toast.loading('Waiting for blockchain confirmation...', { id: toastId })
      await waitForTransactionReceipt(txHash)
      toast.success('Pool created successfully.', { id: toastId })
    } catch (error) {
      toast.error('Pool Creation Failed, Please Try Again Later.', { id: toastId })
      throw error
    }
  }, [isCreated, tokenA, tokenB, writeContractAsync])

  const getAmountOptimal = useCallback(
    async (currencyAmount?: CurrencyAmount<Currency>) => {
      if (!currencyAmount?.greaterThan(0)) return
      if (!pair) return
      const reserves: [bigint, bigint] = currencyAmount.wrapped.currency.equals(pair.token0)
        ? [jsbiToBigInt(pair.reserve0.quotient), jsbiToBigInt(pair.reserve1.quotient)]
        : [jsbiToBigInt(pair.reserve1.quotient), jsbiToBigInt(pair.reserve0.quotient)]
      const amountOptimal = await readContract(wagmiAdapter.wagmiConfig, {
        abi: ROUTER_02_ABI,
        address: ROUTER_02_ADDRESS,
        functionName: 'quote',
        args: [jsbiToBigInt(currencyAmount.quotient), ...reserves]
      })
      return amountOptimal
    },
    [pair]
  )

  return {
    isCreated,
    isEmpty,
    totalSupply: totalSupply ?? 0n,
    lpTokenBalance: lpTokenBalance ?? 0n,
    liquidityMinted: isEmpty ? mockLiquidityMinted : liquidityMinted,
    pair: isEmpty ? mockPair : pair,
    currencyAmountA,
    currencyAmountB,
    getAmountOptimal,
    refreshPair: () => {
      refreshPair()
      refreshLpTokenBalance()
    },
    createPair
  }
}
