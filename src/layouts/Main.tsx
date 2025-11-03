import React from 'react'
import { Outlet } from 'react-router'

const Main: React.FC = () => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default Main
