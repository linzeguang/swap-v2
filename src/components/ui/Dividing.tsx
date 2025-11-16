import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/lib/utils'

const dividingVariants = cva('bg-border', {
  variants: {
    orientation: {
      vertical: 'w-[var(--dividing-wieght)] h-full',
      horizontal: 'h-[var(--dividing-wieght)] w-full'
    },
    weight: {
      default: 'dividing-wieght',
      bold: 'dividing-wieght-bold'
    }
  },
  defaultVariants: {
    orientation: 'horizontal',
    weight: 'default'
  }
})

export const Dividing: React.FC<React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dividingVariants>> = ({
  className,
  orientation,
  weight,
  ...rest
}) => <div className={cn(dividingVariants({ orientation, weight, className }))} {...rest} />
