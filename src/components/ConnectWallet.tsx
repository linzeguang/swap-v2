import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import React, { useCallback } from 'react'

import { formatAddress } from '@/lib/format'

import { DeadlineField, InfiniteApprovalField, SlippageField } from './common/Settings'
import { ArrowDown } from './svgr/icons'
import { Card, Flex } from './ui/Box'
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
      <Button variant={'gradient'} onClick={connect}>
        <KanitText>
          <Trans>Connect Wallet</Trans>
        </KanitText>
      </Button>
    )

  return (
    <DrawerRoot direction="right">
      <DrawerTrigger asChild>
        <Button variant={'gradient'} suffixNode={<ArrowDown className="-rotate-90" />}>
          {formatAddress(address)}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[20rem]">
        <Card className="h-full !rounded-r-none border-r-0">
          <Flex className="justify-end">
            <Button variant={'secondary'} className="w-full" onClick={() => disconnect()}>
              disconnect
            </Button>
          </Flex>
          <SlippageField inSide />
          <DeadlineField />
          <InfiniteApprovalField />
        </Card>
      </DrawerContent>
    </DrawerRoot>
  )
}

export default ConnectWallet
