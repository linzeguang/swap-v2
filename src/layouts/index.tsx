import React from 'react'

import Footer from './Footer'
import Header from './Header'
import Main from './Main'

const RootLayout: React.FC = () => {
  return (
    <section className="grid min-h-screen grid-rows-[3.5rem_minmax(calc(100vh-3.5rem),1fr)_395px]">
      <Header />
      <Main />
      <Footer />
    </section>
  )
}

export default RootLayout
