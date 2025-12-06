import { Trans } from '@lingui/react/macro'
import { Trade } from '@pippyswap/v2-sdk'
import { Currency, Rounding, TradeType } from '@uniswap/sdk-core'
import React from 'react'

import { cn } from '@/lib/utils'

import KeyValue from '../common/KeyValue'
import { KanitText } from '../ui/Text'

const Preview: React.FC<{ trade: Trade<Currency, Currency, TradeType> }> = ({ trade }) => {
  return (
    <div className="mt-6 space-y-2.5 rounded-2xl border border-border-thin p-4">
      <KeyValue
        classname="lg:flex-row flex-col lg:items-center items-start space-x-0 lg:space-x-4"
        keyNode={`1 ${trade.route.input.symbol} ≈ ${trade.executionPrice.toSignificant(6, undefined, Rounding.ROUND_DOWN)} ${trade.route.output.symbol}`}
        valueNode={`1 ${trade.route.output.symbol} ≈ ${trade.executionPrice.invert().toSignificant(6, undefined, Rounding.ROUND_DOWN)} ${trade.route.input.symbol}`}
      />
      <KeyValue
        keyNode={
          <KanitText variant={'tertiary'} className={'text-xs'}>
            <Trans>Price impact</Trans>
          </KanitText>
        }
        valueNode={
          <KanitText variant={'tertiary'} className={cn('text-xs')}>
            {trade.priceImpact.greaterThan(0) ? '+' : ''}
            {trade.priceImpact.toFixed(2) + '%'}
          </KanitText>
        }
      />
    </div>
  )
}

export default Preview
