import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import React, { useCallback } from 'react'

import { formatAddress } from '@/lib/format'

import { ArrowDown } from './svgr/icons'
import { Button } from './ui/Button'
import { Dialog } from './ui/Dialog'
import { KanitText } from './ui/Text'

const ConnectWallet: React.FC = () => {
  const { isConnected, address } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const { open } = useAppKit()

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
        <Button variant={'secondary'} onClick={() => disconnect()}>
          disconnect
        </Button>
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
        className: 'max-w-[372px]'
      }}
    ></Dialog>
  )
}

export default ConnectWallet
