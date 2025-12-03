import { useAppKitAccount } from '@reown/appkit/react'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import { Address } from 'viem'
import { useBalance } from 'wagmi'

import { UI_DECIMALS } from '@/features/v2/constants'

import { Loading } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

export type Balance = { decimals: number; formatted: string; symbol: string; value: bigint }

const TokenBalance = React.forwardRef<
  {
    refreshBalance: () => void
  },
  {
    token?: Currency
    onBalanceChange?: (currencyAmount?: CurrencyAmount<Currency>) => void
  }
>(({ token, onBalanceChange }, ref) => {
  const { address } = useAppKitAccount()
  const { data, isFetching, refetch } = useBalance({
    address: address as Address,
    token: !token || token.isNative ? undefined : (token.wrapped.address as Address),
    query: {
      enabled: !!address
    }
  })
  const currencyAmount = useMemo(
    () => token && data && CurrencyAmount.fromRawAmount(token, data.value.toString()),
    [data, token]
  )

  useImperativeHandle(ref, () => ({ refreshBalance: refetch }), [refetch])

  useEffect(() => {
    onBalanceChange?.(currencyAmount)
  }, [currencyAmount, onBalanceChange])

  return (
    <Flex
      className="cursor-pointer items-center space-x-1"
      onClick={(ev) => {
        ev.stopPropagation()
        refetch()
      }}
    >
      <KanitText className="leading-none">
        {currencyAmount
          ? currencyAmount.toSignificant(currencyAmount.currency.isNative ? UI_DECIMALS.Native : UI_DECIMALS.Token)
          : isFetching
            ? ''
            : '--'}
      </KanitText>
      {isFetching && <Loading className="size-4" />}
    </Flex>
  )
})

export default TokenBalance
