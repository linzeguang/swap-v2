import React from 'react'

import { LogoWithName } from '@/components/svgr/logo'
import { Flex, Viewport } from '@/components/ui/Box'

import Navs from './Navs'

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
      <Viewport>
        <Flex className="space-x-6">
          <LogoWithName />
          <Navs />
        </Flex>
      </Viewport>
    </header>
  )
}

export default Header
