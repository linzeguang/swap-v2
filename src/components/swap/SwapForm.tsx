import { Trans } from '@lingui/react/macro'
import React from 'react'

import TokenAmountInput from '../common/TokenAmountInput'
import { Card } from '../ui/Box'

const SwapForm: React.FC = () => {
  return (
    <Card>
      <TokenAmountInput title={<Trans>From</Trans>} />
    </Card>
  )
}

export default SwapForm
