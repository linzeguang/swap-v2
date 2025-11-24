import { Trans } from '@lingui/react/macro'
import React, { useState } from 'react'

import { Card } from '../ui/Box'
import { ButtonRadioGroup } from '../ui/Button'

export enum Trade {
  Swap,
  TWAP,
  Limit
}

const TradeType = () => {
  const [trade, setTrade] = useState(Trade.Swap)

  return (
    <Card>
      <ButtonRadioGroup
        value={trade}
        options={[
          {
            label: <Trans>Swap</Trans>,
            value: Trade.Swap
          },
          {
            label: <Trans>TWAP</Trans>,
            value: Trade.TWAP
          },
          {
            label: <Trans>Limit</Trans>,
            value: Trade.Limit
          }
        ]}
        onChangeValue={setTrade}
      />
    </Card>
  )
}

export default TradeType
