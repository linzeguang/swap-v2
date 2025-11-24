import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = TooltipPrimitive.Content

export interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipProvider> {
  root?: React.ComponentPropsWithoutRef<typeof TooltipRoot>
  portal?: React.ComponentPropsWithoutRef<typeof TooltipPortal>
  trigger?: React.ComponentPropsWithoutRef<typeof TooltipTrigger>
  content?: React.ComponentPropsWithoutRef<typeof TooltipContent>
}
export const Tooltip: React.FC<TooltipProps> = ({ root, trigger, portal, content, children, ...props }) => {
  return (
    <TooltipProvider delayDuration={0} {...props}>
      <TooltipRoot {...root}>
        <TooltipTrigger {...trigger} />
        <TooltipPortal {...portal}>
          <TooltipContent
            sideOffset={5}
            side="top"
            align="center"
            {...content}
            className={cn(
              'tip-card z-[999]',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              content?.className
            )}
          >
            {children}
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  )
}
