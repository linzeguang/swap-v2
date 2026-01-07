import React, { useState } from 'react'

import * as Icon from '@/components/svgr/icons'
import { DrawerContent, DrawerRoot, DrawerTrigger } from '@/components/ui/Drawer'
import Nav from '@/layouts/Nav'

import MoreAction from './MoreAction'

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <DrawerRoot direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Icon.Menu className="text-text-primary" />
      </DrawerTrigger>
      <DrawerContent className="grid grid-rows-[1fr_auto] py-4">
        <Nav
          collapsed={false}
          className="overflow-y-scroll"
          closeMenu={() => {
            setOpen(false)
          }}
        />
        <MoreAction />
      </DrawerContent>
    </DrawerRoot>
  )
}

export default Menu
