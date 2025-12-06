import React from 'react'

import ConnectWallet from '@/components/ConnectWallet'
import { LogoName } from '@/components/svgr/logo'
import { Flex, Viewport } from '@/components/ui/Box'
import { cn } from '@/lib/utils'

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <header className={cn('flex items-center justify-between', props.className)}>
      <Viewport className="flex items-center justify-between">
        <Flex className="space-x-6">
          <LogoName />
        </Flex>
        <ConnectWallet />
      </Viewport>
    </header>
  )
}

export default Header
