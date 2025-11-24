import { Trans } from '@lingui/react/macro'
import React from 'react'
import { NavLink } from 'react-router'

import { RoutePath } from '@/routes'

import { Arrow } from '../svgr/pool'
import { KanitText } from '../ui/Text'

const PositionNav: React.FC = () => {
  return (
    <NavLink to={RoutePath.Positions} className={'flex items-center space-x-2'}>
      <KanitText className="text-base font-bold text-secondary">
        <Trans>Your positions</Trans>
      </KanitText>
      <Arrow className="text-primary" />
    </NavLink>
  )
}

export default PositionNav
