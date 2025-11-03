import React, { type ComponentPropsWithoutRef, type ComponentRef, type HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const Box = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props} />
))
Box.displayName = 'Box'

export const Viewport = React.forwardRef<ComponentRef<typeof Box>, ComponentPropsWithoutRef<typeof Box>>(
  (props, ref) => <Box ref={ref} {...props} className={cn('viewport', props.className)} />
)
Viewport.displayName = 'Viewport'

export const Flex = React.forwardRef<ComponentRef<typeof Box>, ComponentPropsWithoutRef<typeof Box>>((props, ref) => (
  <Box ref={ref} {...props} className={cn('flex', props.className)} />
))
Flex.displayName = 'Flex'
