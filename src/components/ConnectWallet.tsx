import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import React, { useCallback } from 'react'

import { formatAddress } from '@/lib/format'

import { ArrowDown } from './svgr/icons'
import { Card } from './ui/Box'
import { Button } from './ui/Button'
import { DrawerContent, DrawerRoot, DrawerTrigger } from './ui/Drawer'
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
      <Button variant={'primary'} onClick={connect}>
        <KanitText>
          <Trans>Connect Wallet</Trans>
        </KanitText>
      </Button>
    )

  return (
    <DrawerRoot direction="right">
      <DrawerTrigger asChild>
        <Button variant={'primary'} suffixNode={<ArrowDown className="-rotate-90" />}>
          {formatAddress(address)}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[20rem]">
        <Card className="h-full !rounded-r-none border-r-0">
          <appkit-button />
          <Button variant={'primary'} onClick={() => disconnect()}>
            disconnect
          </Button>
        </Card>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default ConnectWallet
