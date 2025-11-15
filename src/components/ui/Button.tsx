import { Trans } from '@lingui/react/macro'
import { useAppKit } from '@reown/appkit/react'
import { cva, VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes, ComponentProps, useCallback } from 'react'

import { cn } from '@/lib/utils'

import { Flex } from './Box'

const buttonVariants = cva(cn('flex items-center justify-center rounded-2xl text-base font-Kanit'), {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground'
    },
    size: {
      sm: 'h-6 px-3 space-x-1.5',
      md: 'h-8 px-4 space-x-2',
      lg: 'h-10 px-5 space-x-3',
      xl: 'h-12 px-6 space-x-4'
    },
    ghost: {
      true: 'bg-transparent'
    }
  },
  compoundVariants: [
    {
      ghost: true,
      variant: 'primary',
      className: 'text-primary'
    },
    {
      ghost: true,
      variant: 'secondary',
      className: 'text-secondary'
    }
  ],
  defaultVariants: {
    size: 'md'
  }
})

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
      notConnected?: boolean
      isLoading?: boolean
      prefixNode?: React.ReactNode
      suffixNode?: React.ReactNode
    }
>(
  (
    { children, className, notConnected, isLoading, prefixNode, suffixNode, variant, size, ghost, onClick, ...props },
    ref
  ) => {
    const { open } = useAppKit()

    const connect = useCallback(() => {
      open({ view: 'Connect' })
    }, [open])

    return (
      <button
        ref={ref}
        type="button"
        className={cn(buttonVariants({ variant, size, ghost, className }))}
        onClick={(ev) => {
          if (notConnected) connect()
          else onClick?.(ev)
        }}
        {...props}
      >
        {prefixNode}
        {isLoading && 'loading...'}
        {notConnected ? (
          <span>
            <Trans>Connect Wallet</Trans>
          </span>
        ) : ['string', 'number'].includes(typeof children) ? (
          <span>{children}</span>
        ) : (
          children
        )}
        {suffixNode}
      </button>
    )
  }
)

export function ButtonRadioGroup<V>(props: {
  value: Exclude<V, undefined>
  options: Array<ComponentProps<typeof Button> & { label: React.ReactNode; value: Exclude<V, undefined> }>
  onChangeValue?: (value: Exclude<V, undefined>) => void
}) {
  const { options, value: currentValue, onChangeValue } = props

  return (
    <Flex className="rounded-2xl border border-border bg-input-bg">
      {options.map(({ label, value, className, onClick, ...buttonProps }) => (
        <Button
          key={value?.toString()}
          size={'lg'}
          variant={'secondary'}
          ghost={currentValue !== value}
          className={cn('flex-1', className)}
          onClick={(ev) => {
            onChangeValue?.(value)
            onClick?.(ev)
          }}
          {...buttonProps}
        >
          {label}
        </Button>
      ))}
    </Flex>
  )
}
