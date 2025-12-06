import { Trans } from '@lingui/react/macro'
import React from 'react'

import SwapForm from '@/components/swap/SwapForm'
import { PageTitle } from '@/components/ui/Text'

const Swap: React.FC = () => {
  return (
    <div className="mx-auto mt-[42px] w-full max-w-[480px] space-y-4">
      {/* <TradeType /> */}
      <PageTitle>
        <Trans>Swap</Trans>
      </PageTitle>
      <SwapForm />
    </div>
  )
}

export default Swap
