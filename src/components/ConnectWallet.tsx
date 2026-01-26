import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import React, { useCallback } from 'react'

import { useV2Context } from '@/features/v2/provider'
import { useCopy } from '@/hooks/useCopy'
import { formatAddress } from '@/lib/format'

import TokenBalance from './common/TokenBalance'
import TokenImage from './common/TokenImage'
import { ArrowDown, Copy, Exit } from './svgr/icons'
import { Flex } from './ui/Box'
import { Button } from './ui/Button'
import { Dialog } from './ui/Dialog'
import { KanitText } from './ui/Text'

const CopyAddress: React.FC = () => {
  const { address } = useAppKitAccount()
  const { buttonRef } = useCopy(address || '')

  return (
    <button ref={buttonRef}>
      <Copy />
    </button>
  )
}

const ConnectWallet: React.FC = () => {
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const { open } = useAppKit()

  const { tokenConfig } = useV2Context()

  const connect = useCallback(() => {
    open({ view: 'Connect' })
  }, [open])

  if (!isConnected)
    return (
      <Button variant={'gradient'} size={'lg'} onClick={connect}>
        <KanitText>
          <Trans>Connect Wallet</Trans>
        </KanitText>
      </Button>
    )

  // return (
  //   <Dialog
  //     trigger={{
  //       children: (
  //         <Button variant={'gradient'} size={'lg'} suffixNode={<ArrowDown className="-rotate-90" />}>
  //           {formatAddress(address)}
  //         </Button>
  //       ),
  //       asChild: true
  //     }}
  //     title={
  //       <Card className="!p-2">
  //         <Flex className="items-center space-x-2">
  //           <KanitText className="text-sm">{formatAddress(address)}</KanitText>
  //           <button ref={buttonRef}>
  //             <Copy />
  //           </button>
  //         </Flex>
  //       </Card>
  //     }
  //     content={{ className: 'max-w-[372px]' }}
  //   ></Dialog>
  // )

  return (
    <Dialog
      title={
        <Flex className="mr-4 flex-1 items-center justify-between">
          <KanitText className="flex items-center space-x-2 text-base font-normal" variant={'primary'}>
            <span>{formatAddress(address)}</span>
            <CopyAddress />
          </KanitText>
          <Button variant={'secondary'} className="size-10 rounded-full px-0" onClick={() => disconnect()}>
            <Exit className="size-4" />
          </Button>
        </Flex>
      }
      trigger={{
        asChild: true,
        children: (
          <Button variant={'gradient'} size={'lg'} suffixNode={<ArrowDown className="-rotate-90" />}>
            {formatAddress(address)}
          </Button>
        )
      }}
      content={{
        forceMount: true,
        className: 'max-w-[372px] space-y-4'
      }}
    >
      {tokenConfig &&
        [tokenConfig.ETH, tokenConfig.UCO, tokenConfig.USDT, tokenConfig.WETH].map((token) => (
          <Flex key={token.symbol} className="items-center justify-between">
            <Flex className="space-x-2">
              <TokenImage token={token} className="size-6 lg:size-7" />
              <KanitText className="font-semibold text-text-primary lg:text-xl">{token.symbol}</KanitText>
            </Flex>
            <TokenBalance token={token} />
          </Flex>
        ))}
    </Dialog>
  )
}

export default ConnectWallet
