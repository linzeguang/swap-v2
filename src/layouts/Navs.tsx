import { Trans } from '@lingui/react/macro'
import React, { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router'

import { cn } from '@/lib/utils'
import { ROUTE_PATH } from '@/routes'

const Navs: React.FC = () => {
  const { pathname } = useLocation()
  const navs = useMemo(
    () => [
      {
        name: <Trans>Swap</Trans>,
        path: ROUTE_PATH.Swap
      },
      {
        name: <Trans>Pool</Trans>,
        path: ROUTE_PATH.Pool
      }
    ],
    []
  )
  return (
    <nav>
      {navs.map(({ name, path }) => (
        <NavLink
          key={path}
          to={path}
          className={cn('p-4 font-Kanit text-text-primary', pathname === path ? 'font-semibold' : 'font-normal')}
        >
          {name}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navs
