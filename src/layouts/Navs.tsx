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
          className={cn('text-text-primary font-Kanit p-4', pathname === path ? 'font-semibold' : 'font-normal')}
        >
          {name}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navs
