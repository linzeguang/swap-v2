import React from 'react'
import { Outlet } from 'react-router'

const Main: React.FC = () => {
  return (
    <main id="main" className="main overflow-auto px-4">
      <Outlet />
    </main>
  )
}

export default Main
