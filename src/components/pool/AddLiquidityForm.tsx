import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import { Currency } from '@uniswap/sdk-core'
import React, { useCallback, useEffect } from 'react'
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
    token: inputToken,
    currencyAmount: inputCurrencyAmount,
    tokenBalanceRef: inputTokenBalanceRef,
    insufficientBalance: insufficientInputTokenBalance,
    setToken: setInputToken,
    setTokenBalance: setInputTokenBalance,
    setTokenAmount: setInputTokenAmount
  } = useCurrency()
  const {
    token: outputToken,
    currencyAmount: outputCurrencyAmount,
    tokenBalanceRef: outputTokenBalanceRef,
    insufficientBalance: insufficientOutputTokenBalance,
    setToken: setOutputToken,
    setTokenBalance: setOutputTokenBalance,
    setTokenAmount: setOutputTokenAmount
  } = useCurrency()

  const { isCreated, isEmpty, createPair } = useCreatePair(inputToken?.wrapped.address, outputToken?.wrapped.address)
  const { addLiquidity, spender } = useAddLiquidity()
  const { approve: approveInputCurrencyAmount } = useApprove(spender, inputCurrencyAmount)
  const { approve: approveOutputCurrencyAmount } = useApprove(spender, outputCurrencyAmount)

  const initToken = useCallback(
    (tokenAddress: string | null, tokenType: TokenType) => {
      const token = TOKEN_LIST.find((token) => {
        if (tokenAddress === zeroAddress) {
          return token.isNative
        }
        return !token.isNative && token.wrapped.address === tokenAddress
      })
      if (tokenType === TokenType.Input) {
        setInputToken(token || BNB)
      } else {
        setOutputToken(token)
      }
    },
    [setInputToken, setOutputToken]
  )

  const refreshTokens = useCallback(() => {
    inputTokenBalanceRef.current?.refreshBalance()
    outputTokenBalanceRef.current?.refreshBalance()
    setInputTokenAmount(undefined)
    setOutputTokenAmount(undefined)
  }, [inputTokenBalanceRef, outputTokenBalanceRef, setInputTokenAmount, setOutputTokenAmount])

  const handleChangeToken = useCallback(
    (token: Currency, tokenType: TokenType) => {
      let [nextInputToken, nextOutputToken] = [inputToken, outputToken]
      if (tokenType === TokenType.Input) {
        if (areTokensIdentical(token, inputToken)) return
        nextInputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextOutputToken = inputToken
      } else {
        if (areTokensIdentical(token, outputToken)) return
        nextOutputToken = token
        if (areTokensIdentical(nextInputToken, nextOutputToken)) nextInputToken = outputToken
      }

      setInputToken(nextInputToken)
      setOutputToken(nextOutputToken)

      if (nextInputToken) {
        searchParams.set('inputToken', nextInputToken.isNative ? zeroAddress : nextInputToken.address)
      }
      if (nextOutputToken) {
        searchParams.set('outputToken', nextOutputToken.isNative ? zeroAddress : nextOutputToken.address)
      }
      setSearchParams(searchParams)
    },
    [inputToken, outputToken, searchParams, setInputToken, setOutputToken, setSearchParams]
  )

  const handleAddLiquidity = useCallback(async () => {
    console.log('>>>>>> handleAddLiquidity: isCreated', isCreated)
    if (!inputCurrencyAmount || !outputCurrencyAmount) return
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
    const addTxHash = await addLiquidity(inputCurrencyAmount, outputCurrencyAmount, isInit)
    if (!addTxHash) return // 添加流动性异常
    await waitForTransactionReceipt(addTxHash)
    refreshTokens()
  }, [
    addLiquidity,
    approveInputCurrencyAmount,
    approveOutputCurrencyAmount,
    createPair,
    inputCurrencyAmount,
    isCreated,
    isEmpty,
    outputCurrencyAmount,
    refreshTokens
  ])

  useEffect(() => {
    const inputTokenAddress = searchParams.get('inputToken')
    const outputTokenAddress = searchParams.get('outputToken')

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
            token={inputToken}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <TokenBalance
                      ref={inputTokenBalanceRef}
                      token={inputToken}
                      onBalanceChange={setInputTokenBalance}
                    />
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={(token) => handleChangeToken(token, TokenType.Input)}
            onChange={(ev) => setInputTokenAmount(ev.target.value)}
          />
          <Add className="mx-auto text-icon" />
          <LiquidityAmountInput
            title={<Trans>Add Liquidity</Trans>}
            token={outputToken}
            suffixNode={
              <Flex className="items-center justify-between">
                <Flex className="space-x-2">
                  <KanitText variant={'tertiary'} className="flex items-center space-x-2">
                    <Wallet />
                    <TokenBalance
                      ref={outputTokenBalanceRef}
                      token={outputToken}
                      onBalanceChange={setOutputTokenBalance}
                    />
                  </KanitText>
                  <HalfMax />
                </Flex>
                <KanitText>usd balance</KanitText>
              </Flex>
            }
            onTokenSelect={(token) => handleChangeToken(token, TokenType.Output)}
            onChange={(ev) => setOutputTokenAmount(ev.target.value)}
          />
        </div>
        <Preview />
        <SubmitButton
          walletConnect={isConnected}
          insufficientBalance={insufficientInputTokenBalance || insufficientOutputTokenBalance}
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
