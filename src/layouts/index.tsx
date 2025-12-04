import React from 'react'

import Header from './Header'
import Main from './Main'
import SideBar from './SideBar'

const RootLayout: React.FC = () => {
  return (
    <section className="grid h-screen grid-rows-[4.5rem_1fr_auto] lg:grid-cols-[auto_1fr] lg:grid-rows-[4.5rem_1fr]">
      <Header className="lg:col-span-full" />
      <SideBar className="lg:col-span-1" />
      <Main />
    </section>
  )
}

export default RootLayout
