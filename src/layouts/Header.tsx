import React from 'react'

import ConnectWallet from '@/components/ConnectWallet'
import { LogoName } from '@/components/svgr/logo'
import { Flex, Viewport } from '@/components/ui/Box'
import { cn } from '@/lib/utils'

import Menu from './Menu'

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <header className={cn('flex items-center justify-between', props.className)}>
      <Viewport className="flex items-center justify-between">
        <Flex className="space-x-6">
          <LogoName className="w-28 lg:w-auto" />
        </Flex>
        <Flex className="space-x-3">
          <ConnectWallet />
          <Menu />
        </Flex>
      </Viewport>
    </header>
  )
}

export default Header
