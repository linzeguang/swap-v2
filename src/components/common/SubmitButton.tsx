import { Trans } from '@lingui/react/macro'
import { useAppKit } from '@reown/appkit/react'
import React, { ComponentPropsWithRef, ComponentRef, PropsWithChildren, useCallback, useMemo } from 'react'

import { cn, isUndefined } from '@/lib/utils'

import { WalletFill } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { Button } from '../ui/Button'
import { KanitText } from '../ui/Text'

interface SubmitButtonProps extends ComponentPropsWithRef<typeof Button> {
  walletConnect?: boolean
  insufficientBalance?: boolean
  insufficientBalanceText?: React.ReactNode
}
const SubmitButton = React.forwardRef<ComponentRef<typeof Button>, PropsWithChildren<SubmitButtonProps>>(
  ({
    children,
    walletConnect,
    insufficientBalance,
    insufficientBalanceText,
    disabled,
    isLoading,
    className,
    onClick,
    ...props
  }) => {
    const { open } = useAppKit()

    const connect = useCallback(() => {
      open({ view: 'Connect' })
    }, [open])

    const [content, event] = useMemo(() => {
      if (!isUndefined(walletConnect) && !walletConnect)
        return [
          <Flex className="items-center space-x-2">
            <KanitText>
              <Trans>Connect Wallet</Trans>
            </KanitText>
            <WalletFill />
          </Flex>,
          connect
        ]
      if (!isUndefined(insufficientBalance) && insufficientBalance)
        return [
          insufficientBalanceText || (
            <KanitText>
              <Trans>Insufficient Balance</Trans>
            </KanitText>
          )
        ]
      return [children, onClick]
    }, [children, connect, insufficientBalance, insufficientBalanceText, onClick, walletConnect])

    return (
      <Button
        variant={'gradient'}
        size={'xl'}
        className={cn('w-full', className)}
        onClick={event}
        disabled={insufficientBalance || disabled || isLoading}
        isLoading={isLoading}
        {...props}
      >
        {content}
      </Button>
    )
  }
)
SubmitButton.displayName = 'SubmitButton'

export default SubmitButton
