import React, { ComponentPropsWithRef } from 'react'

import { cn } from '@/lib/utils'

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />
}

export const TokenSkeleton: React.FC<ComponentPropsWithRef<typeof Skeleton>> = ({ className, ...props }) => (
  <Skeleton className={cn('rounded-full', className)} {...props} />
)
