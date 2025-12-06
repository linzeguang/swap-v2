import React from 'react'
import { Outlet } from 'react-router'

const Main: React.FC = () => {
  return (
    <main className="px-4">
      <Outlet />
    </main>
  )
}

export default Main
