import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import React, { useImperativeHandle, useState } from 'react'

import { cn } from '@/lib/utils'

import { Close } from '../svgr/icons'
import { Button } from './Button'

const DialogRoot = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'overlay fixed bottom-0 left-0 right-0 top-0 z-[999]',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

export interface DialogMethods {
  isOpen: boolean
  open: () => void
  close: () => void
}

const dialogVariants = cva(
  cn(
    'fixed z-[999]',
    'popover rounded-4xl p-6',
    'max-h-[90%] overflow-scroll',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
  ),
  {
    variants: {
      position: {
        center: cn(
          'w-[90vw] max-w-[90vw]',
          'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          'data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]'
        ),
        bottom: cn(
          'w-full',
          'bottom-0 left-0',
          'data-[state=open]:slide-in-from-bottom-1/2',
          'data-[state=closed]:slide-out-to-bottom-1/2'
        )
      }
    },
    defaultVariants: {}
  }
)

export interface DialogProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    VariantProps<typeof dialogVariants>,
    React.PropsWithChildren {
  closeable?: boolean
  title?: React.ReactNode
  titleClassName?: string
  trigger?: React.ComponentPropsWithoutRef<typeof DialogTrigger>
  content?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { disableOutsideClose?: boolean }
}

export const Dialog = React.forwardRef<DialogMethods, DialogProps>((props, methods) => {
  const {
    trigger,
    content,
    title,
    titleClassName,
    children,
    closeable = true,
    position = 'center',
    onOpenChange,
    ...rest
  } = props
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  useImperativeHandle(
    methods,
    () => ({
      isOpen: props.open ?? isOpen,
      open: () => {
        handleOpenChange(true)
      },
      close: () => {
        handleOpenChange(false)
      }
    }),
    [isOpen, props, handleOpenChange]
  )

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange} {...rest}>
      {trigger && <DialogTrigger {...trigger} />}
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          {...content}
          className={cn(dialogVariants({ position, className: content?.className }))}
        >
          <DialogPrimitive.Title
            className={cn(
              'flex items-center justify-between text-base font-medium lg:text-xl',
              !title && !closeable && 'min-h-auto pb-0',
              titleClassName
            )}
          >
            {React.isValidElement(title) ? (
              title
            ) : (
              <label className="font-Kanit text-xl font-bold text-text-primary">{title}</label>
            )}
            {closeable && (
              <DialogClose asChild>
                <Button className={cn('size-auto border-0 !p-2')}>
                  <Close className="text-text-tertiary" />
                </Button>
              </DialogClose>
            )}
          </DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogRoot>
  )
})
