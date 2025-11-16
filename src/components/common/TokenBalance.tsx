import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, NativeCurrency, Token } from '@uniswap/sdk-core'
import React, { useMemo } from 'react'
import { Address } from 'viem'
import { useBalance } from 'wagmi'

import { UI_DECIMALS } from '@/features/v2/constants'

import { Loading } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

const TokenBalance: React.FC<{ token: Currency }> = ({ token }) => {
  const { address } = useAppKitAccount()
  const { data, isFetching, refetch } = useBalance({
    address: address as Address,
    token: token.isNative ? undefined : (token.wrapped.address as Address),
    query: {
      enabled: !!address
    }
  })
  const currencyAmount = useMemo(() => {
    return data && CurrencyAmount.fromRawAmount(token, data.value.toString())
  }, [data, token])

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
}

export default TokenBalance
