import { Trans } from '@lingui/react/macro'
import React from 'react'

import { Grid } from '../ui/Box'
import { Button } from '../ui/Button'

const HalfMax: React.FC<{
  onHalf?: (val: number) => void
  onMax?: (val?: number) => void
  onClick?: (val: number) => void
}> = ({ onHalf, onMax, onClick }) => {
  return (
    <Grid className="grid-cols-2 gap-2">
      <Button
        size={'sm'}
        onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
        onHoveredOutline={(hovered) => !hovered}
        onClick={() => {
          onClick?.(0.5)
          onHalf?.(0.5)
        }}
      >
        <Trans>Half</Trans>
      </Button>
      <Button
        size={'sm'}
        onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
        onHoveredOutline={(hovered) => !hovered}
        onClick={() => {
          onClick?.(1)
          onMax?.(1)
        }}
      >
        <Trans>Max</Trans>
      </Button>
    </Grid>
  )
}

export default HalfMax
