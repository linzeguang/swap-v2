import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentRef } from 'react'

import { cn } from '@/lib/utils'

const inputVariants = cva(cn('flex items-center bg-input-bg'), {
  variants: {
    size: {
      xs: '',
      sm: '',
      md: 'h-10 px-4 rounded-full',
      lg: '',
      xl: 'p-4 rounded-3xl text-2xl font-semibold'
    },
    border: {
      true: 'border border-input-border focus-within:border-input-border-focus hover:border-input-border-focus'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  prefixNode?: React.ReactNode
  suffixNode?: React.ReactNode
  wrapperProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixNode, suffixNode, size, border, wrapperProps, ...inputProps }, ref) => {
    return (
      <label {...wrapperProps} className={cn(inputVariants({ className: wrapperProps?.className, size, border }))}>
        {prefixNode}
        <div className="flex-1">
          <input {...inputProps} ref={ref} className={cn('w-full bg-transparent font-Kanit', inputProps?.className)} />
        </div>
        {suffixNode}
      </label>
    )
  }
)
Input.displayName = 'Input'

export interface NumberInputProps extends InputProps {
  decimals?: number
}
export const NumberInput = React.forwardRef<ComponentRef<typeof Input>, NumberInputProps>(
  ({ decimals = 18, max, min = 0, onChange, onBlur, ...inputProps }, ref) => {
    const handleChange = React.useCallback(
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        let value = ev.target.value
        if (value === '.') value = '0.'
        else value = value.replace(/[^0-9\\.]/, '')

        const [intPart, decimalPart = ''] = value.split('.')
        if (decimals === 0) {
          // 只取整数
          value = intPart
        } else {
          const trimmedDecimal = decimalPart.slice(0, decimals)
          if (trimmedDecimal.length) {
            value = `${intPart}.${trimmedDecimal}`
          }
        }

        ev.target.value = value
        onChange?.(ev)
      },
      [decimals, onChange]
    )

    const handleBlur = React.useCallback(
      (ev: React.FocusEvent<HTMLInputElement, Element>) => {
        let value = ev.target.value
        const numValue = Number(value)
        if (numValue) {
          if (max !== undefined) {
            const numMax = Number(max)
            if (numValue > numMax) value = numMax.toString()
          }
          if (min !== undefined) {
            const numMin = Number(min)
            if (numValue < numMin) value = numMin.toString()
          }
        }

        ev.target.value = value
        onBlur?.(ev)
      },
      [max, min, onBlur]
    )

    return (
      <Input
        ref={ref}
        {...inputProps}
        type="text"
        inputMode="decimal"
        pattern="[0-9]+(\.[0-9]+)?"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }
)
