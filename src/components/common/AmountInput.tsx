import React, { ComponentPropsWithRef } from 'react'

import { cn } from '@/lib/utils'

import { NumberInput } from '../ui/Input'
import { KanitText } from '../ui/Text'
import TokenSelect from './TokenSelect'

interface ProInputProps extends Omit<React.ComponentPropsWithRef<typeof NumberInput>, 'title'> {
  title?: React.ReactNode
  token?: ComponentPropsWithRef<typeof TokenSelect>['token']
  tokenSelectDialogProps?: ComponentPropsWithRef<typeof TokenSelect>['dialogProps']
  suffixNode?: React.ReactNode
  onTokenSelect?: ComponentPropsWithRef<typeof TokenSelect>['onTokenSelect']
}
export const TokenAmountInput: React.FC<ProInputProps> = ({
  title,
  token,
  suffixNode,
  className,
  tokenSelectDialogProps,
  onTokenSelect,
  ...props
}) => {
  return (
    <div className="space-y-3">
      {React.isValidElement(title) || Array.isArray(title) ? (
        title
      ) : (
        <KanitText className="text-xs text-secondary">{title}</KanitText>
      )}
      <NumberInput
        prefixNode={<TokenSelect dialogProps={tokenSelectDialogProps} token={token} onTokenSelect={onTokenSelect} />}
        size={'xl'}
        decimals={token?.decimals}
        min={0}
        placeholder="0.00"
        className={cn('text-right text-text-primary', className)}
        {...props}
      />
      {suffixNode}
    </div>
  )
}

export const LiquidityAmountInput: React.FC<ProInputProps> = ({
  title,
  token,
  suffixNode,
  className,
  onTokenSelect,
  ...props
}) => {
  return (
    <div className="space-y-3 rounded-3xl bg-input-bg p-4 lg:px-6 lg:py-4">
      <NumberInput
        prefixNode={<TokenSelect dialogProps={{ title }} token={token} onTokenSelect={onTokenSelect} />}
        size={'xl'}
        decimals={token?.decimals}
        min={0}
        placeholder="0.00"
        className={cn('text-right text-text-primary', className)}
        wrapperProps={{
          className: 'bg-transparent px-0 py-0'
        }}
        {...props}
      />
      {suffixNode}
    </div>
  )
}
