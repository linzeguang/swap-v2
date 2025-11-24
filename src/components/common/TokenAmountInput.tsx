import React, { ComponentPropsWithRef } from 'react'

import { NumberInput } from '../ui/Input'
import { KanitText } from '../ui/Text'
import TokenSelect from './TokenSelect'

export interface ProInputProps {
  title?: React.ReactNode
  token?: ComponentPropsWithRef<typeof TokenSelect>['token']
  suffixNode?: React.ReactNode

  onTokenSelect?: ComponentPropsWithRef<typeof TokenSelect>['onTokenSelect']
}
const TokenAmountInput: React.FC<ProInputProps> = ({ title, token, suffixNode, onTokenSelect }) => {
  return (
    <div className="space-y-3">
      {title && <KanitText className="text-xs text-secondary">{title}</KanitText>}
      <NumberInput
        prefixNode={<TokenSelect dialogProps={{ title }} token={token} onTokenSelect={onTokenSelect} />}
        size={'xl'}
        decimals={0}
        max={100}
        min={10}
        placeholder="0.00"
        className="text-right text-secondary"
      />
      {suffixNode}
    </div>
  )
}

export default TokenAmountInput
