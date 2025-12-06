import { Trans } from '@lingui/react/macro'
import { Currency } from '@uniswap/sdk-core'
import { useAtomValue } from 'jotai/react'
import React, { ComponentPropsWithRef, useCallback, useMemo, useState } from 'react'
import { zeroAddress } from 'viem'

import { useV2Context } from '@/features/v2/provider'
import { cn } from '@/lib/utils'
import { tokenListAtom } from '@/stores/trade'

import { ArrowDown } from '../svgr/icons'
import { Flex, Grid } from '../ui/Box'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { KanitText } from '../ui/Text'
import TokenBalance from './TokenBalance'
import TokenImage from './TokenImage'

const TokenSelect: React.FC<{
  token?: Currency
  tokenList?: Currency[]
  onTokenSelect?: (token: Currency) => void
  dialogProps?: ComponentPropsWithRef<typeof Dialog>
}> = ({ token, tokenList, onTokenSelect, dialogProps }) => {
  const { tokenConfig } = useV2Context()
  const asyncTokenList = useAtomValue(tokenListAtom)
  const [open, setOpen] = useState(false)

  const lastTokenList = useMemo(() => {
    if (tokenList) return tokenList
    return [...(tokenConfig?.TOKEN_LIST || []), ...asyncTokenList]
  }, [asyncTokenList, tokenConfig?.TOKEN_LIST, tokenList])

  const handleTokenSelect = useCallback(
    (token: Currency) => {
      onTokenSelect?.(token)
      setOpen(false)
    },
    [onTokenSelect]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={<Trans>Token Select</Trans>}
      trigger={{
        asChild: true,
        children: (
          <Button className={cn(token ? 'lg:px-2' : 'lg:px-4', 'space-x-2 px-2')} size={'lg'} variant={'default'}>
            {token ? (
              <>
                <TokenImage token={token} className="size-6 lg:size-7" />
                <KanitText className="font-semibold text-text-primary lg:text-xl">{token.symbol}</KanitText>
                <ArrowDown />
              </>
            ) : (
              <Flex className="items-center">
                <KanitText className="text-base font-semibold text-text-primary">
                  <Trans>Select Token</Trans>
                </KanitText>
                {/* <ArrowDown /> */}
              </Flex>
            )}
          </Button>
        )
      }}
      {...dialogProps}
      content={{
        className: cn(
          'max-w-[420px] h-[80vh] max-h-[654px] grid grid-rows-[auto_auto_auto_1fr] gap-3',
          dialogProps?.content?.className
        ),
        ...dialogProps?.content
      }}
    >
      <Input border placeholder="Search name /address" />
      <div className="space-y-3">
        <KanitText variant={'primary'}>
          <Trans>Popular Tokens</Trans>
        </KanitText>
        <Flex className="space-x-1.5">
          {tokenConfig?.POPULAR_TOKENS.map((token) => (
            <Button
              key={token.isNative ? zeroAddress : token.wrapped.address}
              variant={'radio'}
              className="h-[38px] px-2"
            >
              <TokenImage token={token} />

              <KanitText>{token.symbol}</KanitText>
            </Button>
          ))}
        </Flex>
      </div>
      <div className="space-y-1 overflow-y-scroll">
        {lastTokenList.map((token) => (
          <Grid
            key={token.isNative ? zeroAddress : token.address}
            className="cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-3xl p-2 pr-4 hover:bg-input-bg"
            onClick={() => handleTokenSelect(token)}
          >
            <TokenImage token={token} className="size-10" />
            <div className="flex-1 space-y-1">
              <KanitText className="text-lg leading-none text-text-primary">{token.symbol}</KanitText>
              <KanitText variant={'tertiary'} className="text-sm leading-none">
                {token.name}
              </KanitText>
            </div>
            <TokenBalance token={token} />
          </Grid>
        ))}
      </div>
    </Dialog>
  )
}

export default TokenSelect
