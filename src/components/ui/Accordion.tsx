import * as AccordionPrimitive from '@radix-ui/react-accordion'
import React from 'react'

import { cn } from '@/lib/utils'

const AccordionRoot = AccordionPrimitive.Root

const AccordionArrow: React.FC<React.ComponentProps<'svg'>> = (props) => (
  <svg
    width="42"
    height="38"
    viewBox="0 0 42 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn('accordion-arrow w-10 shrink-0 transition-transform duration-200', props.className)}
  >
    <g id="Component 12">
      <g id="Container">
        <g id="Component 1" opacity="0.5">
          <path
            id="Vector"
            d="M15 13.8217L15 24.1783C15 24.9674 15.8712 25.4456 16.5369 25.022L24.6742 19.8437C25.2917 19.4507 25.2917 18.5493 24.6742 18.1563L16.5369 12.978C15.8712 12.5544 15 13.0326 15 13.8217Z"
            fill="currentColor"
          />
        </g>
      </g>
    </g>
  </svg>
)

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { showArrow?: boolean }
>(({ className, children, showArrow = true, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 cursor-pointer items-center justify-between text-left text-sm font-medium transition-all [&[data-state=open]_.accordion-arrow]:rotate-90',
        className
      )}
      {...props}
    >
      {children}
      {showArrow && <AccordionArrow className="text-accordion-arrow" />}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn('pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { AccordionArrow, AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger }
