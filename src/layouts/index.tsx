import React from 'react'

import useMediaQuery from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

import Header from './Header'
import Main from './Main'
import SideBar from './SideBar'

const RootLayout: React.FC = () => {
  const { isMobile } = useMediaQuery()
  return (
    <section
      className={cn(
        'grid h-screen grid-cols-[18.75rem_1fr]',
        isMobile ? 'grid-rows-[4rem_1fr]' : 'grid-rows-[5.5rem_1fr]'
      )}
    >
      {!isMobile && <SideBar className="row-span-full" />}
      <Header />
      <Main />
    </section>
  )
}

export default RootLayout
