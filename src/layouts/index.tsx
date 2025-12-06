import React from 'react'

import Header from './Header'
import Main from './Main'
import SideBar from './SideBar'

const RootLayout: React.FC = () => {
  return (
    <section className="grid h-screen grid-cols-[auto_1fr] grid-rows-[4.5rem_1fr]">
      <Header className="col-span-full" />
      <SideBar className="" />
      <Main />
    </section>
  )
}

export default RootLayout
