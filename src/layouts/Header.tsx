import React from 'react'

import ConnectWallet from '@/components/ConnectWallet'
import Network from '@/components/Network'
import { Viewport } from '@/components/ui/Box'
import useMediaQuery from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

import Menu from './Menu'

const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { isMobile } = useMediaQuery()

  return (
    <header className={cn('header flex items-center justify-between', props.className)}>
      <Viewport className="flex items-center justify-end space-x-3">
        <Network />
        <ConnectWallet />
        {isMobile && <Menu />}
      </Viewport>
    </header>
  )
}

export default Header
