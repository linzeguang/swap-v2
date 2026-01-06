import React from 'react'
import { Outlet } from 'react-router'

const Main: React.FC = () => {
  return (
    <main id="main" className="main overflow-auto p-4 lg:p-12">
      <Outlet />
    </main>
  )
}

export default Main
