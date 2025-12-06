import React, { useState } from 'react'

import * as Icon from '@/components/svgr/icons'
import { DrawerContent, DrawerRoot, DrawerTrigger } from '@/components/ui/Drawer'
import Nav from '@/layouts/Nav'

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <DrawerRoot direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Icon.Menu className="text-text-primary" />
      </DrawerTrigger>
      <DrawerContent className="grid grid-rows-[auto_1fr] p-4">
        <Nav
          collapsed={false}
          className="overflow-y-scroll"
          closeMenu={() => {
            setOpen(false)
          }}
        />
      </DrawerContent>
    </DrawerRoot>
  )
}

export default Menu
