import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { zeroAddress } from 'viem'

import { useApprove } from '@/features/hooks/useApprove'
import { useCurrency } from '@/features/hooks/useCurrency'
import { BNB, TOKEN_LIST } from '@/features/token/testnet/bsc'
import { areTokensIdentical } from '@/features/utils'
import { useCreatePair } from '@/features/v2/hooks/useFactory'
import { useAddLiquidity } from '@/features/v2/hooks/useLiquidity'
import { waitForTransactionReceipt } from '@/reown'

import { LiquidityAmountInput } from '../common/AmountInput'
import HalfMax from '../common/HalfMax'
import Settings from '../common/Settings'
import SubmitButton from '../common/SubmitButton'
import TokenBalance from '../common/TokenBalance'
import { Wallet } from '../svgr/icons'
import { Add, TopIcon } from '../svgr/pool'
import { Card, Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'
import Preview from './Preview'

enum TokenType {
  Input = 'Input',
  Output = 'Output'
}

const AddLiquidityForm: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isConnected } = useAppKitAccount()

  const {
    token: tokenA,
    currencyAmount: currencyAmountA,
    tokenBalanceRef: tokenABalanceRef,
    insufficientBalance: insufficientTokenABalance,
    setToken: setTokenA,
    setTokenBalance: setTokenABalance,
    setTokenAmount: setTokenAAmount
  } = useCurrency()
  const {
    token: tokenB,
    currencyAmount: currencyAmountB,
    tokenBalanceRef: tokenBBalanceRef,
    insufficientBalance: insufficientTokenBBalance,
    setToken: setTokenB,
    setTokenBalance: setTokenBBalance,
    setTokenAmount: setTokenBAmount
  } = useCurrency()

  const { isCreated, isEmpty, pairInfo, createPair } = useCreatePair(tokenA?.wrapped.address, tokenB?.wrapped.address)
  const { addLiquidity, spender } = useAddLiquidity()
  const { approve: approveInputCurrencyAmount } = useApprove(spender, currencyAmountA)
  const { approve: approveOutputCurrencyAmount } = useApprove(spender, currencyAmountB)

  useMemo(() => {
    if (currencyAmountA && currencyAmountB) {
      const pair = new Pair(
        CurrencyAmount.fromRawAmount(currencyAmountA.currency.wrapped, currencyAmountA.quotient),
        CurrencyAmount.fromRawAmount(currencyAmountB.currency.wrapped, currencyAmountB.quotient)
      )
      console.log('>>>>>> pair: ', pair)
    }
  }, [currencyAmountA, currencyAmountB])

  const initToken = useCallback(
    (tokenAddress: string | null, tokenType: TokenType) => {
      const token = TOKEN_LIST.find((token) => {
        if (tokenAddress === zeroAddress) {
          return token.isNative
        }
        return !token.isNative && token.wrapped.address === tokenAddress
      })
      if (tokenType === TokenType.Input) {
        setTokenA(token || BNB)
      } else {
        setTokenB(token)
      }
    },
    [setTokenA, setTokenB]
  )

  const refreshTokens = useCallback(() => {
    tokenABalanceRef.current?.refreshBalance()
    tokenBBalanceRef.current?.refreshBalance()
    setTokenAAmount(undefined)
    setTokenBAmount(undefined)
  }, [tokenABalanceRef, tokenBBalanceRef, setTokenAAmount, setTokenBAmount])

  const handleChangeToken = useCallback(
    (token: Currency, tokenType: TokenType) => {
      let [nextInputToken, nextOutputToken] = [tokenA, tokenB]
      if (tokenType === TokenType.Input) {
        if (areTokensIdentical(token, tokenA)) return
        nextInputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextOutputToken = tokenA
      } else {
        if (areTokensIdentical(token, tokenB)) return
        nextOutputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextInputToken = tokenB
      }

      setTokenA(nextInputToken)
      setTokenB(nextOutputToken)

      if (nextInputToken) {
        searchParams.set('tokenA', nextInputToken.isNative ? zeroAddress : nextInputToken.address)
      }
      if (nextOutputToken) {
        searchParams.set('tokenB', nextOutputToken.isNative ? zeroAddress : nextOutputToken.address)
      }
      setSearchParams(searchParams)
    },
    [tokenA, tokenB, searchParams, setTokenA, setTokenB, setSearchParams]
  )

  const handleAddLiquidity = useCallback(async () => {
    console.log('>>>>>> handleAddLiquidity: isCreated', isCreated)
    if (!currencyAmountA || !currencyAmountB) return
    const isInit = !isCreated || isEmpty
    if (!isCreated) {
      // 需要创建池子
      console.log('>>>>>> handleAddLiquidity: ', '需要创建池子')
      const createTxHash = await createPair()
      if (!createTxHash) return // 创建pair异常
      await waitForTransactionReceipt(createTxHash)
    }
    console.log('>>>>>> handleAddLiquidity: ', 'approve')
    await Promise.all([approveInputCurrencyAmount(), approveOutputCurrencyAmount()])
    const addTxHash = await addLiquidity(currencyAmountA, currencyAmountB, isInit)
    if (!addTxHash) return // 添加流动性异常
    await waitForTransactionReceipt(addTxHash)
    refreshTokens()
  }, [
    addLiquidity,
    approveInputCurrencyAmount,
    approveOutputCurrencyAmount,
    createPair,
    currencyAmountA,
    isCreated,
    isEmpty,
    currencyAmountB,
    refreshTokens
  ])

  useEffect(() => {
    const inputTokenAddress = searchParams.get('tokenA')
    const outputTokenAddress = searchParams.get('tokenB')

    initToken(inputTokenAddress, TokenType.Input)
    initToken(outputTokenAddress, TokenType.Output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative">
      <TopIcon className="absolute left-1/2 top-0 z-[1] -translate-x-1/2 -translate-y-[100px]" />
      <Card className="relative z-[2] space-y-6">
        <Flex className="items-center justify-between">
          <KanitText className="text-1.5xl">
            <Trans>Add Liquidity</Trans>
          </KanitText>
          <Settings />
        </Flex>
        <div className="space-y-2">
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={tokenA}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <TokenBalance ref={tokenABalanceRef} token={tokenA} onBalanceChange={setTokenABalance} />
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={(token) => handleChangeToken(token, TokenType.Input)}
            onChange={(ev) => setTokenAAmount(ev.target.value)}
          />
          <Add className="mx-auto text-icon" />
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={tokenB}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <TokenBalance ref={tokenBBalanceRef} token={tokenB} onBalanceChange={setTokenBBalance} />
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={(token) => handleChangeToken(token, TokenType.Output)}
            onChange={(ev) => setTokenBAmount(ev.target.value)}
          />
        </div>
        <Preview tokenA={tokenA} tokenB={tokenB} pairInfo={pairInfo} />
        <SubmitButton
          walletConnect={isConnected}
          insufficientBalance={insufficientTokenABalance || insufficientTokenBBalance}
          onClick={handleAddLiquidity}
        >
          <KanitText>
            <Trans>Add</Trans>
          </KanitText>
        </SubmitButton>
      </Card>
    </div>
  )
}

export default AddLiquidityForm
