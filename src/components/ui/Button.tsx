import { cva, VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes, ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { Flex } from './Box'

const buttonVariants = cva(
  cn(
    'flex items-center justify-center rounded-2xl text-base font-Kanit border disabled:bg-disabled disabled:border-disabled '
  ),
  {
    variants: {
      variant: {
        default: 'bg-content text-secondary border-content',
        primary: 'bg-primary text-primary-foreground border-primary',
        secondary: 'bg-secondary text-secondary-foreground border-secondary',
        radio: 'bg-input-bg text-secondary border-input-bg hover:bg-secondary hover:text-secondary-foreground'
      },
      size: {
        sm: 'h-6 px-3 space-x-1.5',
        md: 'h-8 px-4 space-x-2',
        lg: 'h-10 px-5 space-x-3',
        xl: 'h-12 px-6 space-x-4'
      },
      ghost: {
        true: 'bg-transparent border-transparent'
      },
      outline: {
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
      },
      {
        outline: true,
        variant: 'secondary',
        className: 'text-secondary'
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
      isLoading?: boolean
      prefixNode?: React.ReactNode
      suffixNode?: React.ReactNode
    }
>(
  (
    { children, className, isLoading, prefixNode, suffixNode, variant, size, ghost, outline, onClick, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(buttonVariants({ variant, size, ghost, outline, className }))}
      onClick={onClick}
      {...props}
    >
      {prefixNode}
      {isLoading && 'loading...'}
      {!React.isValidElement(children) ? <span>{children}</span> : children}
      {suffixNode}
    </button>
  )
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
