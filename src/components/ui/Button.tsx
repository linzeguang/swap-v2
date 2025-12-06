import { cva, VariantProps } from 'class-variance-authority'
import React, { ButtonHTMLAttributes, ComponentProps } from 'react'
import { useHover } from 'react-use'

import { cn } from '@/lib/utils'

import { Loading } from '../svgr/icons'
import { Flex } from './Box'

const buttonVariants = cva(
  cn(
    'flex items-center justify-center rounded-2xl text-base font-Kanit border disabled:bg-none disabled:bg-disabled disabled:border-disabled '
  ),
  {
    variants: {
      variant: {
        default: 'bg-content text-secondary border-content',
        gradient: 'gradient-button border-0 text-text-primary',
        primary: 'bg-primary text-primary-foreground border-primary',
        secondary: 'bg-secondary text-secondary-foreground border-secondary',
        radio: 'bg-input-bg text-secondary border-input-bg hover:bg-secondary hover:text-secondary-foreground'
      },
      size: {
        xs: 'h-5 px-2  text-xs',
        sm: 'h-6 px-3 space-x-1.5 [&_.loading]:size-2',
        md: 'h-8 px-4 space-x-2 [&_.loading]:size-3',
        lg: 'h-10 px-5 space-x-3 [&_.loading]:size-4',
        xl: 'h-12 px-6 space-x-4 [&_.loading]:size-6'
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
      },
      {
        outline: true,
        variant: 'gradient',
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
      onHoveredVariant?: (hovered: boolean) => VariantProps<typeof buttonVariants>['variant']
      onHoveredOutline?: (hovered: boolean) => VariantProps<typeof buttonVariants>['outline']
      onHoveredGhost?: (hovered: boolean) => VariantProps<typeof buttonVariants>['ghost']
    }
>(
  (
    {
      children,
      className,
      isLoading,
      prefixNode,
      suffixNode,
      variant,
      size,
      ghost,
      outline,
      onHoveredVariant,
      onHoveredOutline,
      onHoveredGhost,
      ...props
    },
    ref
  ) => {
    const [hoverable] = useHover((hovered) => (
      <button
        ref={ref}
        type="button"
        className={cn(
          buttonVariants({
            size,
            variant: onHoveredVariant?.(hovered) || variant,
            outline: onHoveredOutline?.(hovered) || outline,
            ghost: onHoveredGhost?.(hovered) || ghost,
            className
          })
        )}
        {...props}
      >
        {prefixNode}
        {isLoading ? (
          <Loading className="loading" />
        ) : React.isValidElement(children) || Array.isArray(children) ? (
          children
        ) : (
          <span>{children}</span>
        )}

        {suffixNode}
      </button>
    ))

    return hoverable
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
