import React, { useRef, useState } from 'react'

import { LogoName } from '@/components/svgr/logo'
import { Flex } from '@/components/ui/Box'
import { cn } from '@/lib/utils'

import Nav from './Nav'

const SideBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [collapsed] = useState(true)
  const navRef = useRef<React.ComponentRef<typeof Nav>>(null)

  return (
    <div {...props} className={cn('relative w-[18.75rem]', props.className)}>
      <aside
        className={cn(
          'absolute z-10 h-full',
          'aside transition-all [&_*]:transition-all',
          'data-[collapsed=false]:w-50 data-[collapsed=true]:w-[18.75rem]'
        )}
        data-collapsed={collapsed}
        onMouseEnter={() => {
          // setCollapsed(false)
        }}
        onMouseLeave={() => {
          // setCollapsed(true)
          navRef.current?.closeAccordion()
        }}
      >
        <Flex className="h-28 items-center justify-center">
          <LogoName />
        </Flex>
        <Nav ref={navRef} collapsed={collapsed} />
      </aside>
    </div>
  )
}

export default SideBar
