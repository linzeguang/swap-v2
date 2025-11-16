import React from 'react'

import { NumberInput } from '../ui/Input'
import { KanitText } from '../ui/Text'
import TokenSelect from './TokenSelect'

export interface ProInputProps {
  title: React.ReactNode
}
const TokenAmountInput: React.FC<ProInputProps> = ({ title }) => {
  return (
    <div className="space-y-3">
      {title && <KanitText className="text-xs text-secondary">{title}</KanitText>}
      <NumberInput
        prefixNode={<TokenSelect dialogProps={{ title }} />}
        size={'xl'}
        decimals={0}
        max={100}
        min={10}
        className="text-right text-secondary"
      />
    </div>
  )
}

export default TokenAmountInput
