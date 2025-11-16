import React from 'react'

import SwapForm from '@/components/swap/SwapForm'
import TradeType from '@/components/swap/TradeType'

const Swap: React.FC = () => {
  return (
    <div className="mx-auto mt-[42px] w-full max-w-[480px] space-y-4">
      <TradeType />
      <SwapForm />
    </div>
  )
}

export default Swap
