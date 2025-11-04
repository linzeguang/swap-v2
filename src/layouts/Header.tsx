import React from 'react'

import ConnectWallet from '@/components/ConnectWallet'
import { LogoWithName } from '@/components/svgr/logo'
import { Flex, Viewport } from '@/components/ui/Box'

import Navs from './Navs'

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
      <Viewport className="flex items-center justify-between">
        <Flex className="space-x-6">
          <LogoWithName />
          <Navs />
        </Flex>
        <ConnectWallet />
      </Viewport>
    </header>
  )
}

export default Header
