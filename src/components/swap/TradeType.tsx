import { Trans } from '@lingui/react/macro'
import React, { useState } from 'react'

import { Card } from '../ui/Box'
import { ButtonRadioGroup } from '../ui/Button'

export enum TRADE {
  Swap,
  TWAP,
  Limit
}

const TradeType = () => {
  const [trade, setTrade] = useState(TRADE.Swap)

  return (
    <Card>
      <ButtonRadioGroup
        value={trade}
        options={[
          {
            label: <Trans>Swap</Trans>,
            value: TRADE.Swap
          },
          {
            label: <Trans>TWAP</Trans>,
            value: TRADE.TWAP
          },
          {
            label: <Trans>Limit</Trans>,
            value: TRADE.Limit
          }
        ]}
        onChangeValue={setTrade}
      />
    </Card>
  )
}

export default TradeType
